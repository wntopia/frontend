import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { CollaborationProvider, CollaborationSnapshot } from "./provider";
import { transformIndex } from "./text-diff";

/** textarea에서 들어온 변경의 표식. 이미 화면에 있는 변경이라 화면을 다시 고치지 않는다 */
const TEXTAREA_ORIGIN = Symbol("collaboration-textarea");

/**
 * 본문 textarea를 공동편집 문서의 `Y.Text`에 직접 잇는다. `provider`가 `null`(새 문서)이면 평범한 입력 상태다.
 *
 * Yjs 바인딩이 있는 에디터(CodeMirror · ProseMirror 등)를 들이지 않고 textarea를 그대로 쓴다. 본문이 위키 문법의
 * 평범한 글자라 서식 모델이 필요 없고, 지금 화면(미리보기 전환, 저장 검증, 포커스 이동)이 textarea를 전제로 짜여
 * 있어서다. 대신 아래를 여기서 직접 한다.
 * - 입력: 이전 본문과 새 값의 차이를 `Y.Text`의 삭제·삽입으로 바꾼다(`replaceText`).
 * - 원격 변경: textarea 값을 바꾸면 커서가 끝으로 튀므로, 변경 내용만큼 커서를 옮겨 다시 놓고 스크롤도 지킨다.
 * - 한글 조합: 조합 중에는 문서에 넣지도, 원격 변경을 받지도 않는다(`holdRemoteUpdates`). 조합이 끝나면 넣는다.
 *
 * 돌려준 `ref`를 textarea에 걸어야 한다. `textareaRef`에도 같은 요소를 넣어 화면이 포커스 이동에 쓸 수 있게 한다.
 */
export function useCollaborativeText(
  provider: CollaborationProvider | null,
  snapshot: CollaborationSnapshot,
  initialContent: string,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const [plainContent, setPlainContent] = useState(initialContent);
  // 조합 중인 값. 아직 문서에 넣지 않았으니 화면은 이 값을 그린다.
  const [composingValue, setComposingValue] = useState<string | null>(null);
  const composing = useRef(false);
  const releaseHold = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!provider) return;
    const text = provider.text;
    const observer = (
      event: { delta: Parameters<typeof transformIndex>[1] },
      transaction: { origin: unknown },
    ) => {
      if (transaction.origin === TEXTAREA_ORIGIN) return;
      const element = textareaRef.current;
      const next = text.toString();
      if (!element || element.value === next) return;
      // React가 다시 그리며 값을 넣기 전에 먼저 넣는다. 값이 같으면 React는 손대지 않아 커서가 그대로 남는다.
      const { selectionStart, selectionEnd, selectionDirection, scrollTop } =
        element;
      element.value = next;
      element.setSelectionRange(
        transformIndex(selectionStart, event.delta),
        transformIndex(selectionEnd, event.delta),
        selectionDirection ?? undefined,
      );
      element.scrollTop = scrollTop;
    };
    text.observe(observer);
    return () => text.unobserve(observer);
  }, [provider, textareaRef]);

  const finishComposition = useCallback(
    (value: string, cursor: number) => {
      if (!composing.current) return;
      composing.current = false;
      // 조합 결과를 먼저 넣고 미뤄 둔 원격 변경을 푼다. 그래야 원격 변경이 조합 결과를 기준으로 커서를 옮긴다.
      provider?.replaceText(value, cursor, TEXTAREA_ORIGIN);
      setComposingValue(null);
      releaseHold.current?.();
      releaseHold.current = null;
    },
    [provider],
  );

  const onChange = useCallback(
    (value: string, cursor: number) => {
      if (!provider) {
        setPlainContent(value);
        return;
      }
      if (composing.current) {
        setComposingValue(value);
        return;
      }
      provider.replaceText(value, cursor, TEXTAREA_ORIGIN);
    },
    [provider],
  );

  const onCompositionStart = useCallback(() => {
    if (!provider || composing.current) return;
    composing.current = true;
    releaseHold.current = provider.holdRemoteUpdates();
  }, [provider]);

  // 미리보기로 바꾸면 조합이 끝나지 않은 채 textarea가 사라질 수 있다. 원격 변경을 계속 미루지 않게 여기서 끝낸다.
  const ref = useCallback(
    (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (!element) return;
      return () => {
        textareaRef.current = null;
        finishComposition(element.value, element.selectionEnd);
      };
    },
    [textareaRef, finishComposition],
  );

  if (!provider) {
    return { content: plainContent, readOnly: false, ref, onChange };
  }
  return {
    content: composingValue ?? snapshot.text,
    // 지금 편집 상태를 받기 전에 쓴 글자는 받은 상태와 합칠 기준이 없다.
    readOnly: !snapshot.ready,
    ref,
    onChange,
    onCompositionStart,
    onCompositionEnd: finishComposition,
  };
}

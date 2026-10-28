import { useEffect, type RefObject } from "react";
import type { Awareness } from "y-protocols/awareness";
import { toCursorState } from "./presence";
import type { CollaborationProvider } from "./provider";

/**
 * 본문 textarea의 커서·선택을 awareness에 실어 다른 사람에게 보인다. textarea가 화면에 있는 동안만 부른다 —
 * 미리보기로 바꾸거나 화면을 떠나면 커서를 지워, 다른 사람 화면에 멈춘 커서가 남지 않게 한다.
 *
 * - 선택은 `selectionchange`(마우스·방향키)와 입력·포커스로 바뀐다. 한 프레임에 한 번만 읽어 보낸다 — 끌어서 고르는
 *   동안에도 화면이 그리는 횟수보다 많이 보내지 않는다.
 * - 보낼 값은 상대 위치라 커서가 같은 글자 옆에 있는 한 같은 값이다. 앞의 값과 같으면 보내지 않는다. 그래서 중간에서
 *   글자를 이어 치거나 남의 변경으로 내 커서가 밀릴 때는 보내지 않는다(받는 쪽이 같은 글자를 기준으로 다시 찾는다).
 * - 한글 조합 중에는 textarea 값이 아직 문서에 들어가지 않아 위치가 어긋나므로 보내지 않고, 조합이 끝나면 보낸다.
 * - 포커스를 잃으면 커서를 지운다. 제목이나 편집 요약에 쓰는 동안 본문에 커서가 남아 있으면 그 자리를 고치는 것처럼 보인다.
 */
export function useLocalCursor(
  provider: CollaborationProvider,
  awareness: Awareness | null,
  ready: boolean,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  useEffect(() => {
    const textarea = textareaRef.current;
    // 지금 편집 상태를 받기 전에는 화면의 본문과 문서가 달라 위치를 바꿀 기준이 없다.
    if (!awareness || !textarea || !ready) return;

    let frame = 0;
    let composing = false;
    let lastSent: string | null = null;

    const publish = () => {
      frame = 0;
      if (composing) return;
      let cursor = null;
      if (document.activeElement === textarea) {
        const length = provider.text.length;
        const start = Math.min(textarea.selectionStart, length);
        const end = Math.min(textarea.selectionEnd, length);
        const backward = textarea.selectionDirection === "backward";
        cursor = toCursorState(
          provider.text,
          backward ? end : start,
          backward ? start : end,
        );
      }
      const serialized = JSON.stringify(cursor);
      if (serialized === lastSent) return;
      lastSent = serialized;
      awareness.setLocalStateField("cursor", cursor);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(publish);
    };
    // 문서의 모든 선택 변경에 오므로 본문 칸의 것만 받는다.
    const onSelectionChange = () => {
      if (document.activeElement === textarea) schedule();
    };
    const onCompositionStart = () => {
      composing = true;
    };
    const onCompositionEnd = () => {
      composing = false;
      schedule();
    };

    document.addEventListener("selectionchange", onSelectionChange);
    textarea.addEventListener("input", schedule);
    textarea.addEventListener("focus", schedule);
    textarea.addEventListener("blur", schedule);
    textarea.addEventListener("compositionstart", onCompositionStart);
    textarea.addEventListener("compositionend", onCompositionEnd);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", onSelectionChange);
      textarea.removeEventListener("input", schedule);
      textarea.removeEventListener("focus", schedule);
      textarea.removeEventListener("blur", schedule);
      textarea.removeEventListener("compositionstart", onCompositionStart);
      textarea.removeEventListener("compositionend", onCompositionEnd);
      // 연결을 멈추며 없앤 awareness면 로컬 상태가 이미 비어 있어 아무것도 보내지 않는다.
      if (lastSent !== null && lastSent !== "null")
        awareness.setLocalStateField("cursor", null);
    };
  }, [provider, awareness, ready, textareaRef]);
}

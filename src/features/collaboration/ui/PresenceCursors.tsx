"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import type { Awareness } from "y-protocols/awareness";
import {
  presenceColorVar,
  toAbsoluteIndex,
  type PresencePeer,
} from "../model/presence";
import type { CollaborationProvider } from "../model/provider";
import { useLocalCursor } from "../model/use-local-cursor";

/**
 * 본문 textarea와 같은 글꼴 · 줄 간격 · 안쪽 여백 · 줄바꿈 규칙. 하나라도 다르면 커서가 엉뚱한 줄에 그려지므로
 * `DocumentEditor`의 textarea 클래스를 바꾸면 여기도 함께 바꾼다. 줄바꿈은 브라우저 textarea의 기본값
 * (`white-space: pre-wrap`, `overflow-wrap: break-word`)과 같다.
 */
const MIRROR_TEXT =
  "whitespace-pre-wrap break-words p-[22px] font-mono text-sm leading-[1.9]";

/** 커서 끝에 붙는 폭 없는 공백(U+200B). 본문이 줄바꿈으로 끝나면 마지막 빈 줄이 생기도록 한다 (textarea는 그 줄을 그린다) */
const LINE_FILLER = "​";

type RemoteCursor = {
  peer: PresencePeer;
  from: number;
  to: number;
  head: number;
  /** 이름표를 다시 보일 때를 가르는 값. 그 사람이 커서를 옮기거나 그 자리에서 글자를 쓰면 바뀐다 */
  activity: string;
};

type PresenceCursorsProps = {
  provider: CollaborationProvider;
  awareness: Awareness | null;
  ready: boolean;
  peers: PresencePeer[];
  /** textarea에 지금 보이는 본문 */
  text: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

/**
 * 본문 textarea 위에 다른 사람의 커서와 선택 구간을 겹쳐 그리고, 내 커서를 다른 사람에게 보낸다.
 * textarea와 함께 붙고 떨어지도록 편집기 칸 안에 둔다 — 미리보기에서는 textarea와 함께 사라진다.
 *
 * textarea는 안에 요소를 그릴 수 없어, 같은 크기 · 글꼴 · 줄바꿈의 투명한 거울(mirror) 요소를 위에 겹친다. 거울에 본문을
 * 투명한 글자로 똑같이 흘리고 커서 자리에 빈 표식을, 선택 구간에 배경을 넣으면 브라우저가 textarea와 같은 자리에
 * 배치한다. 글자 좌표를 직접 재지 않으므로 줄바꿈 · 한글 · 탭이 섞여도 textarea와 어긋나지 않는다.
 *
 * - 크기는 textarea의 안쪽 영역(스크롤바 제외)을 따라간다. 크기를 끌어 바꾸거나 스크롤바가 생기면 다시 맞춘다.
 * - 스크롤은 다시 그리지 않고 거울 안쪽을 그만큼 옮긴다.
 * - 본문이 바뀌면 거울을 다시 흘린다. 마지막 커서가 있는 줄까지만 넣는다 — 그 뒤의 글자는 앞의 배치를 바꾸지 않아,
 *   긴 문서의 앞쪽에서 함께 편집할 때 키를 누를 때마다 문서 전체를 다시 배치하지 않는다.
 * - 입력을 가로막지 않게 포인터 이벤트를 받지 않고, 화면 읽기 프로그램에서도 숨긴다.
 */
export function PresenceCursors({
  provider,
  awareness,
  ready,
  peers,
  text,
  textareaRef,
}: PresenceCursorsProps) {
  useLocalCursor(provider, awareness, ready, textareaRef);

  const [box, setBox] = useState<{ width: number; height: number } | null>(
    null,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  // 받은 상대 위치를 지금 내 문서의 위치로 바꾼다. 본문이 바뀌면(누가 앞에 글자를 넣으면) 같은 글자를 다시 찾는다.
  const cursors = useMemo(() => {
    const result: RemoteCursor[] = [];
    for (const peer of peers) {
      if (!peer.cursor) continue;
      const head = toAbsoluteIndex(
        provider.doc,
        provider.text,
        peer.cursor.head,
      );
      if (head === null) continue;
      const anchor =
        toAbsoluteIndex(provider.doc, provider.text, peer.cursor.anchor) ??
        head;
      // 내가 한글을 조합하는 동안은 화면의 본문이 문서보다 길거나 짧을 수 있다.
      const clampedHead = Math.min(head, text.length);
      const clampedAnchor = Math.min(anchor, text.length);
      result.push({
        peer,
        from: Math.min(clampedHead, clampedAnchor),
        to: Math.max(clampedHead, clampedAnchor),
        head: clampedHead,
        activity: `${JSON.stringify(peer.cursor)}|${text.slice(Math.max(0, clampedHead - 2), clampedHead)}`,
      });
    }
    return result;
  }, [peers, provider, text]);

  const visible = cursors.length > 0;

  /** 거울 안쪽을 textarea의 스크롤만큼 옮긴다. 스크롤마다 다시 그리지 않으려고 스타일을 직접 바꾼다 */
  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const content = contentRef.current;
    if (textarea && content)
      content.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
  }, [textareaRef]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!visible || !textarea) return;

    // 관찰을 시작하면 곧바로 한 번 불려 처음 크기도 여기서 잡는다.
    const observer = new ResizeObserver(() => {
      setBox((prev) =>
        prev?.width === textarea.clientWidth &&
        prev.height === textarea.clientHeight
          ? prev
          : { width: textarea.clientWidth, height: textarea.clientHeight },
      );
      syncScroll();
    });
    observer.observe(textarea);
    textarea.addEventListener("scroll", syncScroll, { passive: true });
    return () => {
      observer.disconnect();
      textarea.removeEventListener("scroll", syncScroll);
    };
  }, [visible, textareaRef, syncScroll]);

  const mirror = useMemo(
    () => (visible ? renderMirror(text, cursors) : null),
    [visible, text, cursors],
  );

  // 거울이 처음 붙을 때(크기를 잰 뒤에야 그린다)와 다시 흘린 뒤에도 지금 스크롤 위치에 맞춘다.
  useLayoutEffect(syncScroll, [syncScroll, box, mirror]);

  if (!visible || !box) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 overflow-hidden rounded-xl [contain:strict]"
      style={{ width: box.width, height: box.height }}
    >
      <div
        ref={contentRef}
        className={`${MIRROR_TEXT} text-transparent`}
        style={{ width: box.width }}
      >
        {mirror}
      </div>
    </div>
  );
}

/**
 * 본문을 커서 · 선택 경계에서 잘라 거울의 내용을 만든다. 선택이 겹치면 배경을 겹쳐 둘 다 보이게 한다.
 */
function renderMirror(text: string, cursors: RemoteCursor[]): ReactNode[] {
  const boundaries = new Set<number>([0]);
  for (const cursor of cursors) {
    boundaries.add(cursor.from);
    boundaries.add(cursor.to);
  }
  const last = Math.max(...boundaries);
  // 마지막 경계가 있는 줄의 끝까지. 그 줄의 뒷글자가 앞 단어를 다음 줄로 밀어낼 수 있어 줄 끝까지는 넣는다.
  const lineEnd = text.indexOf("\n", last);
  const end = lineEnd === -1 ? text.length : lineEnd;
  boundaries.add(end);
  const points = [...boundaries].sort((a, b) => a - b);

  const nodes: ReactNode[] = [];
  points.forEach((point, index) => {
    for (const cursor of cursors) {
      if (cursor.head === point) nodes.push(renderCaret(cursor));
    }
    const next = points[index + 1];
    if (next === undefined) return;
    let segment: ReactNode = text.slice(point, next);
    for (const cursor of cursors) {
      if (cursor.from <= point && next <= cursor.to) {
        segment = (
          <span
            className="rounded-[2px] bg-(--presence)/25 py-[3px]"
            style={colorStyle(cursor.peer.color)}
          >
            {segment}
          </span>
        );
      }
    }
    nodes.push(<span key={`segment-${point}`}>{segment}</span>);
  });
  nodes.push(LINE_FILLER);
  return nodes;
}

/**
 * 커서 막대와 이름표. 표식은 폭이 없는 인라인 요소라 줄바꿈 위치를 바꾸지 않는다(인라인 블록은 그 자리에서 줄을 바꿀
 * 수 있게 만든다). 막대는 표식의 글자 높이 가운데에 한 줄 높이로 세운다.
 *
 * 이름표는 아래 글을 가리므로 그 사람이 움직이거나 그 자리에서 쓸 때 잠깐 보였다가 사라진다(`key`로 애니메이션을 다시 건다).
 */
function renderCaret(cursor: RemoteCursor): ReactNode {
  const { peer } = cursor;
  return (
    <span
      key={`caret-${peer.clientId}`}
      className="relative"
      style={colorStyle(peer.color)}
    >
      <span className="absolute -left-px top-1/2 h-[1lh] w-0.5 -translate-y-1/2 rounded-full bg-(--presence)">
        <span
          key={cursor.activity}
          className="absolute bottom-full left-0 animate-[presence-label_3s_ease-in_forwards] whitespace-nowrap rounded-[4px] rounded-bl-none bg-(--presence) px-1.5 py-px font-sans text-[11px] font-semibold leading-[1.4] text-(--presence-fg)"
        >
          {peer.self ? `${peer.user.name} · 다른 탭` : peer.user.name}
        </span>
      </span>
    </span>
  );
}

function colorStyle(color: number): CSSProperties {
  return { "--presence": presenceColorVar(color) } as CSSProperties;
}

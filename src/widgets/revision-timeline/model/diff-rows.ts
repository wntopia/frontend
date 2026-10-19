import type { LineDiff } from "@/shared/lib";
import type { RevisionDiffRow } from "./types";

/** 바뀐 줄 앞뒤로 남겨 두는 문맥 줄 수. 백엔드가 리비전을 저장하는 unified diff의 문맥과 같은 3줄이다. */
const CONTEXT_LINES = 3;

export type RevisionDiffView = {
  rows: RevisionDiffRow[];
  /** 바뀐 줄이 있는지. 줄바꿈 문자(`\r\n` ↔ `\n`)만 바뀐 리비전은 줄 단위로는 차이가 없다. */
  changed: boolean;
  /** `LineDiff.exact`. `false`면 바뀐 구간을 통째로 지우고 더한 것으로 보여 준다는 안내를 붙인다. */
  exact: boolean;
};

/**
 * 줄 비교 결과를 '차이 보기'에 그릴 행으로 바꾼다.
 * 바뀌지 않은 긴 구간은 바뀐 줄 앞뒤 3줄만 남기고 접는다 — 긴 문서의 한 문단만 고쳐도 문서 전체가 펼쳐지지 않게.
 */
export function toDiffView({ chunks, exact }: LineDiff): RevisionDiffView {
  const rows: RevisionDiffRow[] = [];

  chunks.forEach((chunk, index) => {
    if (chunk.type !== "equal") {
      for (const text of chunk.lines) {
        rows.push({ type: "line", text, change: chunk.type });
      }
      return;
    }

    // 문서 맨 앞 구간은 뒤쪽만, 맨 끝 구간은 앞쪽만 바뀐 줄에 닿아 있어 그쪽만 문맥으로 남긴다.
    const head = index === 0 ? 0 : CONTEXT_LINES;
    const tail = index === chunks.length - 1 ? 0 : CONTEXT_LINES;
    const hidden = chunk.lines.length - head - tail;
    const context = (lines: string[]) =>
      lines.forEach((text) => rows.push({ type: "line", text }));

    // 한 줄만 접으면 접은 표시가 그 줄 자리를 그대로 차지할 뿐이라 접지 않는다.
    if (hidden <= 1) {
      context(chunk.lines);
      return;
    }
    context(chunk.lines.slice(0, head));
    rows.push({ type: "fold", count: hidden });
    context(chunk.lines.slice(chunk.lines.length - tail));
  });

  return {
    rows,
    changed: chunks.some((chunk) => chunk.type !== "equal"),
    exact,
  };
}

"use client";

import { useState } from "react";
import type { RevisionDiffLine, RevisionDiffRow } from "../model/types";
import type { RevisionDiffState } from "../model/use-revision-diff";

/**
 * 한 번에 그리는 행 수. 대부분 바뀐 긴 문서는 행이 수천 개라, 펼치자마자 모두 그리면 그것만으로 화면이 멈춘다.
 * 300행을 그리는 데 CPU를 4배 느리게 한 Chrome에서 스타일·레이아웃만 60ms쯤 걸려, 긴 작업 기준(50ms) 안쪽으로 줄였다.
 * 넘치는 행은 '더 보기'로 이만큼씩 늘려 그린다.
 */
const ROW_BATCH = 200;

type LineTone = NonNullable<RevisionDiffLine["change"]> | "context";

/** 시안의 추가 · 삭제 줄 모양. 색만으로 구분되지 않도록 앞에 +/- 표시를 둔다(시안도 줄 앞에 +/-가 있다). */
const LINE_STYLE: Record<
  LineTone,
  { row: string; text: string; sign: string; label?: string }
> = {
  added: {
    row: "bg-success/10 text-success-fg",
    text: "",
    sign: "+",
    label: "추가",
  },
  removed: {
    row: "bg-danger/[0.08] text-danger-fg",
    text: "line-through decoration-danger/40",
    sign: "-",
    label: "삭제",
  },
  context: { row: "text-fg-subtle", text: "", sign: "" },
};

const BUTTON =
  "cursor-pointer rounded-[7px] bg-surface-2 elevate-control px-2.5 py-[5px] text-xs text-fg-soft";

type RevisionDiffProps = {
  state: RevisionDiffState;
  onRetry: () => void;
};

/** 리비전 카드를 펼쳤을 때의 변경 내용 — 불러오는 중 · 실패 · 줄 단위 차이 */
export function RevisionDiff({ state, onRetry }: RevisionDiffProps) {
  const [rowLimit, setRowLimit] = useState(ROW_BATCH);

  switch (state.status) {
    case "idle":
    case "loading":
      return (
        <p role="status" className="text-xs text-fg-subtle">
          바뀐 내용을 불러오는 중…
        </p>
      );
    case "error":
      return (
        <div role="alert" className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-danger">
            바뀐 내용을 불러오지 못했습니다.
          </span>
          <button type="button" onClick={onRetry} className={BUTTON}>
            다시 시도
          </button>
        </div>
      );
  }

  if (!state.changed) {
    return (
      <p className="text-xs text-fg-subtle">
        줄바꿈 문자만 바뀌어 줄 단위로는 달라진 내용이 없습니다.
      </p>
    );
  }

  const rows = state.rows.slice(0, rowLimit);
  const remainingLines = countLines(state.rows.slice(rowLimit));

  return (
    <div>
      {!state.exact && (
        <p className="mb-2.5 text-xs leading-[1.6] text-fg-subtle">
          바뀐 줄이 많아 줄끼리 짝짓지 않고, 바뀐 구간 전체를 지운 줄과 더한
          줄로 보여 줍니다.
        </p>
      )}

      <div className="font-mono text-[13px] leading-[1.9]">
        {rows.map((row, index) =>
          row.type === "fold" ? (
            <div
              key={index}
              className="my-1 px-1 font-sans text-[11.5px] text-fg-subtle"
            >
              <span aria-hidden="true">⋯ </span>바뀌지 않은{" "}
              {row.count.toLocaleString("ko-KR")}줄
            </div>
          ) : (
            <DiffLine key={index} line={row} />
          ),
        )}
      </div>

      {rows.length < state.rows.length && (
        <button
          type="button"
          onClick={() => setRowLimit((limit) => limit + ROW_BATCH)}
          className={`${BUTTON} mt-3`}
        >
          더 보기 · {remainingLines.toLocaleString("ko-KR")}줄 남음
        </button>
      )}
    </div>
  );
}

function DiffLine({ line }: { line: RevisionDiffLine }) {
  const style = LINE_STYLE[line.change ?? "context"];

  return (
    <div className={`flex gap-2 rounded-[3px] px-1 py-0.5 ${style.row}`}>
      <span aria-hidden="true" className="w-[1ch] flex-shrink-0 select-none">
        {style.sign}
      </span>
      {/* 빈 줄도 한 줄 높이를 차지해야 빈 줄을 더하거나 지운 것이 보인다. */}
      <span
        className={`min-h-lh min-w-0 flex-1 whitespace-pre-wrap [overflow-wrap:anywhere] ${style.text}`}
      >
        {style.label && <span className="sr-only">{style.label}: </span>}
        {line.text}
      </span>
    </div>
  );
}

/** 접힌 행은 줄 수로 세지 않는다 — '더 보기'로 새로 보게 될 줄만 센다. */
function countLines(rows: RevisionDiffRow[]): number {
  return rows.filter((row) => row.type === "line").length;
}

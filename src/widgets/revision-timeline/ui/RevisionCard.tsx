"use client";

import { useState } from "react";
import type { ChangeSummarySegment } from "@/entities/document";
import type { Revision, RevisionDiffLine } from "../model/mock";

const SEGMENT_EMPHASIS: Record<
  NonNullable<ChangeSummarySegment["emphasis"]>,
  string
> = {
  strong: "font-bold",
  count: "font-bold text-success",
};

const DELTA_TONE = {
  added: "text-success",
  neutral: "text-fg-subtle",
} as const;

const DIFF_LINE: Record<NonNullable<RevisionDiffLine["change"]>, string> = {
  added: "rounded-[3px] bg-success/10 px-1 py-0.5 text-[#9be3c4]",
  removed:
    "rounded-[3px] bg-[#ff6b6b]/[0.08] px-1 py-0.5 text-[#ff9b9b] line-through decoration-[#ff6b6b]/40",
};

type RevisionCardProps = {
  revision: Revision;
};

/** 타임라인의 리비전 카드. diff가 있으면 '차이 보기' 토글로 펼친다. */
export function RevisionCard({ revision }: RevisionCardProps) {
  const [diffOpen, setDiffOpen] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-[#131417] px-4 py-[14px]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-fg">
          {revision.summary.map((segment, index) => (
            <span
              key={index}
              className={
                segment.emphasis ? SEGMENT_EMPHASIS[segment.emphasis] : undefined
              }
            >
              {segment.text}
            </span>
          ))}
        </div>
        {revision.diff && (
          <button
            type="button"
            onClick={() => setDiffOpen((prev) => !prev)}
            className="cursor-pointer rounded-[7px] border border-line-strong bg-surface-2 px-2.5 py-[5px] text-xs text-[#a8adb5]"
          >
            {diffOpen ? "차이 닫기" : "차이 보기"}
          </button>
        )}
        {revision.delta && (
          <span className={`font-mono text-xs ${DELTA_TONE[revision.delta.tone]}`}>
            {revision.delta.text}
          </span>
        )}
      </div>

      <div className="mt-[5px] font-mono text-[11.5px] text-fg-subtle">
        {revision.time}
      </div>

      {revision.diff && diffOpen && (
        <div className="mt-[14px] border-t border-[#202329] pt-[14px] font-mono text-[13px] leading-[1.9]">
          {revision.diff.map((line, index) => (
            <div
              key={index}
              className={line.change ? DIFF_LINE[line.change] : "text-fg-subtle"}
            >
              {line.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { ChangeSummarySegment } from "@/entities/document";
import type { Revision } from "../model/types";
import { useRevisionDiff } from "../model/use-revision-diff";
import { RevisionDiff } from "./RevisionDiff";

const SEGMENT_EMPHASIS: Record<
  NonNullable<ChangeSummarySegment["emphasis"]>,
  string
> = {
  strong: "font-bold",
  count: "font-bold text-success",
};

const DELTA_TONE = {
  added: "text-success",
  removed: "text-danger",
  neutral: "text-fg-subtle",
} as const;

type RevisionCardProps = {
  revision: Revision;
};

/** 타임라인의 리비전 카드. 직전 리비전이 있으면 '차이 보기'로 바뀐 줄을 펼친다. */
export function RevisionCard({ revision }: RevisionCardProps) {
  const [diffOpen, setDiffOpen] = useState(false);
  const diff = useRevisionDiff(revision.compare);
  const panelId = useId();

  const toggleDiff = () => {
    // 처음 펼칠 때만 불러온다. 실패한 뒤에는 패널의 '다시 시도'로 다시 부른다.
    if (!diffOpen && diff.state.status === "idle") diff.load();
    setDiffOpen((open) => !open);
  };

  return (
    <div className="rounded-xl bg-surface px-4 py-[14px] elevate-1">
      {/* 편집 요약은 사용자가 쓴 글이라 길 수 있다. 줄바꿈되더라도 오른쪽의 글자 수 변화를 밀어내지 않게 한다. */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 break-words text-sm text-fg">
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
        {(revision.compare || revision.delta) && (
          <div className="flex flex-shrink-0 items-center gap-3">
            {revision.compare && (
              <button
                type="button"
                onClick={toggleDiff}
                aria-expanded={diffOpen}
                aria-controls={diffOpen ? panelId : undefined}
                className="cursor-pointer rounded-[7px] bg-surface-2 elevate-control px-2.5 py-[5px] text-xs text-fg-soft"
              >
                {diffOpen ? "차이 닫기" : "차이 보기"}
              </button>
            )}
            {revision.delta && (
              <span
                className={`font-mono text-xs ${DELTA_TONE[revision.delta.tone]}`}
              >
                {revision.delta.text}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 링크 색은 감싼 쪽에 둔다. 전역 `a { color: inherit }`가 레이어 밖에 있어 링크에 붙인 색 유틸리티를 이긴다. */}
      <div className="mt-[5px] flex items-center justify-between gap-3 text-fg-subtle">
        <div className="font-mono text-[11.5px]">
          {revision.time}
          {revision.minor && " · 가벼운 수정"}
        </div>
        {revision.href && (
          // 카드마다 미리 가져오면 목록이 보이기만 해도 리비전 재구성 요청이 카드 수만큼 백엔드로 간다.
          <Link
            href={revision.href}
            prefetch={false}
            className="flex-shrink-0 text-xs"
          >
            이 버전 보기
          </Link>
        )}
      </div>

      {diffOpen && (
        <div
          id={panelId}
          className="mt-[14px] border-t border-divider pt-[14px]"
        >
          <RevisionDiff state={diff.state} onRetry={diff.load} />
        </div>
      )}
    </div>
  );
}

import type { Revision, RevisionKind } from "../model/types";
import { RevisionCard } from "./RevisionCard";

const MARKER: Record<RevisionKind, string> = {
  active: "border-success bg-success/15",
  default: "border-line-strong bg-surface-2",
};

/** 편집 역사의 리비전 타임라인 — 세로선과 마커, 리비전 카드 목록 */
export function RevisionTimeline({ revisions }: { revisions: Revision[] }) {
  return (
    <div className="relative pl-[30px]">
      <div className="absolute bottom-1.5 left-[9px] top-1.5 w-[1.5px] bg-line" />

      {revisions.map((revision, index) => (
        <div
          key={revision.id}
          className={`relative ${index < revisions.length - 1 ? "mb-[22px]" : ""}`}
        >
          <span
            className={`absolute -left-[30px] top-0.5 h-5 w-5 rounded-full border-[1.5px] ${MARKER[revision.kind]}`}
          />
          <RevisionCard revision={revision} />
        </div>
      ))}
    </div>
  );
}

import { REVISION_STATS } from "../model/mock";

const TONE = {
  accent: "text-accent",
  success: "text-success",
} as const;

/** 편집 역사 상단의 리비전 통계 카드 3종 */
export function RevisionStats() {
  return (
    <div className="flex gap-3">
      {REVISION_STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex-1 rounded-xl border border-line bg-surface px-4 py-[14px]"
        >
          <div
            className={`font-mono text-xl font-bold ${
              stat.tone ? TONE[stat.tone] : "text-fg"
            }`}
          >
            {stat.value}
          </div>
          <div className="mt-0.5 text-xs text-fg-subtle">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

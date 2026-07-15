import Link from "next/link";
import type {
  ChangeSummarySegment,
  DocumentActivity,
  RecentChange,
} from "../model/types";

const ACTIVITY_DOT: Record<DocumentActivity, string> = {
  active: "bg-success",
  created: "bg-accent/60",
  idle: "bg-[#3a3f47]",
};

const SEGMENT_EMPHASIS: Record<
  NonNullable<ChangeSummarySegment["emphasis"]>,
  string
> = {
  strong: "font-bold text-fg-muted",
  count: "font-bold text-success",
};

type RecentChangeItemProps = {
  change: RecentChange;
};

/** 최근 변경 목록의 한 줄 */
export function RecentChangeItem({ change }: RecentChangeItemProps) {
  return (
    <Link
      href={change.href}
      className="flex items-center gap-[14px] px-[18px] py-[15px] transition-colors hover:bg-[#161719]"
    >
      <span
        className={`h-2 w-2 flex-shrink-0 rounded-full ${ACTIVITY_DOT[change.activity]}`}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-semibold text-fg">{change.title}</div>
        <div className="mt-0.5 text-[12.5px] text-[#8b919a]">
          {change.summary.map((segment, index) => (
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
      </div>
      <span className="flex-shrink-0 font-mono text-[11.5px] text-fg-subtle">
        {change.time}
      </span>
    </Link>
  );
}

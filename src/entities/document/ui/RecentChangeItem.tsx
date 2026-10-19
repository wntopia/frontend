import Link from "next/link";
import { ROUTES } from "@/shared/config";
import type {
  ChangeSummarySegment,
  DocumentActivity,
  RecentChange,
} from "../model/types";

const ACTIVITY_DOT: Record<DocumentActivity, string> = {
  active: "bg-success",
  created: "bg-accent/60",
  idle: "bg-faint",
};

const SEGMENT_EMPHASIS: Record<
  NonNullable<ChangeSummarySegment["emphasis"]>,
  string
> = {
  strong: "font-bold text-fg-muted",
  count: "font-bold text-success",
};

/** 줄의 여백과 배치. 자리표시도 같은 값을 써야 불러온 뒤 목록 높이가 바뀌지 않는다. */
const ROW = "flex items-center gap-[14px] px-[18px] py-[15px]";

type RecentChangeItemProps = {
  change: RecentChange;
};

/** 최근 변경 목록의 한 줄 */
export function RecentChangeItem({ change }: RecentChangeItemProps) {
  return (
    <Link
      href={ROUTES.document(change.articleId)}
      className={`${ROW} transition-colors hover:bg-row-hover`}
    >
      <span
        className={`h-2 w-2 flex-shrink-0 rounded-full ${ACTIVITY_DOT[change.activity]}`}
      />
      <div className="min-w-0 flex-1">
        {/* 제목이 길어도 줄 높이가 같도록 한 줄로 자른다. */}
        <div className="truncate text-[14.5px] font-semibold text-fg">
          {change.title}
        </div>
        <div className="mt-0.5 truncate text-[12.5px] text-fg-dim">
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

/**
 * 최근 변경 한 줄이 들어올 자리. 글줄마다 실제 글자 크기의 줄 높이(1.5em)를 잡아 두어,
 * 불러온 줄로 바뀔 때 목록이 출렁이지 않게 한다.
 */
export function RecentChangeItemSkeleton() {
  return (
    <div aria-hidden className={`${ROW} motion-safe:animate-pulse`}>
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-elevated" />
      <div className="min-w-0 flex-1">
        <div className="flex h-[1.5em] items-center text-[14.5px]">
          <span className="h-[0.9em] w-2/5 rounded-md bg-elevated" />
        </div>
        <div className="mt-0.5 flex h-[1.5em] items-center text-[12.5px]">
          <span className="h-[0.9em] w-3/5 rounded-md bg-elevated" />
        </div>
      </div>
      <span className="h-[11px] w-10 flex-shrink-0 rounded-md bg-elevated" />
    </div>
  );
}

import { Suspense } from "react";
import type { WikiStatsResDto } from "@/shared/api";
import { nullOnFailure, publicServerApiFetch } from "@/shared/api/server";
import { SidebarCard } from "@/shared/ui";
import { fetchWikiStats } from "../api/stats";

type StatRow = {
  label: string;
  key: keyof WikiStatsResDto;
  /** 활동성을 보여 주는 값 (초록색 표시) */
  highlight?: boolean;
};

const STAT_ROWS: StatRow[] = [
  { label: "전체 문서", key: "totalArticles" },
  { label: "이번 주 편집", key: "weeklyEdits", highlight: true },
  { label: "가입 사용자", key: "registeredUsers" },
];

const ROW = "flex justify-between py-[7px] text-[13.5px]";

/** 홈 사이드바의 '위키 현황' 카드. 항목 이름은 바로 그리고 값만 불러오는 동안 자리표시를 둔다. */
export function WikiStats() {
  return (
    <SidebarCard title="위키 현황">
      <Suspense fallback={<WikiStatsSkeleton />}>
        <WikiStatValues />
      </Suspense>
    </SidebarCard>
  );
}

/**
 * 백엔드가 집계를 60초 동안 재사용해, 문서를 만들거나 고친 뒤 그만큼 늦게 바뀔 수 있다.
 * 실패해도 이 카드만 안내로 바꾸고 홈의 나머지는 그대로 둔다.
 */
async function WikiStatValues() {
  const stats = await nullOnFailure(
    fetchWikiStats(publicServerApiFetch),
    "홈 위키 현황",
  );

  if (!stats) {
    return (
      // 좁은 사이드바에서 '새로고/침해'처럼 낱말 중간에서 끊기지 않게 한다.
      <p className="break-keep text-[13px] leading-[1.6] text-fg-subtle">
        위키 현황을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.
      </p>
    );
  }

  return (
    <div className="divide-y divide-divider">
      {STAT_ROWS.map((row) => (
        <div key={row.key} className={ROW}>
          <span className="text-fg-soft">{row.label}</span>
          <b className={`font-mono ${row.highlight ? "text-success" : ""}`}>
            {stats[row.key].toLocaleString("ko-KR")}
          </b>
        </div>
      ))}
    </div>
  );
}

function WikiStatsSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">위키 현황을 불러오는 중…</span>
      <div className="divide-y divide-divider">
        {STAT_ROWS.map((row) => (
          <div key={row.key} className={ROW}>
            <span className="text-fg-soft">{row.label}</span>
            <span
              aria-hidden
              className="h-[0.9em] w-10 self-center rounded-md bg-elevated motion-safe:animate-pulse"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

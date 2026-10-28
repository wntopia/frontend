import { Suspense } from "react";
import {
  fetchRecentChanges,
  RecentChangeItem,
  RecentChangeItemSkeleton,
  toRecentChange,
} from "@/entities/document";
import { nullOnFailure, publicServerApiFetch } from "@/shared/api/server";
import { SidebarCard } from "@/shared/ui";

/** 홈에 보이는 줄 수. 시안이 다섯 줄이다. */
const RECENT_CHANGE_COUNT = 5;

const LIST = "divide-y divide-divider";

/**
 * 홈 그리드의 '최근 변경' 칸. 제목은 바로 그리고 목록은 불러오는 동안 자리표시를 보인다.
 * 줄마다 좌우 여백과 hover 면이 있어 카드 여백 없이 줄을 카드 끝까지 채운다.
 *
 * 위키 전체의 변경 목록 화면이 아직 없어 시안의 '전체 보기' 링크는 두지 않았다.
 */
export function RecentChanges() {
  return (
    <SidebarCard title="최근 변경" flush>
      <Suspense fallback={<RecentChangesSkeleton />}>
        <RecentChangeList />
      </Suspense>
    </SidebarCard>
  );
}

/**
 * 문서를 고치면 다음 요청부터 바로 보이도록 요청마다 새로 읽는다 (`publicServerApiFetch`).
 * 실패해도 이 목록만 안내로 바꾸고 홈의 나머지는 그대로 둔다.
 */
async function RecentChangeList() {
  const page = await nullOnFailure(
    fetchRecentChanges(
      { page: 0, size: RECENT_CHANGE_COUNT },
      publicServerApiFetch,
    ),
    "홈 최근 변경",
  );

  if (!page) {
    return (
      <ListMessage>
        최근 변경을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.
      </ListMessage>
    );
  }
  // 수정되지 않은 문서도 생성 시각으로 목록에 오므로, 비어 있으면 문서가 하나도 없는 것이다.
  if (page.items.length === 0) {
    return <ListMessage>아직 작성된 문서가 없습니다.</ListMessage>;
  }

  const now = new Date();
  return (
    <div className={LIST}>
      {page.items.map((change) => (
        <RecentChangeItem
          key={change.articleId}
          change={toRecentChange(change, now)}
        />
      ))}
    </div>
  );
}

function RecentChangesSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">최근 변경을 불러오는 중…</span>
      <div className={LIST}>
        {Array.from({ length: RECENT_CHANGE_COUNT }, (_, index) => (
          <RecentChangeItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function ListMessage({ children }: { children: string }) {
  return (
    <p className="break-keep px-[18px] pb-[18px] pt-1.5 text-[13.5px] text-fg-subtle">
      {children}
    </p>
  );
}

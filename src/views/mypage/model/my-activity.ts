import type {
  ContributionResDto,
  ContributionStatsResDto,
  FavoriteResDto,
  PageResDto,
} from "@/shared/api";
import { formatDate, formatRelativeTime } from "@/shared/lib";
import type { Contribution, FavoriteList, MyStats } from "./types";

export function toMyStats(stats: ContributionStatsResDto): MyStats {
  return {
    totalEdits: stats.totalEdits,
    createdDocuments: stats.createdArticles,
    todayEdits: stats.todayEdits,
    joinedOn: formatDate(stats.joinedAt),
  };
}

/**
 * 기여 한 건을 목록의 한 줄로 바꾼다. 상대 시간은 서버에서 계산하고, 한 목록이 같은 '지금'을 기준으로 하도록
 * `now`는 부르는 쪽에서 한 번만 잡아 넘긴다.
 *
 * 점 색은 홈의 최근 변경과 같은 기준이다 — 만든 문서, 오늘(한국 날짜) 고친 문서, 그 밖.
 */
export function toContribution(
  contribution: ContributionResDto,
  now: Date,
): Contribution {
  const created = contribution.type === "CREATE";
  const editedToday =
    formatDate(contribution.contributedAt) === formatDate(now);
  return {
    articleId: contribution.articleId,
    title: contribution.title,
    action: created ? "문서 생성" : "수정",
    time: formatRelativeTime(contribution.contributedAt, now),
    activity: created ? "created" : editedToday ? "active" : "idle",
  };
}

export function toFavoriteList(page: PageResDto<FavoriteResDto>): FavoriteList {
  return {
    items: page.items.map(({ articleId, title }) => ({ articleId, title })),
    restCount: Math.max(page.totalElements - page.items.length, 0),
  };
}

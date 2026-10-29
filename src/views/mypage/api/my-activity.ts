import {
  API_PATHS,
  apiFetch,
  type ContributionResDto,
  type ContributionStatsResDto,
  type FavoriteResDto,
  type PageResDto,
} from "@/shared/api";

/** 내 기여 통계를 조회한다. 서버에서는 요청 쿠키를 싣는 `serverApiFetch`를 넘긴다. */
export function fetchMyContributionStats(
  fetcher: typeof apiFetch = apiFetch,
): Promise<ContributionStatsResDto> {
  return fetcher<ContributionStatsResDto>(API_PATHS.myContributionStats);
}

/** 내가 만들거나 고친 기록을 최신 순으로 `limit`개 조회한다. */
export function fetchMyContributions(
  limit: number,
  fetcher: typeof apiFetch = apiFetch,
): Promise<ContributionResDto[]> {
  return fetcher<ContributionResDto[]>(API_PATHS.myContributions(limit));
}

/** 내 즐겨찾기를 최근 추가 순으로 한 페이지 조회한다. */
export function fetchMyFavorites(
  page: { page: number; size: number },
  fetcher: typeof apiFetch = apiFetch,
): Promise<PageResDto<FavoriteResDto>> {
  return fetcher<PageResDto<FavoriteResDto>>(API_PATHS.myFavorites(page));
}

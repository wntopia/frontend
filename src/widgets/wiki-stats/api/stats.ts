import { API_PATHS, apiFetch, type WikiStatsResDto } from "@/shared/api";

/** 위키 현황(문서 수 · 이번 주 편집 수 · 가입 사용자 수)을 조회한다. */
export function fetchWikiStats(
  fetcher: typeof apiFetch = apiFetch,
): Promise<WikiStatsResDto> {
  return fetcher<WikiStatsResDto>(API_PATHS.wikiStats);
}

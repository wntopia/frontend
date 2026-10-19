import {
  API_PATHS,
  apiFetch,
  type ArticleResDto,
  type ArticleRevisionSummaryResDto,
  type PageResDto,
  type PopularArticleResDto,
  type RecentChangeResDto,
} from "@/shared/api";

/**
 * 문서의 최신 내용을 조회한다. 없는 문서면 404 `ApiError`를 던진다.
 *
 * 조회할 때마다 백엔드가 조회수를 센다(같은 사용자의 30분 내 재조회는 제외). 사용자를 계정으로 구분하므로
 * 서버에서는 요청 쿠키를 실어 보내는 fetcher를 넘긴다 (`../server.ts` 참고).
 */
export function fetchArticle(
  articleId: number,
  fetcher: typeof apiFetch = apiFetch,
): Promise<ArticleResDto> {
  return fetcher<ArticleResDto>(API_PATHS.article(articleId));
}

/** 문서의 리비전 목록을 최신 순으로 한 페이지 조회한다. 없는 문서면 404 `ApiError`를 던진다. */
export function fetchArticleRevisions(
  articleId: number,
  page: { page: number; size: number },
  fetcher: typeof apiFetch = apiFetch,
): Promise<PageResDto<ArticleRevisionSummaryResDto>> {
  return fetcher<PageResDto<ArticleRevisionSummaryResDto>>(
    API_PATHS.articleRevisions(articleId, page),
  );
}

/** 최근 수정된 문서를 문서마다 한 줄씩, 마지막 수정 순으로 한 페이지 조회한다. */
export function fetchRecentChanges(
  page: { page: number; size: number },
  fetcher: typeof apiFetch = apiFetch,
): Promise<PageResDto<RecentChangeResDto>> {
  return fetcher<PageResDto<RecentChangeResDto>>(
    API_PATHS.recentChanges(page),
  );
}

/**
 * 누적 조회수가 많은 문서를 조회한다. 목록을 보여 주려고 문서 조회(`fetchArticle`)를 부르면 그 문서들의
 * 조회수가 올라가므로, 목록에는 이것만 쓴다 — 이 API는 조회수를 세지 않는다.
 */
export function fetchPopularArticles(
  size: number,
  fetcher: typeof apiFetch = apiFetch,
): Promise<PopularArticleResDto[]> {
  return fetcher<PopularArticleResDto[]>(API_PATHS.popularArticles(size));
}

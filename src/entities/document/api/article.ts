import {
  API_PATHS,
  apiFetch,
  type ArticleEditorsResDto,
  type ArticleResDto,
  type ArticleRevisionSummaryResDto,
  type PageResDto,
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

/** 지금 이 문서를 공동편집 중인 사람들. 문서 조회와 달리 조회수를 올리지 않아 여러 번 불러도 된다. */
export function fetchArticleEditors(
  articleId: number,
  signal?: AbortSignal,
): Promise<ArticleEditorsResDto> {
  return apiFetch<ArticleEditorsResDto>(API_PATHS.articleEditors(articleId), {
    signal,
  });
}

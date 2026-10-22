import { API_PATHS, apiFetch, type ArticleSearchResDto } from "@/shared/api";

/**
 * 문서를 검색해 한 페이지를 받는다. 로그인과 상관없는 조회라 서버에서도 쿠키 없이 부른다.
 *
 * 검색어가 비었거나 너무 길면 400 `ApiError`, 검색이 몰려 백엔드의 동시 실행 한도에 걸리면
 * 기다리지 않고 503 `ApiError`가 온다.
 */
export function searchArticles(
  query: string,
  page: { page: number; size: number },
): Promise<ArticleSearchResDto> {
  return apiFetch<ArticleSearchResDto>(API_PATHS.articleSearch(query, page));
}

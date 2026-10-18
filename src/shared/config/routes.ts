/** 검색 화면에 검색어를 실어 보내는 쿼리 이름 */
export const SEARCH_QUERY_PARAM = "q";

/** 새 문서 화면에 미리 채울 제목을 실어 보내는 쿼리 이름 */
export const NEW_DOCUMENT_TITLE_PARAM = "title";

/** 편집 역사 화면의 페이지 번호(1부터)를 실어 보내는 쿼리 이름 */
export const HISTORY_PAGE_PARAM = "page";

/**
 * 앱 전역 라우트 경로. 주소에 값이 들어가는 화면은 경로를 만들어 주는 함수로 둔다.
 *
 * 문서는 제목이 아니라 숫자 id로 가리킨다 — 백엔드가 `articleId`로만 조회하기 때문이다.
 */
export const ROUTES = {
  home: "/",
  document: (articleId: number) => `/document/${articleId}`,
  documentEdit: (articleId: number) => `/document/${articleId}/edit`,
  /** 편집 역사. 첫 페이지는 쿼리 없이 두어 한 화면에 주소가 둘 생기지 않게 한다. */
  documentHistory: (articleId: number, page = 1) =>
    page > 1
      ? `/document/${articleId}/history?${HISTORY_PAGE_PARAM}=${page}`
      : `/document/${articleId}/history`,
  /** 새 문서 작성. 제목을 주면 그 제목이 채워진 채로 열린다. */
  documentNew: (title?: string) =>
    title
      ? `/document/new?${NEW_DOCUMENT_TITLE_PARAM}=${encodeURIComponent(title)}`
      : "/document/new",
  mypage: "/mypage",
  search: (query?: string) =>
    query
      ? `/search?${SEARCH_QUERY_PARAM}=${encodeURIComponent(query)}`
      : "/search",
  /** 아직 작성되지 않은 문서로 이동했을 때 보이는 화면 (404 핸들러가 아니다) */
  missingDocument: "/missing-document",
  signin: "/signin",
  /**
   * 로그인 성공 후 백엔드가 돌려보내는 착지 지점.
   * 백엔드의 `success-redirect-uri` 설정이 이 경로를 가리켜야 한다.
   */
  signinCallback: "/signin/callback",
} as const;

import { API_PREFIX } from "./base-url";

/** 백엔드 엔드포인트 경로. `ROUTES`와 마찬가지로 문자열을 직접 쓰지 않고 여기로만 참조한다. */
export const API_PATHS = {
  /**
   * DataGSM 인가 페이지로 302를 돌려준다. `fetch`가 아니라 **페이지 이동**으로 연다.
   */
  oauthSignin: `${API_PREFIX}/oauth/datagsm/signin`,
  /**
   * DataGSM이 준 `code`·`state`를 검증하고 성공/실패 주소로 302를 돌려준다.
   * 코드에서 직접 부르지 않는다 — `OAUTH_REDIRECT_PATH`로 돌아온 브라우저를 프록시가 여기로 넘긴다.
   */
  oauthCallback: `${API_PREFIX}/oauth/datagsm/callback`,
  /** 비로그인 시 401 */
  authMe: `${API_PREFIX}/auth/me`,
  signout: `${API_PREFIX}/auth/signout`,

  article: (articleId: number) => `${API_PREFIX}/articles/${articleId}`,
  /**
   * 문서 검색. 제목과 본문에서 검색어를 띄어쓰기까지 그대로 찾는다(영문 대소문자만 무시).
   * 검색어는 양끝 공백을 뺀 1~100자, `page`는 0부터, `size`는 1~50이며 어기면 400이다.
   */
  articleSearch: (
    query: string,
    { page, size }: { page: number; size: number },
  ) =>
    `${API_PREFIX}/articles?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
  /** 제목들이 실제 문서인지 한 번에 확인한다. 읽기만 하지만 제목 목록을 본문에 실어야 해서 POST다. */
  articleTitlesLookup: `${API_PREFIX}/articles/titles/lookup`,
  /** 리비전 목록(최신 순). 페이지 단위로 온다 — `page`는 0부터, `size`는 1~100 */
  articleRevisions: (
    articleId: number,
    { page, size }: { page: number; size: number },
  ) => `${API_PREFIX}/articles/${articleId}/revisions?page=${page}&size=${size}`,
  /** 특정 리비전 시점으로 재구성한 문서 */
  articleRevision: (articleId: number, revision: number) =>
    `${API_PREFIX}/articles/${articleId}/revisions/${revision}`,
  /**
   * 내 즐겨찾기 여부. GET은 비로그인이면 401 대신 `favorited: false`를 준다.
   * PUT(추가)·DELETE(해제)는 로그인이 필요하고(401), 같은 요청을 거듭해도 성공하는 멱등 요청이다.
   * 없는 문서는 PUT만 404다.
   */
  articleFavorite: (articleId: number) =>
    `${API_PREFIX}/articles/${articleId}/favorite`,
} as const;

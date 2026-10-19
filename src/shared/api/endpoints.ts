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

  /** 최근 수정된 문서(문서당 한 줄, 최신 순). `page`는 0부터, `size`는 1~100 */
  recentChanges: ({ page, size }: { page: number; size: number }) =>
    `${API_PREFIX}/articles/recent-changes?page=${page}&size=${size}`,
  /** 누적 조회수 순 문서. `size`는 1~50. 문서 조회와 달리 조회수를 올리지 않는다 */
  popularArticles: (size: number) =>
    `${API_PREFIX}/articles/popular?size=${size}`,
  /** 위키 현황(문서 수 · 이번 주 편집 수 · 가입 사용자 수) */
  wikiStats: `${API_PREFIX}/stats`,
  /** 분류 전체와 분류별 문서 수 */
  categories: `${API_PREFIX}/categories`,

  article: (articleId: number) => `${API_PREFIX}/articles/${articleId}`,
  /** 리비전 목록(최신 순). 페이지 단위로 온다 — `page`는 0부터, `size`는 1~100 */
  articleRevisions: (
    articleId: number,
    { page, size }: { page: number; size: number },
  ) => `${API_PREFIX}/articles/${articleId}/revisions?page=${page}&size=${size}`,
  /** 특정 리비전 시점으로 재구성한 문서 */
  articleRevision: (articleId: number, revision: number) =>
    `${API_PREFIX}/articles/${articleId}/revisions/${revision}`,
} as const;

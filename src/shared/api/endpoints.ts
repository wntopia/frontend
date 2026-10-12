import { API_PREFIX } from "./base-url";

/** 백엔드 엔드포인트 경로. `ROUTES`와 마찬가지로 문자열을 직접 쓰지 않고 여기로만 참조한다. */
export const API_PATHS = {
  /**
   * DataGSM 인가 페이지로 302를 돌려준다. `fetch`가 아니라 **페이지 이동**으로 연다.
   * 이어지는 callback은 백엔드가 받아 처리한 뒤 성공/실패 주소로 다시 리다이렉트한다.
   */
  oauthSignin: `${API_PREFIX}/oauth/datagsm/signin`,
  /** 비로그인 시 401 */
  authMe: `${API_PREFIX}/auth/me`,
  signout: `${API_PREFIX}/auth/signout`,

  article: (articleId: number) => `${API_PREFIX}/articles/${articleId}`,
  /** 리비전 목록(최신 순) */
  articleRevisions: (articleId: number) =>
    `${API_PREFIX}/articles/${articleId}/revisions`,
  /** 특정 리비전 시점으로 재구성한 문서 */
  articleRevision: (articleId: number, revision: number) =>
    `${API_PREFIX}/articles/${articleId}/revisions/${revision}`,
} as const;

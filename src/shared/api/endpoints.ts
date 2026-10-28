import { API_PREFIX, WS_PREFIX } from "./base-url";

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
  /**
   * 문서 검색. 제목과 본문에서 검색어를 띄어쓰기까지 그대로 찾는다(영문 대소문자만 무시).
   * 검색어는 양끝 공백을 뺀 1~100자, `page`는 0부터, `size`는 1~50이며 어기면 400이다.
   */
  articleSearch: (
    query: string,
    { page, size }: { page: number; size: number },
  ) =>
    `${API_PREFIX}/articles?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
  /**
   * 제목들이 실제 문서인지 한 번에 확인한다. 읽기만 하지만 제목 목록을 본문에 실어야 해서 POST다.
   * 같은 일을 하는 `GET /articles/by-title`은 조회수를 올리므로, 존재 확인에는 이쪽만 쓴다.
   */
  articleTitlesLookup: `${API_PREFIX}/articles/titles/lookup`,
  /**
   * 이 제목을 `[[문서명]]`으로 링크한 문서(제목 순). 아직 없는 문서의 제목으로도 조회된다.
   * `page`는 0부터, `size`는 1~100이며 어기면 400이다.
   */
  articleBacklinks: (
    title: string,
    { page, size }: { page: number; size: number },
  ) =>
    `${API_PREFIX}/articles/backlinks?title=${encodeURIComponent(title)}&page=${page}&size=${size}`,
  /** 리비전 목록(최신 순). 페이지 단위로 온다 — `page`는 0부터, `size`는 1~100 */
  articleRevisions: (
    articleId: number,
    { page, size }: { page: number; size: number },
  ) => `${API_PREFIX}/articles/${articleId}/revisions?page=${page}&size=${size}`,
  /**
   * 문서 생성(POST, `multipart/form-data`). 기존 문서의 본문은 공동편집 WebSocket의 `save`로 저장한다.
   * 백엔드의 `PUT article(id)`는 편집 화면 밖의 비대화형 클라이언트용이라 프론트는 쓰지 않는다.
   */
  articles: `${API_PREFIX}/articles`,
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
  /**
   * 대표 이미지만 바꾼다(PATCH, `multipart/form-data`). 본문을 건드리지 않아 리비전이 생기지 않고,
   * 백엔드가 공동편집 중인 모두에게 `external-update`로 새 이미지를 알린다.
   * 비로그인이거나 `student`가 없는 계정이면 401이다.
   */
  articleImage: (articleId: number) =>
    `${API_PREFIX}/articles/${articleId}/image`,
  /**
   * 지금 공동편집 방에 들어와 있는 편집자. 로그인 없이 부를 수 있고, 방이 없거나 없는 문서여도 오류 없이 빈 결과다.
   * 구독 방법이 없어 보이는 동안 폴링한다(백엔드 권장 10~30초).
   */
  articleEditors: (articleId: number) =>
    `${API_PREFIX}/articles/${articleId}/editors`,
  /**
   * 실시간 공동편집 WebSocket. `fetch`가 아니라 `toWebSocketUrl`로 주소를 만들어 연다.
   * 세션 쿠키가 없으면 핸드셰이크가 401이다(브라우저에는 상태 코드 없이 연결 실패로만 보인다).
   */
  articleCollaboration: (articleId: number) =>
    `${WS_PREFIX}/articles/${articleId}/collaboration`,
} as const;

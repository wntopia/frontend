/** 새 문서 화면에 미리 채울 제목을 실어 보내는 쿼리 이름 */
export const NEW_DOCUMENT_TITLE_PARAM = "title";

/** 앱 전역 라우트 경로. 주소에 값이 들어가는 화면은 경로를 만들어 주는 함수로 둔다. */
export const ROUTES = {
  home: "/",
  document: "/document",
  /** 새 문서 작성. 제목을 주면 그 제목이 채워진 채로 열린다. */
  documentNew: (title?: string) =>
    title
      ? `/document/new?${NEW_DOCUMENT_TITLE_PARAM}=${encodeURIComponent(title)}`
      : "/document/new",
  mypage: "/mypage",
  search: "/search",
  /** 아직 작성되지 않은 문서로 이동했을 때 보이는 화면 (404 핸들러가 아니다) */
  missingDocument: "/missing-document",
  edit: "/edit",
  history: "/history",
  signin: "/signin",
  /**
   * 로그인 성공 후 백엔드가 돌려보내는 착지 지점.
   * 백엔드의 `success-redirect-uri` 설정이 이 경로를 가리켜야 한다.
   */
  signinCallback: "/signin/callback",
} as const;

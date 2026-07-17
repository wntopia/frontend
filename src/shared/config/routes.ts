/** 앱 전역 라우트 경로. 디자인의 `.dc.html` 링크를 실제 라우트로 매핑한다. */
export const ROUTES = {
  /**
   * 디자인 확인이 목적이라 당분간 `/home`에 둔다.
   * `/`는 화면 목록 허브(`views/screen-index`)가 쓰고 있다.
   */
  home: "/home",
  document: "/document",
  mypage: "/mypage",
  search: "/search",
  /** 아직 작성되지 않은 문서로 이동했을 때 보이는 화면 (404 핸들러가 아니다) */
  missingDocument: "/missing-document",
  edit: "/edit",
  history: "/history",
} as const;

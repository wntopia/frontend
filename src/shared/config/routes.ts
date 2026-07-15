/** 앱 전역 라우트 경로. 디자인의 `.dc.html` 링크를 실제 라우트로 매핑한다. */
export const ROUTES = {
  home: "/",
  document: "/document",
  mypage: "/mypage",

  /** 아직 포팅되지 않은 화면. 각 화면을 구현할 때 실제 경로로 교체한다. */
  search: "#",
  history: "#",
  missingDocument: "#",
} as const;

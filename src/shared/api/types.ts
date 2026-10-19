/**
 * 백엔드(`wntopia/gikipedia-server`) 응답 DTO에 1:1로 대응하는 타입.
 * 이름을 백엔드와 똑같이 두어 서로 찾아보기 쉽게 한다. 화면용으로 가공한 타입은 각 슬라이스의 model에 둔다.
 */

/** 백엔드의 `Instant` — ISO 8601 문자열로 온다. (예: `2026-09-16T01:04:05Z`) */
export type IsoDateTime = string;

/** 목록 API의 공통 페이지 응답. `page`는 0부터 센다. */
export type PageResDto<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
};

export type CategoryResDto = {
  id: number;
  name: string;
};

/** 분류 목록의 한 항목. 이름 순으로 오고, 문서가 없는 분류도 들어 있다. */
export type CategoryListItemResDto = {
  id: number;
  name: string;
  articleCount: number;
};

export type ArticleResDto = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
  category: CategoryResDto | null;
  /** 누적 조회수. 문서 조회(GET) 응답에서만 실시간 값이고, 생성·수정 응답에서는 저장된 값이거나 0이다. */
  viewCount: number;
};

/** 최근 변경 목록의 한 항목. 같은 문서를 여러 번 고쳐도 한 줄이고, 마지막 수정 순으로 온다. */
export type RecentChangeResDto = {
  articleId: number;
  title: string;
  /** 마지막으로 기여한 사람의 이름(학번 없이). 비로그인으로 만든 문서처럼 알 수 없으면 `null`이다. */
  lastEditorName: string | null;
  updatedAt: IsoDateTime;
  /** 만든 뒤로 한 번도 수정되지 않은 문서 */
  newlyCreated: boolean;
  /** 오늘(한국 시간 0시부터) 수정한 횟수. 문서 생성은 세지 않는다. */
  todayEditCount: number;
  /** 오늘 수정한 서로 다른 사람 수. 마지막 기여자도 이 안에 든다. */
  todayEditorCount: number;
};

/** 인기 문서 목록의 한 항목. 누적 조회수(전체 기간) 순으로 온다. */
export type PopularArticleResDto = {
  id: number;
  title: string;
  /** 누적 조회수. 백엔드가 약 30초마다 모아서 반영한다. */
  viewCount: number;
};

/** 위키 현황. 백엔드가 집계 결과를 60초 동안 재사용해 그만큼 늦게 바뀔 수 있다. */
export type WikiStatsResDto = {
  totalArticles: number;
  /** 이번 주(한국 시간 월요일 0시부터)의 편집 수. 문서 생성도 센다. */
  weeklyEdits: number;
  /** 한 번이라도 로그인한 사용자 수 */
  registeredUsers: number;
};

/** 편집 역사 목록의 한 항목. 본문 없이 메타데이터만 담는다. */
export type ArticleRevisionSummaryResDto = {
  revision: number;
  /** 수정자 식별 문자열 — "학번 이름" (예: "2412 홍길동") */
  editor: string;
  editedAt: IsoDateTime | null;
  summary: string | null;
  minorEdit: boolean;
  /** 직전 리비전 대비 글자 수 변화. 이 필드가 생기기 전의 리비전은 `null`이다. */
  charDelta: number | null;
};

/** 특정 리비전 시점으로 재구성한 문서 */
export type ArticleRevisionResDto = {
  articleId: number;
  revision: number;
  /** 제목은 리비전별로 추적하지 않아 항상 문서의 현재 제목이 온다. */
  title: string;
  content: string;
  editor: string;
  editedAt: IsoDateTime | null;
  /** 이 리비전이 문서의 현재 최신인지 */
  latest: boolean;
  summary: string | null;
  minorEdit: boolean;
  charDelta: number | null;
};

export type AuthStatusResDto = {
  authenticated: boolean;
  user: DataGsmUserInfoResDto | null;
};

/**
 * DataGSM이 내려준 계정 정보. 백엔드가 그대로 전달하는 값이라 모든 필드가 비어 있을 수 있다.
 * `student`는 학생 계정에만 있고, 없으면 백엔드의 문서 수정 API가 401을 돌려준다.
 */
export type DataGsmUserInfoResDto = {
  id: number | null;
  email: string | null;
  role: string | null;
  isStudent: boolean | null;
  student: DataGsmStudentInfoResDto | null;
};

export type DataGsmStudentInfoResDto = {
  id: number | null;
  name: string | null;
  sex: string | null;
  email: string | null;
  grade: number | null;
  classNum: number | null;
  number: number | null;
  /** 학번 (예: 2412) */
  studentNumber: number | null;
  major: string | null;
  specialty: string | null;
  role: string | null;
  dormitoryFloor: number | null;
  dormitoryRoom: number | null;
  isLeaveSchool: boolean | null;
  majorClub: DataGsmClubSummaryResDto | null;
  autonomousClub: DataGsmClubSummaryResDto | null;
  githubId: string | null;
  githubUrl: string | null;
};

export type DataGsmClubSummaryResDto = {
  id: number | null;
  name: string | null;
  type: string | null;
  status: string | null;
  foundedYear: number | null;
  abolishedYear: number | null;
};

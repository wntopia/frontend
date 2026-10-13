/**
 * 백엔드(`wntopia/gikipedia-server`) 응답 DTO에 1:1로 대응하는 타입.
 * 이름을 백엔드와 똑같이 두어 서로 찾아보기 쉽게 한다. 화면용으로 가공한 타입은 각 슬라이스의 model에 둔다.
 */

/** 백엔드의 `Instant` — ISO 8601 문자열로 온다. (예: `2026-09-16T01:04:05Z`) */
export type IsoDateTime = string;

export type ArticleResDto = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
};

/** 편집 역사 목록의 한 항목. 본문 없이 메타데이터만 담는다. */
export type ArticleRevisionSummaryResDto = {
  revision: number;
  /** 수정자 식별 문자열 — "학번 이름" (예: "2412 홍길동") */
  editor: string;
  editedAt: IsoDateTime | null;
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

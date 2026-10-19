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

/**
 * 문서 생성 요청(`POST /articles`). `multipart/form-data`로 보내며 키가 곧 폼 필드 이름이다.
 * 백엔드는 제목의 앞뒤 공백을 지우고 연속 공백을 한 칸으로 줄여 저장하고, 대소문자·전각/반각만 다른
 * 제목도 같은 문서로 보아 409를 준다.
 */
export type CreateArticleReqDto = {
  /** 공백만으로는 안 되고 255자까지. 만든 뒤에는 바꿀 수 없다. */
  title: string;
  /** 공백만으로는 안 된다. */
  content: string;
  /** 대표 이미지. 10MB까지 */
  image?: File;
  /** 분류. 분류를 고르는 화면이 아직 없어 보내지 않는다. */
  categoryId?: number;
};

/**
 * 문서 수정 요청(`PUT /articles/{id}`). 제목은 받지 않는다.
 * 본문이 그대로면 새 리비전을 만들지 않으며, 이때 편집 요약·가벼운 수정도 남지 않는다.
 */
export type UpdateArticleReqDto = {
  /** 본문 전체를 이 값으로 바꾼다. 공백만으로는 안 된다. */
  content: string;
  /** 보내면 대표 이미지를 바꾸고, 빼면 지금 이미지를 둔다. 이미지를 지우는 방법은 없다. 10MB까지 */
  image?: File;
  /** 편집 요약. 500자까지 */
  summary?: string;
  minorEdit?: boolean;
  /** 바꿀 분류. 빼면 지금 분류를 둔다. */
  categoryId?: number;
};

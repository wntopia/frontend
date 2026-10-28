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

/**
 * 문서 검색 결과 한 페이지. 다른 목록(`PageResDto`)과 달리 `hasNext` 대신 `totalPages`가 온다.
 * 결과가 없으면 `items`는 비고 `totalElements`·`totalPages`는 0이다.
 */
export type ArticleSearchResDto = {
  items: ArticleSearchItemResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ArticleSearchItemResDto = {
  id: number;
  title: string;
  /**
   * 본문에서 처음 일치한 곳 앞뒤를 160자쯤 잘라 검색어 위치로 나눈 조각. 잘린 쪽 끝에는 `…`가 붙는다.
   * 본문은 위키 문법 중 `== 제목 ==`과 `[[문서명]]`만 지우고 줄을 공백으로 이은 글자다. 본문이 비면 빈 배열이다.
   */
  snippet: SnippetSegmentResDto[];
  updatedAt: IsoDateTime;
};

/** HTML로 해석하지 않는 표시용 글자. `highlight`는 검색어와 일치하는 구간이다. */
export type SnippetSegmentResDto = {
  text: string;
  highlight: boolean;
};

export type LookupArticleTitlesReqDto = {
  /** 최대 200개. 공백·유니코드 정규화와 대소문자 무시는 백엔드가 문서를 만들 때와 같은 규칙으로 한다. */
  titles: string[];
};

export type LookupArticleTitlesResDto = {
  /** 요청한 제목 순서 그대로 */
  items: {
    /** 요청에 담았던 제목 (원문 그대로) */
    title: string;
    exists: boolean;
    /** 없는 제목이면 `null` */
    id: number | null;
  }[];
};

/**
 * 링크를 건 문서 하나. 본문의 어디에 링크가 걸렸는지는 오지 않는다.
 * 백엔드는 `[[문서명]]`만 링크로 센다 — `[[문서명|보일 글자]]`처럼 `|`가 들어간 링크는 역링크에 잡히지 않는다.
 */
export type BacklinkResDto = {
  id: number;
  title: string;
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

/**
 * 지금 문서의 공동편집 방에 들어와 있는 사람들. 방이 없거나 비었으면 `editing: false`의 빈 값이다.
 * 같은 계정의 여러 탭은 한 명으로 센다.
 */
export type ArticleEditorsResDto = {
  editing: boolean;
  editorCount: number;
  /** 학번을 뺀 이름. "○○ 외 N명"은 첫 이름과 `editorCount - 1`로 만든다 */
  editorNames: string[];
};

export type FavoriteStatusResDto = {
  /** 내 즐겨찾기에 들어 있는지. 비로그인이면 항상 `false`다. */
  favorited: boolean;
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
 * 대표 이미지 교체 요청(`PATCH /articles/{id}/image`). `multipart/form-data`로 보낸다.
 * 본문은 받지 않는다 — 본문 저장은 공동편집 WebSocket의 `save` 메시지로 한다.
 */
export type UpdateArticleImageReqDto = {
  /** 비어 있으면 400. 10MB까지 */
  image: File;
};

/**
 * 실시간 공동편집 WebSocket(`/ws/articles/{id}/collaboration`)에서 오가는 유일한 메시지 모양.
 * 백엔드 `CollaborationMessage`와 같은 플랫 구조이고, 모두 JSON 텍스트 프레임이다.
 *
 * 백엔드는 Yjs 바이트(`dataB64`)를 해석하지 않고 릴레이와 저장만 한다. 병합은 프론트의 Yjs가 맡는다.
 * 백엔드는 이 DTO로 다시 직렬화해 릴레이하므로 여기 없는 필드는 상대에게 닿지 않는다.
 */
export type CollaborationMessage = {
  type: CollaborationMessageType;
  /** Yjs 바이트의 base64 — update · awareness · sync(보낼 때) · bootstrap(진행 중 상태가 있을 때) */
  dataB64?: string | null;
  /** save · sync의 본문 글자, bootstrap(진행 중 상태가 없을 때) · external-update의 지금 본문 */
  content?: string | null;
  /** bootstrap(진행 중 상태가 없을 때) · external-update의 대표 이미지 주소 */
  imageUrl?: string | null;
  /** saved — 새 리비전 번호. 본문이 그대로라 리비전을 만들지 않았으면 `null` */
  revision?: number | null;
  /** save의 편집 요약. 500자를 넘으면 서버가 자른다 */
  summary?: string | null;
  /** save의 가벼운 수정 여부. 빼면 `false` */
  minorEdit?: boolean | null;
  /** save의 저장 사유(`manual` 등). 관측용이라 동작에 영향이 없다 */
  reason?: string | null;
  /** error의 사유 */
  message?: string | null;
};

/**
 * - 서버 → 클라: `bootstrap`(접속 직후 1회) · `saved`(방 전체) · `external-update` · `error`
 * - 클라 → 서버: `sync`(릴레이하지 않음) · `save`
 * - 양방향: `update` · `awareness` — 서버가 보낸 사람을 뺀 방 전체에 릴레이한다
 */
export type CollaborationMessageType =
  | "bootstrap"
  | "update"
  | "awareness"
  | "sync"
  | "save"
  | "saved"
  | "external-update"
  | "error";

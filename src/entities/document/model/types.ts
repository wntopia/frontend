/** 문서의 최근 편집 활동 상태. 목록에서 점 색상으로 표현된다. */
export type DocumentActivity = "active" | "created" | "idle";

/**
 * 변경 요약을 이루는 한 조각.
 * 디자인이 요약문 안에서 편집자 이름(strong)과 편집 횟수(count)만 강조하므로,
 * 문장을 조각 배열로 표현해 강조 위치를 데이터가 정하도록 한다.
 */
export type ChangeSummarySegment = {
  text: string;
  emphasis?: "strong" | "count";
};

/** 최근 변경 목록의 한 항목 */
export type RecentChange = {
  id: string;
  title: string;
  href: string;
  activity: DocumentActivity;
  summary: ChangeSummarySegment[];
  time: string;
};

/** 인기 문서 목록의 한 항목 */
export type PopularDocument = {
  id: string;
  title: string;
  href: string;
  views: number;
};

/** 이 문서를 링크하고 있는 다른 문서 */
export type Backlink = {
  id: string;
  title: string;
  href: string;
  /** 링크가 걸린 위치 (예: "개요 문단", "인기 문서") */
  section: string;
};

/** 검색 결과 본문 발췌의 한 조각. highlight는 검색어와 일치해 강조되는 부분이다. */
export type SnippetSegment = {
  text: string;
  highlight?: boolean;
};

/** 검색 결과 목록의 한 항목 */
export type SearchResult = {
  id: string;
  title: string;
  href: string;
  snippet: SnippetSegment[];
  /** 아직 작성되지 않은 문서. 붉은 제목과 '미작성' 뱃지로 표시된다. */
  missing?: boolean;
  /** 미작성 문서에는 수정 이력이 없다 */
  lastModified?: string;
};

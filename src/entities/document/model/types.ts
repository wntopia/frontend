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

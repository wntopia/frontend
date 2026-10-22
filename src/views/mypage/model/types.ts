import type { DocumentActivity } from "@/entities/document";

/** 마이페이지 상단의 편집 통계 */
export type MyStats = {
  totalEdits: number;
  createdDocuments: number;
  todayEdits: number;
};

/** 최근 기여 목록의 한 줄 */
export type Contribution = {
  href: string;
  text: string;
  time: string;
  /** 점 색을 홈의 최근 변경과 같은 기준으로 맞춘다. */
  activity: DocumentActivity;
};

export type FavoriteDocument = {
  href: string;
  title: string;
};

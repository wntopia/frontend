import type { DocumentActivity } from "@/entities/document";

/** 마이페이지 상단의 편집 통계 */
export type MyStats = {
  /** 기존 문서를 고친 횟수. 문서 생성은 들어가지 않는다 */
  totalEdits: number;
  createdDocuments: number;
  todayEdits: number;
  /** 가입일 (`2026.03.02`) */
  joinedOn: string;
};

/** 최근 기여 목록의 한 줄 */
export type Contribution = {
  articleId: number;
  title: string;
  /** 제목 뒤에 붙는 한 일 */
  action: "문서 생성" | "수정";
  time: string;
  /** 점 색을 홈의 최근 변경과 같은 기준으로 맞춘다. */
  activity: DocumentActivity;
};

export type FavoriteDocument = {
  articleId: number;
  title: string;
};

/** 즐겨찾기 첫 페이지와, 거기 담지 못한 나머지 개수 */
export type FavoriteList = {
  items: FavoriteDocument[];
  restCount: number;
};

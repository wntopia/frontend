/** 리비전 통계 카드 한 장 */
export type RevisionStat = {
  label: string;
  value: string;
  /** 값 색상 — accent(파랑)·success(초록), 없으면 기본 전경색 */
  tone?: "accent" | "success";
};

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터 */
export const REVISION_STATS: RevisionStat[] = [
  { label: "전체 리비전", value: "231", tone: "accent" },
  { label: "기여자", value: "48", tone: "success" },
  { label: "최초 생성", value: "2026.06.20" },
];

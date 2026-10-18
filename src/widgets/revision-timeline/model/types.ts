import type { ChangeSummarySegment } from "@/entities/document";

/** 리비전 종류. 타임라인 마커 색상으로 표현된다 — active(오늘 편집) */
export type RevisionKind = "active" | "default";

/** 리비전 diff의 한 줄. change가 없으면 변경되지 않은 문맥 줄이다. */
export type RevisionDiffLine = {
  text: string;
  change?: "added" | "removed";
};

/** 편집 역사 타임라인의 한 항목 */
export type Revision = {
  id: string;
  kind: RevisionKind;
  summary: ChangeSummarySegment[];
  /** 수정 시각 (예: "3시간 전", "어제 21:14") */
  time: string;
  /** 가벼운 수정(오타 등)으로 표시된 편집인지 */
  minor?: boolean;
  /** 글자 수 변화 (예: "+412자") */
  delta?: { text: string; tone: "added" | "removed" | "neutral" };
  /**
   * '차이 보기'로 펼쳐 보는 변경 내용. 리비전 목록 응답에는 본문이 없어 아직 채우지 않는다 —
   * 백엔드가 diff를 주지 않으므로 리비전 본문 두 개를 받아 계산해야 한다.
   */
  diff?: RevisionDiffLine[];
};

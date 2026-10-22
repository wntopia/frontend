import type { ChangeSummarySegment, CharDeltaTone } from "@/entities/document";

/** 리비전 종류. 타임라인 마커 색상으로 표현된다 — active(오늘 편집) */
export type RevisionKind = "active" | "default";

/** 리비전 diff의 한 줄. change가 없으면 변경되지 않은 문맥 줄이다. */
export type RevisionDiffLine = {
  text: string;
  change?: "added" | "removed";
};

/**
 * '차이 보기'에 그리는 한 행. 바뀌지 않은 긴 구간은 접어서 줄 수만 남긴다(`fold`).
 * 어느 줄을 어떤 색으로 그릴지는 이 데이터가 정한다 — 컴포넌트가 본문 글자를 보고 판단하지 않는다.
 */
export type RevisionDiffRow =
  | ({ type: "line" } & RevisionDiffLine)
  | { type: "fold"; count: number };

/** '차이 보기'가 비교할 두 리비전 — 직전 리비전(from)에서 이 리비전(to)으로 */
export type RevisionCompare = {
  articleId: number;
  from: number;
  to: number;
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
  delta?: { text: string; tone: CharDeltaTone };
  /** '이 버전 보기'로 여는 과거 리비전 화면. 백엔드에 기록이 없는 항목(수정된 적 없는 문서의 생성)에는 없다. */
  href?: string;
  /**
   * '차이 보기'로 비교할 리비전. 목록 응답에는 본문이 없고 차이를 주는 API도 없어, 펼칠 때 두 리비전의 본문을
   * 받아 브라우저에서 비교한다. 직전 리비전이 없는 생성 항목에는 없다.
   */
  compare?: RevisionCompare;
};

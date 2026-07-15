import type { ChangeSummarySegment } from "@/entities/document";

/** 리비전 종류. 타임라인 마커 색상으로 표현된다 — active(오늘 편집), bot(자동 편집) */
export type RevisionKind = "active" | "bot" | "default";

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
  /** 수정 시각 (예: "어제 21:14") 또는 오늘 수정 묶음의 시각 나열 */
  time: string;
  /** 글자 수 변화 (예: "+412자") */
  delta?: { text: string; tone: "added" | "neutral" };
  /** '차이 보기'로 펼쳐 보는 변경 내용 */
  diff?: RevisionDiffLine[];
};

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터 */
export const REVISIONS: Revision[] = [
  {
    id: "today-batch",
    kind: "active",
    summary: [
      { text: "이서연", emphasis: "strong" },
      { text: " 외 3명이 오늘 " },
      { text: "5회", emphasis: "count" },
      { text: " 수정" },
    ],
    time: "14:32 · 14:10 · 13:52 · 11:20 · 09:03",
    diff: [
      { text: "2026.03 제45회 입학식, 신입생 320명 입학" },
      { text: "+ 2026.07 급식 위생 점검 결과 추가", change: "added" },
      { text: "- 2026.06 임시 급식실 운영 (초안)", change: "removed" },
    ],
  },
  {
    id: "history-section",
    kind: "default",
    summary: [
      { text: "박민준", emphasis: "strong" },
      { text: "이 '연혁' 문단 추가" },
    ],
    time: "어제 21:14",
    delta: { text: "+412자", tone: "added" },
  },
  {
    id: "typo-fix",
    kind: "default",
    summary: [
      { text: "정하윤", emphasis: "strong" },
      { text: "이 오타 " },
      { text: "2회", emphasis: "strong" },
      { text: " 수정" },
    ],
    time: "3일 전",
    delta: { text: "±6자", tone: "neutral" },
  },
  {
    id: "category-cleanup",
    kind: "bot",
    summary: [
      { text: "관리자봇", emphasis: "strong" },
      { text: "이 분류 정리" },
    ],
    time: "지난주",
  },
  {
    id: "document-created",
    kind: "default",
    summary: [
      { text: "이서연", emphasis: "strong" },
      { text: "이 문서 생성" },
    ],
    time: "2026.06.20",
  },
];

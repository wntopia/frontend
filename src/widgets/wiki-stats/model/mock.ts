/** 사이드바 '위키 현황'의 한 줄 */
export type WikiStat = {
  label: string;
  value: string;
  /** 활동성을 강조하는 값 (초록색 표시) */
  highlight?: boolean;
};

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터 */
export const WIKI_STATS: WikiStat[] = [
  { label: "전체 문서", value: "2,481" },
  { label: "이번 주 편집", value: "312", highlight: true },
  { label: "가입 사용자", value: "1,190" },
];

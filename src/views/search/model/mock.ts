import type { SearchResult } from "@/entities/document";
import { ROUTES } from "@/shared/config";

/**
 * 백엔드 연동 전까지 사용하는 디자인 시안 데이터.
 * 실제 검색을 붙이기 전이라 결과는 주소의 검색어와 상관없이 시안 그대로다.
 * `SEARCH_QUERY`는 주소에 검색어가 없을 때 대신 보여 주는 시안의 검색어다.
 */
export const SEARCH_QUERY = "급식";

export const SEARCH_RESULTS: SearchResult[] = [
  {
    id: "lunch-menu",
    title: "급식 메뉴",
    href: ROUTES.missingDocument,
    missing: true,
    snippet: [
      { text: "아직 작성되지 않은 문서입니다. 클릭해서 새로 만들어보세요." },
    ],
  },
  {
    id: "lunch-committee",
    title: "급식소위원회",
    href: "#",
    snippet: [
      { text: "학생·학부모·영양교사로 구성되어 매 학기 " },
      { text: "급식", highlight: true },
      { text: " 만족도 조사를 진행하는 협의체이다." },
    ],
    lastModified: "2026-06-02",
  },
  {
    id: "nutrition-teacher",
    title: "영양교사",
    href: "#",
    snippet: [
      { text: "급식", highlight: true },
      { text: " 식단 편성과 위생 관리를 담당하는 교사이다." },
    ],
    lastModified: "2026-05-18",
  },
];

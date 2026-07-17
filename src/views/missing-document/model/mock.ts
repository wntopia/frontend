import type { Backlink } from "@/entities/document";
import { ROUTES } from "@/shared/config";

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터 */
export const MISSING_DOCUMENT_TITLE = "급식 메뉴";

export const BACKLINKS: Backlink[] = [
  {
    id: "geumseong-high",
    title: "금성고등학교",
    href: ROUTES.document,
    section: "개요 문단",
  },
  {
    id: "home",
    title: "홈",
    href: ROUTES.home,
    section: "인기 문서",
  },
];

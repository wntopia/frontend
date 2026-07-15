import type { PopularDocument } from "@/entities/document";
import { ROUTES } from "@/shared/config";

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터. 조회수 내림차순이 곧 순위다. */
export const POPULAR_DOCUMENTS: PopularDocument[] = [
  {
    id: "geumseong-high",
    title: "금성고등학교",
    href: ROUTES.document,
    views: 12904,
  },
  { id: "sports-day-2026", title: "2026 체육대회", href: "#", views: 8215 },
  { id: "lunch-menu", title: "급식 메뉴", href: "#", views: 6732 },
  { id: "broadcasting-club", title: "방송부", href: "#", views: 4108 },
];

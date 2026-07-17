import { ROUTES } from "@/shared/config";

/** 히어로 하단의 바로가기 태그 */
export type QuickLink = {
  label: string;
  href: string;
  /** missing: 아직 작성되지 않아 붉은 톤으로 표시되는 문서 */
  tone?: "default" | "missing";
};

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터 */
export const QUICK_LINKS: QuickLink[] = [
  { label: "금성고등학교", href: ROUTES.document },
  { label: "2026 체육대회", href: "#" },
  { label: "방송부", href: "#" },
  {
    label: "급식 메뉴 (작성 필요)",
    href: ROUTES.missingDocument,
    tone: "missing",
  },
];

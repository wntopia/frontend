import Link from "next/link";
import { ROUTES } from "@/shared/config";
import { SidebarCard } from "@/shared/ui";
import { CATEGORIES } from "../model/mock";

/** 홈 사이드바의 '분류' 카드 */
export function CategoryList() {
  return (
    <SidebarCard title="분류">
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={ROUTES.search}
          className="block py-[5px] text-[13.5px] text-[#a8adb5] transition-colors hover:text-fg"
        >
          {category}
        </Link>
      ))}
    </SidebarCard>
  );
}

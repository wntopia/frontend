import Link from "next/link";
import { ROUTES } from "@/shared/config";
import { QUICK_LINKS, type QuickLink } from "../model/quick-links";

const TAG_TONE: Record<NonNullable<QuickLink["tone"]>, string> = {
  default: "border-line bg-surface-2 text-[#a8adb5] hover:text-[#a8adb5]",
  missing:
    "border-[#ff6b6b]/25 bg-[#ff6b6b]/[.08] text-[#ff9b9b] hover:text-[#ff9b9b]",
};

/** 홈 상단 히어로 — 제목, 검색 진입점, 바로가기 태그 */
export function HomeHero() {
  return (
    <section className="mx-auto max-w-[1120px] px-8 pb-10 pt-16">
      <div className="mb-[14px] font-mono text-xs uppercase tracking-[.12em] text-fg-subtle">
        교내 전용 위키
      </div>
      <h1 className="mb-[22px] max-w-[640px] text-[34px] font-extrabold leading-[1.25] tracking-[-.02em]">
        금성고 학생·교사가 함께 쓰는 기록
      </h1>

      <Link
        href={ROUTES.search}
        className="flex max-w-[620px] items-center gap-3 rounded-xl border border-line bg-surface px-[18px] py-[15px] text-[15px] text-fg-subtle hover:text-fg-subtle"
      >
        <span className="inline-block h-4 w-4 flex-shrink-0 rounded-full border-[1.8px] border-fg-subtle" />
        문서, 동아리, 인물, 행사를 검색해보세요
      </Link>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`rounded-[20px] border px-3 py-1.5 text-[12.5px] ${TAG_TONE[link.tone ?? "default"]}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

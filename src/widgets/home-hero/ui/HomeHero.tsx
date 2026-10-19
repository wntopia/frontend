import Link from "next/link";
import { ROUTES } from "@/shared/config";

/** 홈 상단 히어로 — 제목과 검색 진입점 */
export function HomeHero() {
  return (
    <section className="mx-auto max-w-[1120px] px-8 pb-10 pt-16">
      <div className="mb-[14px] font-mono text-xs uppercase tracking-[.12em] text-fg-subtle">
        교내 전용 위키
      </div>
      <h1 className="mb-[22px] max-w-[640px] text-[34px] font-extrabold leading-[1.25] tracking-[-.02em]">
        학생·교사가 함께 쓰는 기록
      </h1>

      <Link
        href={ROUTES.search()}
        className="flex max-w-[620px] items-center gap-3 rounded-xl bg-surface px-[18px] py-[15px] text-[15px] text-fg-subtle elevate-1 transition hover:elevate-2 hover:text-fg-subtle"
      >
        <span className="inline-block h-4 w-4 flex-shrink-0 rounded-full border-[1.8px] border-fg-subtle" />
        문서, 동아리, 인물, 행사를 검색해보세요
      </Link>
    </section>
  );
}

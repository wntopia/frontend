import { SearchForm } from "@/features/search";

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

      <SearchForm
        variant="hero"
        placeholder="문서, 동아리, 인물, 행사를 검색해보세요"
      />
    </section>
  );
}

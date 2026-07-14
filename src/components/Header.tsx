import Link from "next/link";

/** 모든 페이지 공통 상단 네비게이션 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#23262c] bg-bg/85 backdrop-blur-[10px]">
      <div className="mx-auto flex h-[58px] max-w-[1000px] items-center gap-[18px] px-8">
        <Link
          href="/"
          className="flex items-center gap-[9px] text-base font-extrabold"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-accent font-mono text-sm font-bold text-[#06101f]">
            W
          </span>
          금성위키
        </Link>
      </div>
    </header>
  );
}

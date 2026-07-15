import Link from "next/link";
import { ROUTES } from "@/shared/config";

type HeaderProps = {
  /**
   * minimal: 로고만 노출하는 기본 형태 (컨테이너 1000px)
   * full: 검색창과 프로필 아바타까지 노출하는 홈 화면 형태 (컨테이너 1120px)
   */
  variant?: "minimal" | "full";
};

/** 모든 페이지 공통 상단 네비게이션 */
export function Header({ variant = "minimal" }: HeaderProps) {
  const isFull = variant === "full";

  return (
    <header className="sticky top-0 z-50 border-b border-[#23262c] bg-bg/85 backdrop-blur-[10px]">
      <div
        className={`mx-auto flex h-[58px] items-center gap-[18px] px-8 ${
          isFull ? "max-w-[1120px]" : "max-w-[1000px]"
        }`}
      >
        <Link
          href={ROUTES.home}
          className="flex items-center gap-[9px] text-base font-extrabold"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-accent font-mono text-sm font-bold text-[#06101f]">
            W
          </span>
          금성위키
        </Link>

        {isFull && (
          <>
            <div className="flex-1" />
            <Link
              href={ROUTES.search}
              className="flex w-60 items-center gap-2 rounded-[9px] border border-line bg-surface-2 px-3 py-2 text-[13px] text-fg-subtle"
            >
              <span className="inline-block h-[13px] w-[13px] flex-shrink-0 rounded-full border-[1.5px] border-fg-subtle" />
              문서 검색
              <span className="ml-auto rounded bg-elevated px-[5px] py-px font-mono text-[11px]">
                /
              </span>
            </Link>
            <Link
              href={ROUTES.mypage}
              className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-line-strong bg-elevated text-[12.5px] font-bold text-fg-muted"
            >
              이
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

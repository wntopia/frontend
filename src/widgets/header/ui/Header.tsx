import Link from "next/link";
import { ROUTES } from "@/shared/config";

/** 화면마다 본문 컨테이너 폭이 달라 헤더도 같은 폭을 따라간다. */
const CONTAINER_WIDTH = {
  minimal: "max-w-[1000px]",
  home: "max-w-[1120px]",
  search: "max-w-[900px]",
} as const;

type HeaderProps =
  | {
      /**
       * minimal: 로고만 노출하는 기본 형태
       * home: 검색 진입점과 프로필 아바타를 함께 노출
       */
      variant?: "minimal" | "home";
    }
  | {
      /** search: 검색어가 채워진 입력창과 프로필 아바타를 노출 */
      variant: "search";
      query: string;
    };

/** 모든 페이지 공통 상단 네비게이션 */
export function Header(props: HeaderProps) {
  const variant = props.variant ?? "minimal";

  return (
    <header className="sticky top-0 z-50 border-b border-[#23262c] bg-bg/85 backdrop-blur-[10px]">
      <div
        className={`mx-auto flex h-[58px] items-center gap-[18px] px-8 ${CONTAINER_WIDTH[variant]}`}
      >
        <Link
          href={ROUTES.home}
          className="flex flex-shrink-0 items-center gap-[9px] text-base font-extrabold"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-accent font-mono text-sm font-bold text-[#06101f]">
            W
          </span>
          금성위키
        </Link>

        {variant === "home" && (
          <>
            <div className="flex-1" />
            <Link
              href={ROUTES.search}
              className="flex w-60 items-center gap-2 rounded-[9px] border border-line bg-surface-2 px-3 py-2 text-[13px] text-fg-subtle hover:text-fg-subtle"
            >
              <SearchIcon />
              문서 검색
              <span className="ml-auto rounded bg-elevated px-[5px] py-px font-mono text-[11px]">
                /
              </span>
            </Link>
            <ProfileAvatar />
          </>
        )}

        {props.variant === "search" && (
          <>
            {/* 디자인상 검색어를 보여주기만 하는 상자다. 입력 기능은 아직 없다. */}
            <div className="flex flex-1 items-center gap-2 rounded-[9px] border border-line-strong bg-surface-2 px-3 py-2 text-[13.5px] text-fg">
              <SearchIcon />
              {props.query}
            </div>
            <ProfileAvatar />
          </>
        )}
      </div>
    </header>
  );
}

/** 디자인의 돋보기 자리를 채우는 원형 아이콘 */
function SearchIcon() {
  return (
    <span className="inline-block h-[13px] w-[13px] flex-shrink-0 rounded-full border-[1.5px] border-fg-subtle" />
  );
}

function ProfileAvatar() {
  return (
    <Link
      href={ROUTES.mypage}
      className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-line-strong bg-elevated text-[12.5px] font-bold text-fg-muted hover:text-fg-muted"
    >
      이
    </Link>
  );
}

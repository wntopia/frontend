import Link from "next/link";
import type { ReactNode } from "react";
import { ROUTES } from "@/shared/config";

type SearchPagerProps = {
  query: string;
  /** 지금 보고 있는 페이지 (1부터) */
  page: number;
  pageCount: number;
};

const BUTTON =
  "rounded-[9px] bg-surface-2 px-[15px] py-2 text-[13px] font-semibold elevate-control";

/** 결과 목록 아래의 페이지 이동. 시안에 페이지 이동이 없어 기존 보조 버튼 모양을 따랐다. */
export function SearchPager({ query, page, pageCount }: SearchPagerProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="검색 결과 페이지"
      className="mt-8 flex items-center justify-center gap-4"
    >
      <PagerLink href={page > 1 ? ROUTES.search(query, page - 1) : null}>
        ← 이전
      </PagerLink>
      <span className="font-mono text-xs text-fg-subtle">
        {page} / {pageCount}
      </span>
      <PagerLink
        href={page < pageCount ? ROUTES.search(query, page + 1) : null}
      >
        다음 →
      </PagerLink>
    </nav>
  );
}

/** 끝 페이지에서는 자리를 지키되 누를 수 없게 둔다 — 버튼이 사라지면 가운데 쪽수가 옆으로 밀린다. */
function PagerLink({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) {
  if (href === null) {
    return (
      <span aria-disabled="true" className={`${BUTTON} text-faint`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${BUTTON} text-fg transition hover:elevate-1 hover:text-fg`}
    >
      {children}
    </Link>
  );
}

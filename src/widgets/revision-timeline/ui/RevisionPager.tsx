import Link from "next/link";
import type { ReactNode } from "react";
import { ROUTES } from "@/shared/config";

type RevisionPagerProps = {
  articleId: number;
  /** 지금 보고 있는 페이지 (1부터) */
  page: number;
  pageCount: number;
};

const BUTTON =
  "rounded-[9px] bg-surface-2 px-[15px] py-2 text-[13px] font-semibold elevate-control";

/**
 * 타임라인 아래의 페이지 이동. 목록이 최신 순이라 '이전 편집'이 다음 페이지다.
 * 시안에는 페이지 이동이 없어 기존 보조 버튼 모양을 따랐다.
 */
export function RevisionPager({
  articleId,
  page,
  pageCount,
}: RevisionPagerProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="편집 역사 페이지"
      className="mt-9 flex items-center justify-center gap-4"
    >
      <PagerLink
        href={page > 1 ? ROUTES.documentHistory(articleId, page - 1) : null}
      >
        ← 최근 편집
      </PagerLink>
      <span className="font-mono text-xs text-fg-subtle">
        {page} / {pageCount}
      </span>
      <PagerLink
        href={
          page < pageCount ? ROUTES.documentHistory(articleId, page + 1) : null
        }
      >
        이전 편집 →
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

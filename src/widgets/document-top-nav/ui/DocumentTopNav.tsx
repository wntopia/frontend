"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccountButton } from "@/features/auth";
import { ROUTES } from "@/shared/config";
import { Logo } from "@/shared/ui";

/**
 * 문서 상세 페이지 전용 상단 네비게이션.
 * 검색·편집 진입점과 케밥 메뉴(드롭다운)를 포함하므로 클라이언트 컴포넌트로 둔다.
 */
export function DocumentTopNav({
  articleId,
  title,
  categoryName,
  editingName,
}: {
  /** 보고 있는 문서. 편집·편집 역사 링크가 같은 문서로 이어지게 한다. */
  articleId: number;
  /** 위치 경로의 끝에 보이는 문서 제목 */
  title: string;
  /** 위치 경로의 앞에 보이는 분류. 분류가 없는 문서는 제목만 보인다. */
  categoryName?: string;
  /** 지금 이 문서를 편집 중인 사람. 주지 않으면 '편집 중' 표시를 그리지 않는다. */
  editingName?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-bg/85 elevate-header backdrop-blur-[10px]">
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center gap-[18px] px-8">
        {/* 로고 */}
        <Link
          href={ROUTES.home}
          className="flex flex-shrink-0 items-center gap-[9px] text-base font-extrabold tracking-[-0.01em]"
        >
          <Logo />
          지무위키
        </Link>

        {/* 위치 경로 — 제목이 길면 검색·편집 버튼을 밀어내지 않고 말줄임된다 */}
        <div className="flex min-w-0 items-center gap-1.5 text-[13px] text-fg-subtle">
          {categoryName && (
            <>
              <span className="flex-shrink-0">{categoryName}</span>
              <span className="flex-shrink-0">›</span>
            </>
          )}
          <span className="truncate text-fg-soft">{title}</span>
        </div>

        <div className="flex-1" />

        {/* 검색 */}
        <Link
          href={ROUTES.search()}
          className="flex w-60 flex-shrink-0 items-center gap-2 rounded-[9px] bg-surface-2 elevate-control px-3 py-2 text-[13px] text-fg-subtle"
        >
          <span className="inline-block h-[13px] w-[13px] rounded-full border-[1.5px] border-fg-subtle" />
          문서 검색
          <span className="ml-auto rounded bg-elevated px-[5px] py-px font-mono text-[11px]">
            /
          </span>
        </Link>

        {/* 편집 중 표시 */}
        {editingName && (
          <div className="flex flex-shrink-0 items-center gap-2 rounded-[20px] bg-success/12 py-1.5 pl-2.5 pr-[13px] text-[12.5px] text-success-fg">
            <span className="h-[7px] w-[7px] animate-[livepulse_2s_infinite] rounded-full bg-success" />
            <b className="text-success-strong">{editingName}</b> 편집 중
          </div>
        )}

        {/* 편집 버튼 */}
        <Link
          href={ROUTES.documentEdit(articleId)}
          className="flex flex-shrink-0 items-center gap-[7px] rounded-[9px] bg-surface-2 elevate-control px-[15px] py-2 transition hover:elevate-1 text-[13.5px] font-semibold text-fg"
        >
          <span className="inline-block h-3 w-3 rounded-[3px] border-[1.6px] border-fg-soft" />
          편집
        </Link>

        {/* 케밥 메뉴 */}
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="문서 메뉴"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[9px] bg-surface-2 text-fg-soft elevate-control transition hover:elevate-1"
          >
            <span className="h-[3.5px] w-[3.5px] rounded-full bg-current" />
            <span className="h-[3.5px] w-[3.5px] rounded-full bg-current" />
            <span className="h-[3.5px] w-[3.5px] rounded-full bg-current" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-[60] w-[210px] rounded-xl bg-surface-2 p-1.5 elevate-3">
              <div className="cursor-pointer rounded-[7px] px-[11px] py-[9px] text-[13.5px] text-fg-muted hover:bg-hover">
                즐겨찾기에 추가
              </div>
              <div className="cursor-pointer rounded-[7px] px-[11px] py-[9px] text-[13.5px] text-fg-muted hover:bg-hover">
                링크 복사
              </div>
              <Link
                href={ROUTES.documentHistory(articleId)}
                className="block cursor-pointer rounded-[7px] px-[11px] py-[9px] text-[13.5px] text-fg-muted hover:bg-hover"
              >
                편집 역사 전체 보기
              </Link>
              <div className="mx-2 my-[5px] h-px bg-line" />
              <div className="flex cursor-pointer items-center gap-2 rounded-[7px] px-[11px] py-[9px] text-[13.5px] text-danger hover:bg-danger/10">
                <span className="inline-block h-[13px] w-[13px] rounded-[3px] border-[1.5px] border-danger" />
                문서 신고
              </div>
            </div>
          )}
        </div>

        {/* 계정 — 시안에는 없고 로그인 연동 때 더했다. 다른 헤더처럼 오른쪽 끝에 둔다. */}
        <AccountButton />
      </div>
    </header>
  );
}

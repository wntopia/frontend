import Link from "next/link";
import { AccountButton } from "@/features/auth";
import { ROUTES } from "@/shared/config";
import { Logo } from "@/shared/ui";
import { DocumentMenu } from "./DocumentMenu";

/**
 * 문서 상세 페이지 전용 상단 네비게이션.
 * 상태가 있는 케밥 메뉴만 클라이언트 컴포넌트(`DocumentMenu`)로 떼어 두고 나머지는 서버에서 그린다.
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
        <DocumentMenu articleId={articleId} />

        {/* 계정 — 시안에는 없고 로그인 연동 때 더했다. 다른 헤더처럼 오른쪽 끝에 둔다. */}
        <AccountButton />
      </div>
    </header>
  );
}

import Link from "next/link";

/** 미리보기·취소가 같은 모양이라 공유한다 */
const SECONDARY_BUTTON =
  "cursor-pointer rounded-lg bg-surface-2 elevate-control px-[14px] py-2 text-[13px] font-semibold text-fg-muted hover:text-fg-muted";

type EditorTopBarProps = {
  /**
   * 편집을 그만두면 돌아갈 곳. 뒤로 가기 링크와 취소 버튼이 함께 쓴다.
   * 새 문서는 돌아갈 문서가 없어 문서 주소를 여기서 만들지 않고 화면에서 받는다.
   */
  backHref: string;
  /** 뒤로 가기 링크에 표시되는 이름. 기존 문서를 편집할 때는 그 문서의 제목이다. */
  backLabel: string;
  showPreview: boolean;
  onTogglePreview: () => void;
};

/** 편집 화면 상단 바. 다른 화면과 달리 로고 대신 문서 복귀 링크와 편집 액션을 둔다. */
export function EditorTopBar({
  backHref,
  backLabel,
  showPreview,
  onTogglePreview,
}: EditorTopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg/[.92] elevate-header backdrop-blur-[10px]">
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center gap-4 px-8">
        {/* 돌아갈 곳이 문서 화면이면 미리 가져오기가 문서를 조회해 조회수를 올린다 (CLAUDE.md '백엔드 연동과 인증') */}
        <Link
          href={backHref}
          prefetch={false}
          className="flex items-center gap-[7px] text-[13.5px] text-fg-soft hover:text-fg-soft"
        >
          <span className="text-[15px]">←</span> {backLabel}
        </Link>
        <span className="rounded-[5px] bg-accent/[.12] px-[9px] py-[3px] font-mono text-[11px] text-accent-hover">
          편집 중
        </span>

        <div className="flex-1" />

        <button type="button" onClick={onTogglePreview} className={SECONDARY_BUTTON}>
          {showPreview ? "편집기로 돌아가기" : "미리보기"}
        </button>
        <Link href={backHref} prefetch={false} className={SECONDARY_BUTTON}>
          취소
        </Link>
        {/* 시안에 저장 동작이 없어 아직 아무 일도 하지 않는다 */}
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-[13px] font-bold text-on-accent elevate-control transition hover:bg-accent-hover"
        >
          저장
        </button>
      </div>
    </header>
  );
}

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
  onSave: () => void;
  /** 저장 요청이 오가는 동안과 저장 뒤 문서로 넘어가는 동안 저장 버튼을 막는다 */
  saving: boolean;
  /**
   * 뒤로 가기·취소 링크로 떠나기 직전에 불린다. `preventDefault()`를 부르면 머문다.
   * 저장하지 않은 내용이 있을 때 확인을 받는 데 쓴다 (`<Link>`의 `onNavigate`).
   */
  onLeave: (event: { preventDefault: () => void }) => void;
};

/** 편집 화면 상단 바. 다른 화면과 달리 로고 대신 문서 복귀 링크와 편집 액션을 둔다. */
export function EditorTopBar({
  backHref,
  backLabel,
  showPreview,
  onTogglePreview,
  onSave,
  saving,
  onLeave,
}: EditorTopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg/[.92] elevate-header backdrop-blur-[10px]">
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center gap-4 px-8">
        <Link
          href={backHref}
          onNavigate={onLeave}
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
        <Link href={backHref} onNavigate={onLeave} className={SECONDARY_BUTTON}>
          취소
        </Link>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-[13px] font-bold text-on-accent elevate-control transition hover:bg-accent-hover disabled:cursor-default disabled:opacity-60 disabled:hover:bg-accent"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </header>
  );
}

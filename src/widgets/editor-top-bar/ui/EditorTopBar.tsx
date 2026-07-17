import Link from "next/link";
import { ROUTES } from "@/shared/config";

/** 미리보기·취소가 같은 모양이라 공유한다 */
const SECONDARY_BUTTON =
  "cursor-pointer rounded-lg border border-line-strong bg-surface-2 px-[14px] py-2 text-[13px] font-semibold text-fg-muted hover:text-fg-muted";

type EditorTopBarProps = {
  /** 편집 중인 문서 제목. 뒤로 가기 링크에 표시된다. */
  documentTitle: string;
  showPreview: boolean;
  onTogglePreview: () => void;
};

/** 편집 화면 상단 바. 다른 화면과 달리 로고 대신 문서 복귀 링크와 편집 액션을 둔다. */
export function EditorTopBar({
  documentTitle,
  showPreview,
  onTogglePreview,
}: EditorTopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#23262c] bg-bg/[.92] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center gap-4 px-8">
        <Link
          href={ROUTES.document}
          className="flex items-center gap-[7px] text-[13.5px] text-[#a8adb5] hover:text-[#a8adb5]"
        >
          <span className="text-[15px]">←</span> {documentTitle}
        </Link>
        <span className="rounded-[5px] border border-accent/25 bg-accent/[.12] px-[9px] py-[3px] font-mono text-[11px] text-accent-hover">
          편집 중
        </span>

        <div className="flex-1" />

        <button type="button" onClick={onTogglePreview} className={SECONDARY_BUTTON}>
          {showPreview ? "편집기로 돌아가기" : "미리보기"}
        </button>
        <Link href={ROUTES.document} className={SECONDARY_BUTTON}>
          취소
        </Link>
        {/* 시안에 저장 동작이 없어 아직 아무 일도 하지 않는다 */}
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-[13px] font-bold text-[#06101f]"
        >
          저장
        </button>
      </div>
    </header>
  );
}

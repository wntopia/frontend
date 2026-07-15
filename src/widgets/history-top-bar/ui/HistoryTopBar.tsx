import Link from "next/link";
import { ROUTES } from "@/shared/config";

type HistoryTopBarProps = {
  /** 역사를 보고 있는 문서 제목. 뒤로 가기 링크에 표시된다. */
  documentTitle: string;
};

/** 편집 역사 화면 상단 바 — 문서 복귀 링크와 화면 제목만 둔다. */
export function HistoryTopBar({ documentTitle }: HistoryTopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#23262c] bg-bg/85 backdrop-blur-[10px]">
      <div className="mx-auto flex h-[58px] max-w-[1000px] items-center gap-4 px-8">
        <Link
          href={ROUTES.document}
          className="flex items-center gap-[7px] text-[13.5px] text-[#a8adb5] hover:text-[#a8adb5]"
        >
          <span className="text-[15px]">←</span> {documentTitle}
        </Link>
        <div className="flex-1" />
        <span className="text-[13.5px] font-bold">편집 역사</span>
      </div>
    </header>
  );
}

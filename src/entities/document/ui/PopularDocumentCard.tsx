import Link from "next/link";
import type { PopularDocument } from "../model/types";

type PopularDocumentCardProps = {
  doc: PopularDocument;
  /** 목록에서의 순위 (1부터). 디자인상 "01" 형태로 표시된다. */
  rank: number;
};

/** 인기 문서 그리드의 카드 */
export function PopularDocumentCard({ doc, rank }: PopularDocumentCardProps) {
  return (
    <Link
      href={doc.href}
      className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-[#3a3f47]"
    >
      <div className="mb-1.5 font-mono text-[11px] text-accent">
        {String(rank).padStart(2, "0")}
      </div>
      <div className="mb-1 text-[15px] font-bold text-fg">{doc.title}</div>
      {/* 서버·클라이언트 렌더 결과가 갈리지 않도록 로케일을 고정한다 */}
      <div className="text-xs text-fg-subtle">
        조회 {doc.views.toLocaleString("ko-KR")}
      </div>
    </Link>
  );
}

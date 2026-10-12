import Link from "next/link";
import type { SearchResult } from "../model/types";

type SearchResultCardProps = {
  result: SearchResult;
};

/** 검색 결과 목록의 카드 */
export function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <Link
      href={result.href}
      className="block rounded-xl bg-surface px-5 py-4 elevate-1 transition hover:-translate-y-0.5 hover:elevate-2"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`text-[15.5px] font-bold ${
            result.missing ? "text-danger" : "text-fg"
          }`}
        >
          {result.title}
        </span>
        {result.missing && (
          <span className="rounded bg-danger/12 px-1.5 py-px font-mono text-[10.5px] text-danger-fg">
            미작성
          </span>
        )}
      </div>

      <p className="text-[13.5px] leading-[1.6] text-fg-dim">
        {result.snippet.map((segment, index) =>
          segment.highlight ? (
            <mark
              key={index}
              className="rounded-[3px] bg-accent/[.22] px-0.5 text-accent-fg"
            >
              {segment.text}
            </mark>
          ) : (
            <span key={index}>{segment.text}</span>
          ),
        )}
      </p>

      {result.lastModified && (
        <div className="mt-2 font-mono text-[11px] text-fg-subtle">
          최종 수정 {result.lastModified}
        </div>
      )}
    </Link>
  );
}

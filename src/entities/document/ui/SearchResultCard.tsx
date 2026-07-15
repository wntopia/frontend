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
      className="block rounded-xl border border-line px-5 py-4 transition-colors hover:border-[#3a3f47] hover:bg-[#151619]"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`text-[15.5px] font-bold ${
            result.missing ? "text-[#ff6b6b]" : "text-fg"
          }`}
        >
          {result.title}
        </span>
        {result.missing && (
          <span className="rounded border border-[#ff6b6b]/25 bg-[#ff6b6b]/10 px-1.5 py-px font-mono text-[10.5px] text-[#ff9b9b]">
            미작성
          </span>
        )}
      </div>

      <p className="text-[13.5px] leading-[1.6] text-[#8b919a]">
        {result.snippet.map((segment, index) =>
          segment.highlight ? (
            <mark
              key={index}
              className="rounded-[3px] bg-accent/[.22] px-0.5 text-[#cfe1ff]"
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

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
      // 문서 화면은 그릴 때마다 문서를 조회하고 백엔드는 그 조회를 조회수로 센다. 미리 가져오기도 화면을 그려
      // 문서를 조회하므로, 켜 두면 검색만 해도 결과에 보인 문서들(한 쪽에 최대 20개)의 조회수가 오른다.
      prefetch={false}
      // 띄어쓰기 없이 긴 제목·본문이 카드 밖으로 넘치지 않게 한다
      className="block rounded-xl bg-surface px-5 py-4 elevate-1 transition [overflow-wrap:anywhere] hover:-translate-y-0.5 hover:elevate-2"
    >
      <div className="mb-1.5 text-[15.5px] font-bold text-fg">
        {result.title}
      </div>

      {result.snippet.length > 0 && (
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
      )}

      <div className="mt-2 font-mono text-[11px] text-fg-subtle">
        최종 수정 {result.lastModified}
      </div>
    </Link>
  );
}

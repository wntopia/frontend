import { SearchResultCard, type SearchResult } from "@/entities/document";

type SearchResultsProps = {
  query: string;
  results: SearchResult[];
};

/** 검색 결과 건수와 결과 목록 */
export function SearchResults({ query, results }: SearchResultsProps) {
  return (
    <section>
      <div className="mb-6 text-sm text-fg-subtle">
        &apos;<span className="font-semibold text-fg">{query}</span>&apos; 검색
        결과 <b className="text-[#a8adb5]">{results.length}건</b>
      </div>
      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
    </section>
  );
}

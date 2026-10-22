import { SearchResultCard } from "@/entities/document";
import type { ArticleSearchResDto } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { toSearchResult } from "../model/to-search-result";
import { SearchNotice } from "./SearchNotice";
import { SearchPager } from "./SearchPager";

type SearchResultsProps = {
  query: string;
  /** 검색 응답 한 페이지 */
  result: ArticleSearchResDto;
};

/** 검색 결과 건수와 결과 목록, 페이지 이동 */
export function SearchResults({ query, result }: SearchResultsProps) {
  return (
    <section>
      <div className="mb-6 text-sm text-fg-subtle [overflow-wrap:anywhere]">
        &apos;<span className="font-semibold text-fg">{query}</span>&apos; 검색
        결과{" "}
        <b className="text-fg-soft">
          {result.totalElements.toLocaleString("ko-KR")}건
        </b>
      </div>

      {result.items.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {result.items.map((item) => (
              <SearchResultCard key={item.id} result={toSearchResult(item)} />
            ))}
          </div>
          <SearchPager
            query={query}
            page={result.page + 1}
            pageCount={result.totalPages}
          />
        </>
      ) : result.totalElements === 0 ? (
        <SearchNotice
          title="일치하는 문서가 없습니다"
          description="제목과 본문에서 띄어쓰기까지 똑같이 찾습니다. 낱말을 줄이거나 다른 말로 찾아보세요."
        />
      ) : (
        // 결과가 줄었거나 주소를 고쳐 결과 끝을 넘은 페이지로 온 경우다.
        <SearchNotice
          title="이 페이지에는 결과가 없습니다"
          description={`검색 결과는 ${result.totalPages.toLocaleString("ko-KR")}쪽까지 있습니다.`}
          action={{ href: ROUTES.search(query), label: "첫 페이지로" }}
        />
      )}
    </section>
  );
}

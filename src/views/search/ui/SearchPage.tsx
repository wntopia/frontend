import { SEARCH_QUERY_PARAM } from "@/shared/config";
import { firstParam, type SearchParams } from "@/shared/lib";
import { CreateDocumentCta } from "@/widgets/create-document-cta";
import { Header } from "@/widgets/header";
import { SearchResults } from "@/widgets/search-results";
import { SEARCH_QUERY, SEARCH_RESULTS } from "../model/mock";

/** 검색 결과 화면 */
export async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  // 검색어를 입력할 곳이 아직 없어 대부분 검색어 없이 들어온다. 그때는 시안의 검색어로 화면을 채운다.
  const query = firstParam(params[SEARCH_QUERY_PARAM])?.trim() || SEARCH_QUERY;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header variant="search" query={query} />

      <div className="mx-auto max-w-[900px] px-8 pb-[120px] pt-10">
        <SearchResults query={query} results={SEARCH_RESULTS} />
        <CreateDocumentCta query={query} />
      </div>
    </div>
  );
}

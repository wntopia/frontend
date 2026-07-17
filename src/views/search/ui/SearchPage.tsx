import { CreateDocumentCta } from "@/widgets/create-document-cta";
import { Header } from "@/widgets/header";
import { SearchResults } from "@/widgets/search-results";
import { SEARCH_QUERY, SEARCH_RESULTS } from "../model/mock";

/** 검색 결과 화면 */
export function SearchPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header variant="search" query={SEARCH_QUERY} />

      <div className="mx-auto max-w-[900px] px-8 pb-[120px] pt-10">
        <SearchResults query={SEARCH_QUERY} results={SEARCH_RESULTS} />
        <CreateDocumentCta query={SEARCH_QUERY} />
      </div>
    </div>
  );
}

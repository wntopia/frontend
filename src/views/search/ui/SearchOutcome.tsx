import {
  SEARCH_QUERY_MAX_LENGTH,
  articleTitleExists,
  searchArticles,
} from "@/entities/document";
import { isApiError, type ArticleSearchResDto } from "@/shared/api";
import { CreateDocumentCta } from "@/widgets/create-document-cta";
import { SearchNotice, SearchResults } from "@/widgets/search-results";

/** 한 페이지에 보일 결과 수. 백엔드 기본값과 같다. */
const PAGE_SIZE = 20;

/** 검색어로 결과를 받아 그린다. 기다리는 동안은 `SearchPage`의 Suspense가 자리표시를 보인다. */
export async function SearchOutcome({
  query,
  page,
}: {
  query: string;
  /** 1부터 */
  page: number;
}) {
  let result: ArticleSearchResDto;
  let titleExists: boolean;
  try {
    [result, titleExists] = await Promise.all([
      searchArticles(query, { page: page - 1, size: PAGE_SIZE }),
      articleTitleExists(query),
    ]);
  } catch (error) {
    // 입력칸은 길이를 막아 두지만, 주소를 직접 고치면 백엔드가 받지 않는 검색어가 올 수 있다.
    if (isApiError(error, 400)) {
      return (
        <SearchNotice
          title="검색할 수 없는 검색어입니다"
          description={`검색어는 ${SEARCH_QUERY_MAX_LENGTH}자까지 입력할 수 있습니다.`}
        />
      );
    }
    throw error;
  }

  return (
    <>
      <SearchResults query={query} result={result} />
      {/* 같은 제목의 문서는 다시 만들 수 없다. 있으면 결과 맨 앞에 나오므로 안내하지 않는다. */}
      {!titleExists && <CreateDocumentCta query={query} />}
    </>
  );
}

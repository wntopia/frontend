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
      // 안내를 숨길지 정하는 데만 쓰는 보조 조회라, 실패해도 검색 결과는 보여야 한다. 그때는 안내를 그대로 두고,
      // 겹치는 제목이면 문서를 만들 때 백엔드가 409로 다시 막는다.
      articleTitleExists(query).catch(() => false),
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
    // 백엔드는 검색이 몰리면 기다리지 않고 503을 준다. 잠시 붐비는 것이라 화면 전체를 오류로 바꾸지 않고
    // 결과 자리에서 알려, 위의 검색창으로 곧바로 다시 찾을 수 있게 한다.
    if (isApiError(error, 503)) {
      return (
        <SearchNotice
          title="지금은 검색할 수 없습니다"
          description="검색이 몰려 결과를 가져오지 못했습니다. 잠시 후 다시 검색해 주세요."
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

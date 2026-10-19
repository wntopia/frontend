import { stripSnippetSyntax, type SearchResult } from "@/entities/document";
import type { ArticleSearchItemResDto } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { formatDateTime } from "@/shared/lib";

/** 검색 응답의 한 항목을 결과 카드가 그릴 모양으로 바꾼다. */
export function toSearchResult(item: ArticleSearchItemResDto): SearchResult {
  return {
    id: item.id,
    title: item.title,
    href: ROUTES.document(item.id),
    snippet: stripSnippetSyntax(item.snippet),
    // 문서 화면의 '최종 수정'과 같은 포맷이다.
    lastModified: formatDateTime(item.updatedAt),
  };
}

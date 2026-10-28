// 서버 컴포넌트용 `getArticle`·`getArticleRevisions`는 `@/entities/document/server`에서 import 한다.
export { fetchArticle, fetchArticleRevisions } from "./api/article";
export { fetchBacklinks } from "./api/backlinks";
export { searchArticles } from "./api/search";
export {
  articleTitleExists,
  findArticleIdByTitle,
  resolveLinkTargets,
} from "./api/title-lookup";
export {
  collectLinkTargets,
  type WikiLinkTargets,
} from "./model/link-targets";
export { SEARCH_QUERY_MAX_LENGTH, stripSnippetSyntax } from "./model/search";
export { RecentChangeItem } from "./ui/RecentChangeItem";
export { PopularDocumentCard } from "./ui/PopularDocumentCard";
export { SearchResultCard } from "./ui/SearchResultCard";
export { WikiContent } from "./ui/WikiContent";
export { extractToc, parseWikiText } from "./model/wiki-syntax";
export { getEditorName } from "./model/editor";
export {
  CREATION_REVISION,
  describeCharDelta,
  type CharDeltaTone,
} from "./model/revision";
export { SAMPLE_ARTICLE_ID } from "./model/mock";
export { readArticleId, type ArticleRouteProps } from "./model/route-params";
export type {
  ChangeSummarySegment,
  DocumentActivity,
  PopularDocument,
  RecentChange,
  SearchResult,
  SnippetSegment,
} from "./model/types";
export type {
  TocItem,
  WikiBlock,
  WikiHeadingLevel,
  WikiInline,
} from "./model/wiki-syntax";

// 서버 컴포넌트용 `getArticle`·`getArticleRevisions`는 `@/entities/document/server`에서 import 한다.
export {
  fetchArticle,
  fetchArticleRevisions,
  fetchPopularArticles,
  fetchRecentChanges,
} from "./api/article";
export {
  RecentChangeItem,
  RecentChangeItemSkeleton,
} from "./ui/RecentChangeItem";
export { PopularDocumentCard } from "./ui/PopularDocumentCard";
export { SearchResultCard } from "./ui/SearchResultCard";
export { WikiContent } from "./ui/WikiContent";
export { extractToc, parseWikiText } from "./model/wiki-syntax";
export { getEditorName } from "./model/editor";
export { toRecentChange } from "./model/recent-change";
export {
  CREATION_REVISION,
  describeCharDelta,
  type CharDeltaTone,
} from "./model/revision";
export { SAMPLE_ARTICLE_ID } from "./model/mock";
export { readArticleId, type ArticleRouteProps } from "./model/route-params";
export type {
  Backlink,
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

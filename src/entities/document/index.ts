// 서버 컴포넌트용 `getArticle`·`getArticleRevisions`는 `@/entities/document/server`에서 import 한다.
export { fetchArticle, fetchArticleRevisions } from "./api/article";
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
export {
  readArticleId,
  readRevision,
  type ArticleRouteProps,
  type RevisionRouteProps,
} from "./model/route-params";
export { fetchArticleRevision, loadArticleRevision } from "./api/revision";
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

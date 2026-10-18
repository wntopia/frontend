import {
  extractToc,
  parseWikiText,
  readArticleId,
  type ArticleRouteProps,
} from "@/entities/document";
import { getArticle, getArticleRevisions } from "@/entities/document/server";
import { DocumentArticle } from "@/widgets/document-article";
import { DocumentToc } from "@/widgets/document-toc";
import { DocumentTopNav } from "@/widgets/document-top-nav";
import { RecentRevisions } from "@/widgets/recent-revisions";

/** 사이드바 '편집 역사'에 보이는 최근 리비전 수. 시안이 네 줄이다. */
const RECENT_REVISION_COUNT = 4;

/** 문서 상세 화면 — 본문과 오른쪽의 목차 · 최근 편집 역사 */
export async function DocumentPage(props: ArticleRouteProps) {
  const articleId = await readArticleId(props);
  const [article, revisions] = await Promise.all([
    getArticle(articleId),
    getArticleRevisions(articleId, 0, RECENT_REVISION_COUNT),
  ]);

  // 본문과 목차가 같은 파싱 결과를 써야 목차의 앵커가 본문 제목의 id와 어긋나지 않는다.
  const blocks = parseWikiText(article.content);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <DocumentTopNav
        articleId={articleId}
        title={article.title}
        categoryName={article.category?.name}
      />

      <div className="mx-auto flex max-w-[1120px] gap-12 px-8">
        <DocumentArticle
          article={article}
          blocks={blocks}
          editCount={revisions.totalElements}
        />

        {/* 우측 플로팅 사이드바 */}
        <aside className="w-[260px] flex-shrink-0 pt-[52px]">
          <div className="sticky top-[78px] flex flex-col gap-4">
            <DocumentToc items={extractToc(blocks)} />
            <RecentRevisions
              articleId={articleId}
              revisions={revisions.items}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

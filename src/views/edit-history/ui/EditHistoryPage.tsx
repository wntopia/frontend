import { notFound } from "next/navigation";
import { readArticleId, type ArticleRouteProps } from "@/entities/document";
import {
  getArticle,
  getArticleRevisions,
} from "@/entities/document/server";
import type { SearchParams } from "@/shared/lib";
import { HistoryTopBar } from "@/widgets/history-top-bar";
import { RevisionStats } from "@/widgets/revision-stats";
import {
  RevisionPager,
  RevisionTimeline,
  toTimelineRevisions,
} from "@/widgets/revision-timeline";
import { countContributors } from "../model/contributors";
import { readHistoryPage } from "../model/page-param";

/** 한 페이지에 보일 리비전 수 */
const PAGE_SIZE = 30;

type EditHistoryPageProps = ArticleRouteProps & {
  searchParams: Promise<SearchParams>;
};

/** 편집 역사 화면 — 문서의 리비전 통계와 타임라인 */
export async function EditHistoryPage(props: EditHistoryPageProps) {
  const articleId = await readArticleId(props);
  const page = readHistoryPage(await props.searchParams);

  const [article, revisions, contributors] = await Promise.all([
    getArticle(articleId),
    getArticleRevisions(articleId, page - 1, PAGE_SIZE),
    countContributors(articleId),
  ]);

  const pageCount = Math.max(
    Math.ceil(revisions.totalElements / PAGE_SIZE),
    1,
  );
  if (page > pageCount) notFound();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <HistoryTopBar articleId={articleId} documentTitle={article.title} />

      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-9">
        <div className="mb-7">
          <RevisionStats
            // 리비전 1은 생성 시점 내용인데 첫 수정 때에야 기록된다. 수정 전 문서도 리비전 1이 있는 셈이다.
            revisionCount={Math.max(revisions.totalElements, 1)}
            contributors={contributors}
            createdAt={article.createdAt}
          />
        </div>
        <RevisionTimeline
          revisions={toTimelineRevisions(
            revisions.items,
            revisions.totalElements,
            { articleId, createdAt: article.createdAt, now: new Date() },
          )}
        />
        <RevisionPager
          articleId={articleId}
          page={page}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

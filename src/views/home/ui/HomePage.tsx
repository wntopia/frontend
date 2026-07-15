import { CategoryList } from "@/widgets/category-list";
import { Header } from "@/widgets/header";
import { HomeHero } from "@/widgets/home-hero";
import { PopularDocuments } from "@/widgets/popular-documents";
import { RecentChanges } from "@/widgets/recent-changes";
import { WikiStats } from "@/widgets/wiki-stats";

/** 홈 화면 — 위젯을 배치하고 여백만 담당한다 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header variant="full" />
      <HomeHero />

      <div className="mx-auto flex max-w-[1120px] gap-10 px-8 pb-[100px] pt-5">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <RecentChanges />
          <PopularDocuments />
        </div>
        <aside className="flex w-[260px] flex-shrink-0 flex-col gap-4">
          <WikiStats />
          <CategoryList />
        </aside>
      </div>
    </div>
  );
}

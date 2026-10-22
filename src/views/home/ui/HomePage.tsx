import { CategoryList } from "@/widgets/category-list";
import { Header } from "@/widgets/header";
import { HomeHero } from "@/widgets/home-hero";
import { PopularDocuments } from "@/widgets/popular-documents";
import { RecentChanges } from "@/widgets/recent-changes";
import { WikiStats } from "@/widgets/wiki-stats";

/**
 * 홈 화면 — 위젯을 배치하고 여백만 담당한다.
 *
 * 데이터 위젯은 저마다 요청 시점에 백엔드를 읽어(문서를 고치면 다음 방문에 바로 보이도록) 이 화면은 동적
 * 렌더링이다. 위젯마다 자기 Suspense 경계 안에서 불러오므로, 느리거나 실패한 위젯이 나머지를 막지 않는다.
 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header variant="home" />
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

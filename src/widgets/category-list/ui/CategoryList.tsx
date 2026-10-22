import { Suspense } from "react";
import { nullOnFailure, publicServerApiFetch } from "@/shared/api/server";
import { SidebarCard } from "@/shared/ui";
import { fetchCategories } from "../api/categories";

/** 불러오는 동안 보일 줄 수. 시안의 분류가 네 개다. */
const SKELETON_ROW_COUNT = 4;

/** 홈 사이드바의 '분류' 카드 */
export function CategoryList() {
  return (
    <SidebarCard title="분류">
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryItems />
      </Suspense>
    </SidebarCard>
  );
}

/**
 * 분류와 분류별 문서 수. 분류별 문서 목록 화면이 아직 없어 항목을 링크로 만들지 않는다 —
 * 검색은 제목·본문으로 찾을 뿐 분류로 거르지 못해, 검색 화면으로 보내면 그 분류가 아닌 문서가 섞인다.
 * 실패해도 이 카드만 안내로 바꾸고 홈의 나머지는 그대로 둔다.
 */
async function CategoryItems() {
  const categories = await nullOnFailure(
    fetchCategories(publicServerApiFetch),
    "홈 분류",
  );

  if (!categories) {
    return (
      <CardMessage>
        분류를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.
      </CardMessage>
    );
  }
  if (categories.length === 0) {
    return <CardMessage>아직 만들어진 분류가 없습니다.</CardMessage>;
  }

  return (
    <ul>
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex items-baseline justify-between gap-3 py-[5px] text-[13.5px]"
        >
          <span className="min-w-0 truncate text-fg-soft">{category.name}</span>
          <span className="flex-shrink-0 font-mono text-[11.5px] text-fg-subtle">
            {category.articleCount.toLocaleString("ko-KR")}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CategoryListSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">분류를 불러오는 중…</span>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <div
          key={index}
          aria-hidden
          className="flex h-[1.5em] items-center py-[5px] text-[13.5px] box-content motion-safe:animate-pulse"
        >
          <span className="h-[0.9em] w-1/3 rounded-md bg-elevated" />
        </div>
      ))}
    </div>
  );
}

function CardMessage({ children }: { children: string }) {
  return (
    // 좁은 사이드바에서 '새로고/침해'처럼 낱말 중간에서 끊기지 않게 한다.
    <p className="break-keep text-[13px] leading-[1.6] text-fg-subtle">
      {children}
    </p>
  );
}

import type { Metadata } from "next";
import type { SearchParams } from "@/shared/lib";
import { readSearchQuery } from "./search-params";

/** 탭 제목에 검색어를 싣는다. 여러 탭에 검색을 띄워 두어도 구별되게 한다. */
export async function generateSearchMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const query = readSearchQuery(await searchParams);

  return {
    title: query ? `'${query}' 검색 결과 · 지무위키` : "검색 · 지무위키",
  };
}

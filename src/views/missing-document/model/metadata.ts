import type { Metadata } from "next";
import type { SearchParams } from "@/shared/lib";
import { readMissingDocumentTitle } from "./search-params";

/** 탭 제목에 문서 제목을 싣는다. 여러 붉은 링크를 탭으로 열어 두어도 구별되게 한다. */
export async function generateMissingDocumentMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const title = readMissingDocumentTitle(await searchParams);

  return {
    title: `'${title}' 문서 없음 · 지무위키`,
    // 아무 제목으로나 열리는 화면이라 검색 엔진에 올리지 않는다.
    robots: { index: false },
  };
}

import { getArticleRevisions } from "@/entities/document/server";

/** 백엔드가 한 번에 주는 최대 개수 */
const PAGE_SIZE = 100;
/**
 * 기여자를 세려고 읽을 최대 페이지 수 (= 리비전 1,000개).
 * 백엔드에 문서별 기여자 수가 없어 목록을 전부 읽어 세는데, 화면이 이 조회를 기다리므로 상한을 둔다.
 * 교내 위키 문서가 이 이상 편집되는 일은 드물고, 넘으면 '+'를 붙여 일부만 셌음을 드러낸다.
 */
const MAX_PAGES = 10;

/**
 * 문서의 고유 편집자 수. 편집자는 "학번 이름" 문자열로 구분한다 — 이름만으로는 동명이인이 합쳐진다.
 * 생성자는 응답에 없어 세지 못한다.
 */
export async function countContributors(
  articleId: number,
): Promise<{ count: number; partial: boolean }> {
  const first = await getArticleRevisions(articleId, 0, PAGE_SIZE);
  const pageCount = Math.min(
    Math.ceil(first.totalElements / PAGE_SIZE),
    MAX_PAGES,
  );
  // 전체 개수는 첫 페이지를 받아야 알 수 있다. 나머지 페이지는 서로 기다릴 이유가 없어 한꺼번에 부른다.
  const rest = await Promise.all(
    Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) =>
      getArticleRevisions(articleId, index + 1, PAGE_SIZE),
    ),
  );

  const editors = new Set(
    [first, ...rest].flatMap((page) => page.items.map((item) => item.editor)),
  );
  return {
    count: editors.size,
    partial: first.totalElements > pageCount * PAGE_SIZE,
  };
}

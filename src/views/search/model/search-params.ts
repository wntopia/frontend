import { notFound } from "next/navigation";
import { SEARCH_PAGE_PARAM, SEARCH_QUERY_PARAM } from "@/shared/config";
import { firstParam, type SearchParams } from "@/shared/lib";

/** 주소의 검색어. 백엔드도 양끝 공백을 빼고 찾으므로 뺀 값으로 보인다. 없으면 빈 문자열이다. */
export function readSearchQuery(params: SearchParams): string {
  return firstParam(params[SEARCH_QUERY_PARAM])?.trim() ?? "";
}

/**
 * 주소의 `?page=`를 1부터 세는 페이지 번호로 읽는다. 없으면 첫 페이지다.
 * 페이지가 될 수 없는 값(`abc`, `0`, `01`)은 문서 id(`readArticleId`)와 같은 규칙으로 404로 끝낸다.
 */
export function readSearchPage(params: SearchParams): number {
  const raw = firstParam(params[SEARCH_PAGE_PARAM]);
  if (raw === undefined) return 1;
  if (!/^[1-9]\d*$/.test(raw)) notFound();

  const page = Number(raw);
  if (!Number.isSafeInteger(page)) notFound();
  return page;
}

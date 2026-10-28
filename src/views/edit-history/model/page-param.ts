import { notFound } from "next/navigation";
import { HISTORY_PAGE_PARAM } from "@/shared/config";
import { firstParam, type SearchParams } from "@/shared/lib";

/**
 * 백엔드가 받는 가장 큰 페이지 번호(1부터 셈). 백엔드는 0부터 세는 번호를 `Int`로 받아, 넘치는 값에는
 * 404가 아니라 400을 준다. 그 400이 에러 화면으로 번지지 않게 보내기 전에 없는 페이지로 끝낸다.
 */
const MAX_PAGE = 2_147_483_647 + 1;

/**
 * 주소의 `?page=`를 1부터 세는 페이지 번호로 읽는다. 없으면 첫 페이지다.
 * 페이지가 될 수 없는 값(`abc`, `0`, `01`)은 문서 id(`readArticleId`)와 같은 규칙으로 404로 끝낸다.
 */
export function readHistoryPage(params: SearchParams): number {
  const raw = firstParam(params[HISTORY_PAGE_PARAM]);
  if (raw === undefined) return 1;
  if (!/^[1-9]\d*$/.test(raw)) notFound();

  const page = Number(raw);
  if (page > MAX_PAGE) notFound();
  return page;
}

import { notFound } from "next/navigation";
import { MISSING_DOCUMENT_TITLE_PARAM } from "@/shared/config";
import { firstParam, type SearchParams } from "@/shared/lib";

/**
 * 주소의 문서 제목. 백엔드가 제목 앞뒤 공백을 지우고 다루므로 지운 값으로 보인다.
 * 제목이 없으면 안내할 문서도 없으므로 404로 끝낸다.
 */
export function readMissingDocumentTitle(params: SearchParams): string {
  const title = firstParam(params[MISSING_DOCUMENT_TITLE_PARAM])?.trim();
  if (!title) notFound();
  return title;
}

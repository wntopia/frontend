import { notFound } from "next/navigation";

/** `[articleId]` 세그먼트 아래의 page와 generateMetadata가 받는 props */
export type ArticleRouteProps = {
  params: Promise<{ articleId: string }>;
};

/**
 * 주소의 `[articleId]`를 문서 id로 읽는다. 문서 id가 될 수 없는 값이면 404로 끝낸다.
 *
 * 세그먼트는 누구나 주소창에 아무 값이나 넣을 수 있는 문자열인데 백엔드는 숫자 id만 받는다.
 * `Number()`는 "1e3"·"0x10"·"007"도 숫자로 읽어 한 문서에 주소가 여러 개 생기므로,
 * `ROUTES.document(id)`가 만드는 모양(0으로 시작하지 않는 숫자)만 받는다.
 */
export async function readArticleId({
  params,
}: ArticleRouteProps): Promise<number> {
  const { articleId } = await params;
  if (!/^[1-9]\d*$/.test(articleId)) notFound();

  const id = Number(articleId);
  // 자릿수가 너무 길면 가까운 다른 수로 바뀌어 엉뚱한 문서를 가리키게 된다.
  if (!Number.isSafeInteger(id)) notFound();

  return id;
}

/** `[articleId]/history/[revision]` 아래의 page와 generateMetadata가 받는 props */
export type RevisionRouteProps = {
  params: Promise<{ articleId: string; revision: string }>;
};

/**
 * 백엔드의 리비전 번호는 32비트 정수(Kotlin `Int`)다. 이보다 큰 값은 백엔드가 숫자로 읽지 못해 404가 아니라
 * 400으로 답하므로, 보내기 전에 없는 리비전으로 끝낸다.
 */
const MAX_REVISION = 2_147_483_647;

/**
 * 주소의 `[revision]`을 리비전 번호로 읽는다. 리비전 번호가 될 수 없는 값이면 404로 끝낸다.
 * 문서 id(`readArticleId`)와 같은 이유로 `ROUTES.documentRevision`이 만드는 모양(0으로 시작하지 않는 숫자)만 받는다.
 */
export async function readRevision({
  params,
}: RevisionRouteProps): Promise<number> {
  const { revision } = await params;
  if (!/^[1-9]\d*$/.test(revision)) notFound();

  const value = Number(revision);
  if (value > MAX_REVISION) notFound();

  return value;
}

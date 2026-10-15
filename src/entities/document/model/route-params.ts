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

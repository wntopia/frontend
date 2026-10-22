import type { Metadata } from "next";
import { readArticleId, type ArticleRouteProps } from "@/entities/document";
import { getArticle } from "@/entities/document/server";

/** 탭 제목에 문서 제목을 싣는다. 화면과 같은 조회라 백엔드는 한 번만 불린다. */
export async function generateDocumentMetadata(
  props: ArticleRouteProps,
): Promise<Metadata> {
  const article = await getArticle(await readArticleId(props));

  return { title: `${article.title} · 지무위키` };
}

import type { Metadata } from "next";
import { readArticleId, type ArticleRouteProps } from "@/entities/document";
import { getArticle } from "@/entities/document/server";

/** 탭 제목에 역사를 보고 있는 문서의 제목을 싣는다. */
export async function generateEditHistoryMetadata(
  props: ArticleRouteProps,
): Promise<Metadata> {
  // 화면도 같은 문서를 읽는다. `getArticle`이 한 번의 렌더링 안에서 호출을 합쳐 주므로 백엔드는 한 번만 불린다.
  const article = await getArticle(await readArticleId(props));

  return { title: `${article.title} 편집 역사 · 지무위키` };
}

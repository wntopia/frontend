import type { Metadata } from "next";
import { readArticleId, type ArticleRouteProps } from "@/entities/document";
import { getArticle } from "@/entities/document/server";
import { requireSession } from "@/features/auth/server";
import { ROUTES } from "@/shared/config";

/** 탭 제목에 편집 중인 문서의 제목을 싣는다. 화면과 같은 조회라 백엔드는 한 번만 불린다. */
export async function generateEditMetadata(
  props: ArticleRouteProps,
): Promise<Metadata> {
  const articleId = await readArticleId(props);
  // 화면과 같은 순서로 로그인부터 본다. 화면과 따로 실행되므로 여기서도 막지 않으면, 로그인 화면으로
  // 보낼 사용자 몫으로 문서를 조회해 조회수가 오른다. 세션 조회도 렌더링 안에서는 한 번뿐이다.
  await requireSession(ROUTES.documentEdit(articleId));
  const article = await getArticle(articleId);

  return { title: `${article.title} 편집 · 지무위키` };
}

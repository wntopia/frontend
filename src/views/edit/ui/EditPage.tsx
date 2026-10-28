import { readArticleId, type ArticleRouteProps } from "@/entities/document";
import { getArticle } from "@/entities/document/server";
import { requireSession } from "@/features/auth/server";
import { ROUTES } from "@/shared/config";
import { EditWorkspace } from "./EditWorkspace";

/**
 * 기존 문서 편집 화면. 로그인한 사용자만 들어올 수 있다.
 *
 * 로그인 검사와 문서 조회는 서버에서 해야 하는데 편집 화면 본체는 상태를 가진 클라이언트 컴포넌트라,
 * 그 둘만 하는 서버 컴포넌트를 한 겹 두었다.
 */
export async function EditPage(props: ArticleRouteProps) {
  const articleId = await readArticleId(props);
  // 로그인을 먼저 본다. 로그인 화면으로 보낼 사용자 몫으로 문서를 조회하면 조회수만 오른다.
  const user = await requireSession(ROUTES.documentEdit(articleId));
  // 문서 조회는 조회수를 올리지만 조회수를 올리지 않는 최신 본문 조회가 백엔드에 없다.
  // 같은 계정이 30분 안에 다시 조회하면 세지 않아, 문서를 보다가 편집으로 넘어오면 더 오르지 않는다.
  const article = await getArticle(articleId);

  return (
    <EditWorkspace
      // 다른 문서의 편집 화면으로 옮겨도 Next가 이 컴포넌트를 재사용해 상태가 남는다. 공동편집 연결은 처음 그릴 때
      // 한 문서로 만들어지므로, 문서가 바뀌면 화면을 새로 만든다.
      key={articleId}
      target={{
        kind: "update",
        articleId,
        studentAccount: Boolean(user.student),
      }}
      initialTitle={article.title}
      initialContent={article.content}
      imageUrl={article.imageUrl}
      backHref={ROUTES.document(articleId)}
      backLabel={article.title}
      returnTo={ROUTES.documentEdit(articleId)}
    />
  );
}

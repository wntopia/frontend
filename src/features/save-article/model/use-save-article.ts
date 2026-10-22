import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ROUTES } from "@/shared/config";
import { createArticle, updateArticle } from "../api/save-article";
import { findDraftProblem, type ArticleDraft, type SaveTarget } from "./draft";
import { describeSaveError, type SaveProblem } from "./save-problem";

/**
 * - `idle`: 저장할 수 있다
 * - `saving`: 요청을 보냈고 응답을 기다린다
 * - `saved`: 저장했고 문서로 넘어가는 중이다. 화면이 바뀔 때까지 다시 저장하지 못한다
 */
export type SaveStatus = "idle" | "saving" | "saved";

/**
 * 편집 화면의 '저장' 동작. 입력을 검증해 생성(POST)·수정(PUT)을 보내고, 성공하면 문서 상세로 보낸다.
 * 실패하면 `problem`에 안내를 남기고 입력은 건드리지 않는다 — 고쳐서 다시 저장할 수 있어야 한다.
 */
export function useSaveArticle(target: SaveTarget) {
  const router = useRouter();
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [problem, setProblem] = useState<SaveProblem | null>(null);
  // `status`는 다음 렌더링에야 바뀌어, 한 번에 두 번 들어온 클릭(더블클릭, 키 반복)을 막지 못한다.
  const busy = useRef(false);

  async function save(draft: ArticleDraft) {
    if (busy.current) return;

    const invalid = findDraftProblem(draft, target);
    if (invalid) {
      setProblem(invalid);
      return;
    }

    busy.current = true;
    setStatus("saving");
    setProblem(null);
    try {
      const image = draft.image ?? undefined;
      const article =
        target.kind === "create"
          ? await createArticle({
              title: draft.title.trim(),
              content: draft.content,
              image,
            })
          : await updateArticle(target.articleId, {
              content: draft.content,
              image,
              summary: draft.summary.trim() || undefined,
              minorEdit: draft.minorEdit,
            });

      setStatus("saved");
      // 편집 화면을 방문 기록에서 지운다. 남겨 두면 뒤로 가기가 Next의 뒤로/앞으로 캐시에서 저장 전
      // 본문이 든 편집 화면을 꺼내고, 그대로 다시 저장하면 방금 한 편집이 되돌아간다.
      // 문서 상세는 동적 화면이라 이동할 때마다 서버에서 새로 그리므로 저장한 내용이 보이고,
      // 같은 주소의 캐시도 이 내용으로 바뀌어 뒤로 가기로 돌아간 이전 문서 화면도 새 내용이다.
      router.replace(ROUTES.document(article.id));
      // `busy`는 풀지 않는다. 화면을 떠나는 중에 다시 저장하면 같은 문서를 두 번 만들게 된다.
    } catch (error) {
      busy.current = false;
      setStatus("idle");
      setProblem(describeSaveError(error, target));
    }
  }

  return { status, problem, save };
}

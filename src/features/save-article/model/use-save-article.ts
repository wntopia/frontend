import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ROUTES } from "@/shared/config";
import { createArticle, updateArticleImage } from "../api/save-article";
import {
  findDraftProblem,
  type ArticleDraft,
  type RevisionSaver,
  type SaveTarget,
} from "./draft";
import {
  describeRevisionSaveFailure,
  describeSaveError,
  type SaveProblem,
} from "./save-problem";

/**
 * - `idle`: 저장할 수 있다
 * - `saving`: 요청을 보냈고 응답을 기다린다
 * - `saved`: 새 문서를 만들었고 문서로 넘어가는 중이다. 화면이 바뀔 때까지 다시 저장하지 못한다
 */
export type SaveStatus = "idle" | "saving" | "saved";

/** 저장 한 번의 결과. 화면이 저장한 입력(편집 요약, 고른 이미지)을 비울지 정하는 데 쓴다 */
export type SaveOutcome = {
  /** 본문까지 저장했다 */
  saved: boolean;
  /** 고른 대표 이미지를 올려 문서에 걸었다. 본문 저장에 실패해도 참일 수 있다 */
  imageSaved: boolean;
};

const NOT_SAVED: SaveOutcome = { saved: false, imageSaved: false };

/**
 * 편집 화면의 '저장' 동작. 실패하면 `problem`에 안내를 남기고 입력은 건드리지 않는다 — 고쳐서 다시 저장할 수 있어야 한다.
 *
 * - 새 문서: 생성(POST)을 보내고 성공하면 그 문서로 넘어간다.
 * - 기존 문서: 고른 대표 이미지가 있으면 먼저 PATCH로 올리고, 본문은 `saveRevision`(공동편집의 `save`)으로 저장한다.
 *   저장한 뒤에도 편집 화면에 남는다. 같은 문서를 함께 고치는 사람들이 있고, 저장 완료는 모두의 상단 바에 보인다.
 */
export function useSaveArticle(
  target: SaveTarget,
  saveRevision?: RevisionSaver,
) {
  const router = useRouter();
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [problem, setProblem] = useState<SaveProblem | null>(null);
  // `status`는 다음 렌더링에야 바뀌어, 한 번에 두 번 들어온 클릭(더블클릭, 키 반복)을 막지 못한다.
  const busy = useRef(false);

  async function save(draft: ArticleDraft): Promise<SaveOutcome> {
    if (busy.current) return NOT_SAVED;

    const invalid = findDraftProblem(draft, target);
    if (invalid) {
      setProblem(invalid);
      return NOT_SAVED;
    }

    busy.current = true;
    setStatus("saving");
    setProblem(null);

    if (target.kind === "create") {
      try {
        const article = await createArticle({
          title: draft.title.trim(),
          content: draft.content,
          image: draft.image ?? undefined,
        });
        setStatus("saved");
        // 편집 화면을 방문 기록에서 지운다. 남겨 두면 뒤로 가기가 Next의 뒤로/앞으로 캐시에서 쓰던 내용이 든
        // 새 문서 화면을 꺼내고, 그대로 다시 저장하면 같은 제목으로 한 번 더 만들려다 409가 된다.
        router.replace(ROUTES.document(article.id));
        // `busy`는 풀지 않는다. 화면을 떠나는 중에 다시 저장하면 같은 문서를 두 번 만들게 된다.
        return { saved: true, imageSaved: draft.image !== null };
      } catch (error) {
        busy.current = false;
        setStatus("idle");
        setProblem(describeSaveError(error, target));
        return NOT_SAVED;
      }
    }

    if (!saveRevision) {
      throw new Error("기존 문서의 본문은 saveRevision으로 저장한다.");
    }

    // 이미지를 먼저 올린다. 이미지가 실패하면 아무것도 저장되지 않은 채 끝나 그대로 다시 저장하면 된다.
    // 본문 저장이 실패하는 쪽은 연결이 끊긴 경우뿐이라 드물다(연결되어 있지 않으면 저장 버튼이 막힌다).
    let imageSaved = false;
    if (draft.image) {
      try {
        await updateArticleImage(target.articleId, { image: draft.image });
        imageSaved = true;
      } catch (error) {
        busy.current = false;
        setStatus("idle");
        setProblem(describeSaveError(error, target));
        return NOT_SAVED;
      }
    }

    const result = await saveRevision({
      content: draft.content,
      summary: draft.summary.trim() || undefined,
      minorEdit: draft.minorEdit,
    });
    busy.current = false;
    setStatus("idle");
    if (!result.ok) {
      setProblem(describeRevisionSaveFailure(result, imageSaved));
      return { saved: false, imageSaved };
    }
    return { saved: true, imageSaved };
  }

  return { status, problem, save };
}

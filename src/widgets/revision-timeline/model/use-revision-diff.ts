import { startTransition, useState } from "react";
import { loadArticleRevision } from "@/entities/document";
import { diffLines } from "@/shared/lib";
import { toDiffView, type RevisionDiffView } from "./diff-rows";
import type { RevisionCompare } from "./types";

export type RevisionDiffState =
  | { status: "idle" | "loading" | "error" }
  | ({ status: "ready" } & RevisionDiffView);

/**
 * 리비전 카드의 '차이 보기' 상태.
 *
 * 처음 펼칠 때 `load`로 직전 리비전과 이 리비전의 본문을 받아 브라우저에서 비교한다 — 목록 응답에는 본문이 없고
 * 두 리비전의 차이를 주는 API도 없다. 목록을 열 때 모든 카드의 본문을 받지 않도록 펼칠 때까지 미룬다.
 * 결과는 카드가 화면에 있는 동안 들고 있어, 접었다 다시 펼쳐도 다시 요청하거나 계산하지 않는다.
 */
export function useRevisionDiff(compare: RevisionCompare | undefined) {
  const [state, setState] = useState<RevisionDiffState>({ status: "idle" });

  const load = () => {
    if (!compare) return;
    setState({ status: "loading" });

    Promise.all([
      loadArticleRevision(compare.articleId, compare.from),
      loadArticleRevision(compare.articleId, compare.to),
    ])
      .then(([before, after]) => {
        const view = toDiffView(diffLines(before.content, after.content));
        // 바뀐 줄이 많으면 그리는 데도 시간이 든다. 급하지 않은 갱신으로 넘겨 React가 나눠 그리게 한다.
        startTransition(() => setState({ status: "ready", ...view }));
      })
      .catch(() => setState({ status: "error" }));
  };

  return { state, load };
}

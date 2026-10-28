import { useEffect, useState } from "react";
import { fetchArticleEditors } from "@/entities/document";
import type { ArticleEditorsResDto } from "@/shared/api";

/** 백엔드 권장(10~30초)의 가운데. 편집을 시작하거나 끝낸 것이 이만큼 늦게 보여도 읽는 사람에게는 충분하다 */
const POLL_INTERVAL_MS = 20_000;

/**
 * 지금 이 문서를 편집 중인 사람들을 주기적으로 읽는다. 읽지 못했거나 아직 모르면 `null`이다.
 *
 * 백엔드는 읽기 화면을 위한 구독을 주지 않아(공동편집 방에 들어가면 편집자로 세어진다) 폴링한다. 탭이 보이는 동안만
 * 읽는다 — 문서 화면은 가장 많이 열려 있는 화면이라, 뒤에 깔린 탭까지 계속 부르면 요청이 탭 수만큼 쌓인다. 다시 보이면
 * 기다리지 않고 바로 읽어 오래된 표시를 곧장 바꾼다.
 */
export function useArticleEditors(
  articleId: number,
): ArticleEditorsResDto | null {
  const [editors, setEditors] = useState<ArticleEditorsResDto | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;

    const stopTimer = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const poll = async () => {
      stopTimer();
      controller?.abort();
      const current = new AbortController();
      controller = current;
      try {
        const result = await fetchArticleEditors(articleId, current.signal);
        if (!current.signal.aborted) setEditors(result);
      } catch {
        // 편집 중 표시는 없어도 문서를 읽는 데 지장이 없어 실패를 알리지 않고 숨긴다.
        if (!current.signal.aborted) setEditors(null);
      }
      // 그사이 탭이 가려졌거나 다른 계기로 새로 읽기 시작했으면 다음 차례는 그쪽이 정한다.
      if (controller === current && document.visibilityState === "visible") {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void poll();
      } else {
        stopTimer();
        controller?.abort();
        controller = null;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (document.visibilityState === "visible") void poll();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopTimer();
      controller?.abort();
      // 비우지 않으면 진행 중이던 `poll`이 중단된 뒤에도 '아직 내 차례'로 보고 다음 타이머를 건다. 그 타이머는 끌 방법이
      // 없어 화면을 떠난 문서마다 폴링이 계속 돈다.
      controller = null;
    };
  }, [articleId]);

  return editors;
}

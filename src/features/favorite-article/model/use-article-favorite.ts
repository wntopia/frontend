"use client";

import { useRef, useState } from "react";
import { clearSession } from "@/entities/session";
import { isApiError } from "@/shared/api";
import {
  addFavorite,
  fetchFavoriteStatus,
  removeFavorite,
} from "../api/favorite";

/**
 * 화면이 그릴 즐겨찾기 상태.
 * `unknown`은 아직 읽지 않았거나 읽지 못한 상태다. 추가(PUT)는 멱등이라 이때 '추가'를 눌러도 해가 없다.
 */
export type FavoriteState =
  | { status: "unknown" }
  | { status: "loading" }
  | { status: "ready"; favorited: boolean };

/** 즐겨찾기를 바꾼 결과. 사용자에게 무엇을 알릴지는 화면이 정한다. */
export type FavoriteToggleResult =
  | { ok: true; favorited: boolean }
  | { ok: false; reason: "signed-out" | "not-found" | "failed" };

const UNKNOWN: FavoriteState = { status: "unknown" };

/**
 * 로그인한 사용자의 문서 즐겨찾기 상태를 읽고 바꾼다. 비로그인으로 확인된 사용자에게는 쓰지 않는다
 * (읽으면 `false`가 오고, 바꾸려 하면 401이다).
 *
 * 상태는 렌더링 때가 아니라 `load()`를 부를 때 브라우저에서 읽는다. 서버에서 읽으면 쿠키 때문에 문서 화면 전체가
 * 동적 렌더링이 되고(헤더의 `useSession()`과 같은 이유), 화면을 열 때마다 읽으면 가장 많이 열리는 화면에
 * 메뉴를 열지 않는 사람 몫의 요청까지 붙는다. 언제 읽을지는 이 상태를 보여 줄 화면이 정한다.
 */
export function useArticleFavorite(articleId: number) {
  const [state, setState] = useState<FavoriteState>(UNKNOWN);
  const [pending, setPending] = useState(false);
  // 상태는 다음 렌더에야 바뀌므로, 같은 순간에 겹친 호출(연타, 포커스와 클릭)은 ref로 막는다.
  const loading = useRef(false);
  const busy = useRef(false);

  /** 아직 모르는 상태일 때만 읽는다. 여러 번 불러도 요청은 한 번이다. */
  function load() {
    if (state.status !== "unknown" || loading.current || busy.current) return;
    loading.current = true;
    setState({ status: "loading" });
    fetchFavoriteStatus(articleId)
      .then(
        (favorited) => setState({ status: "ready", favorited }),
        // 읽지 못하면 모르는 상태로 돌려 다음에 다시 읽게 한다.
        () => setState(UNKNOWN),
      )
      .finally(() => {
        loading.current = false;
      });
  }

  /** 추가와 해제를 오간다. 진행 중이거나 상태를 읽는 중이면 아무것도 하지 않고 `null`을 준다. */
  async function toggle(): Promise<FavoriteToggleResult | null> {
    if (busy.current || loading.current) return null;
    busy.current = true;

    const previous = state;
    const next = !(state.status === "ready" && state.favorited);
    // 요청이 끝나기 전에 메뉴를 다시 열어도 바뀔 상태가 보이게 먼저 반영하고, 실패하면 되돌린다.
    setState({ status: "ready", favorited: next });
    setPending(true);

    try {
      await (next ? addFavorite(articleId) : removeFavorite(articleId));
      return { ok: true, favorited: next };
    } catch (error) {
      setState(previous);
      if (isApiError(error, 401)) {
        // 즐겨찾기는 학생 계정이 아니어도 쓸 수 있어 401은 세션이 만료됐다는 뜻이다.
        // 헤더와 메뉴가 곧바로 로그인 버튼을 보이도록 비로그인으로 돌린다.
        clearSession();
        return { ok: false, reason: "signed-out" };
      }
      if (isApiError(error, 404)) return { ok: false, reason: "not-found" };
      return { ok: false, reason: "failed" };
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return { state, pending, load, toggle };
}

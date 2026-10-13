"use client";

import { useSyncExternalStore } from "react";
import { fetchSession } from "../api/fetch-session";
import type { SessionState } from "./types";

const LOADING: SessionState = { status: "loading" };
const UNAUTHENTICATED: SessionState = { status: "unauthenticated" };

/**
 * 세션은 페이지를 불러올 때 한 번만 조회하고 헤더 등 여러 컴포넌트가 나눠 쓴다.
 * Provider 대신 모듈 스토어로 둔 것은, 루트 레이아웃에서 조회하면 모든 화면이 동적 렌더링이 되기 때문이다.
 * 서버 렌더링 중에는 구독이 일어나지 않아 이 값이 바뀌지 않으므로 요청 간에 사용자 정보가 섞이지 않는다.
 */
let state: SessionState = LOADING;
let requested = false;
const listeners = new Set<() => void>();

function setState(next: SessionState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!requested) {
    requested = true;
    fetchSession().then(
      (user) =>
        setState(user ? { status: "authenticated", user } : UNAUTHENTICATED),
      // 조회 자체가 실패하면(서버 장애 등) 로그인 버튼을 보여 다시 시도할 길을 남긴다.
      () => setState(UNAUTHENTICATED),
    );
  }
  return () => {
    listeners.delete(onChange);
  };
}

/** 현재 세션 상태. 새로고침하면 다시 조회하므로 로그인이 유지된다. */
export function useSession(): SessionState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => LOADING,
  );
}

/** 로그아웃 직후 화면에 바로 반영한다. */
export function clearSession() {
  setState(UNAUTHENTICATED);
}

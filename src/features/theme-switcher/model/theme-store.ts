"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_MODE, THEME_STORAGE_KEY, type ThemeMode } from "@/shared/config";

const CHANGE_EVENT = "jw-theme-change";

function getSnapshot(): ThemeMode {
  return document.documentElement.getAttribute("data-mode") === "light"
    ? "light"
    : "dark";
}

function apply(mode: ThemeMode) {
  document.documentElement.setAttribute("data-mode", mode);
}

function subscribe(onChange: () => void) {
  // 다른 탭에서 바꾼 값도 이 탭의 <html>에 반영한다.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    apply(e.newValue === "light" ? "light" : "dark");
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** 현재 모드를 읽고 바꾼다. 변경은 즉시 `<html>`에 반영되고 저장된다. */
export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_MODE);

  const setMode = useCallback((next: ThemeMode) => {
    apply(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장이 막혀 있어도 현재 화면에는 적용한다.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { mode, setMode };
}

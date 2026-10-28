"use client";

import { MoonIcon, SunIcon } from "@/shared/icons";
import { useThemeMode } from "../model/theme-store";

/** 화면 우하단에 떠 있는 라이트/다크 전환 버튼 */
export function ThemeSwitcher() {
  const { mode, setMode } = useThemeMode();
  const next = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={next === "light" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={next === "light" ? "라이트 모드" : "다크 모드"}
      className="fixed bottom-5 right-5 z-[100] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-surface-2 text-fg-soft elevate-2 transition hover:-translate-y-0.5 hover:text-fg"
    >
      {mode === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

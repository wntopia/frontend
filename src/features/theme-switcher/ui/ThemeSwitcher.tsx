"use client";

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

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

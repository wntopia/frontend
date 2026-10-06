/**
 * 라이트/다크 모드 설정.
 * 실제 색 값은 `app/globals.css`의 `@theme`(다크)와 `[data-mode="light"]` 블록에 있다.
 */
export type ThemeMode = "light" | "dark";

export const DEFAULT_MODE: ThemeMode = "dark";

export const THEME_STORAGE_KEY = "jw-mode";

/**
 * 첫 페인트 전에 저장된 모드를 `<html>`에 적용하는 인라인 스크립트.
 * (node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md)
 */
export const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("${THEME_STORAGE_KEY}");if(m==="light"||m==="dark")document.documentElement.setAttribute("data-mode",m)}catch(e){}})()`;

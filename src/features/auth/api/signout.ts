import { API_PATHS, apiFetch } from "@/shared/api";

/** 백엔드 세션을 무효화한다. */
export function signout(): Promise<void> {
  return apiFetch<void>(API_PATHS.signout, { method: "POST" });
}

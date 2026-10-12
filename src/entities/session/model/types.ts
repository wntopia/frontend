import type { DataGsmUserInfoResDto } from "@/shared/api";

/** 로그인한 사용자. 백엔드 세션에 담긴 DataGSM 계정 정보 그대로다. */
export type SessionUser = DataGsmUserInfoResDto;

/**
 * 브라우저가 아는 세션 상태.
 * `loading`은 아직 `/auth/me` 응답을 받지 못한 상태 — 이때 로그인 버튼을 그리면
 * 로그인한 사용자에게 버튼이 잠깐 보였다 사라지므로 비로그인과 구분한다.
 */
export type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated" };

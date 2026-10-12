/**
 * 백엔드 오리진. Next 서버에서만 읽힌다 — rewrites 목적지(next.config.ts)와
 * 서버 컴포넌트의 직접 호출이 같은 값을 쓰도록 여기 한 곳에 둔다.
 */
export const API_BASE_URL = (
  process.env.API_BASE_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

/** 백엔드로 넘길 경로의 공통 접두사. 이 아래는 Next 라우트로 쓰지 않는다. */
export const API_PREFIX = "/api/v1";

/**
 * 백엔드 오리진. Next 서버에서만 읽힌다 — rewrites 목적지(next.config.ts)와
 * 서버 컴포넌트의 직접 호출이 같은 값을 쓰도록 여기 한 곳에 둔다.
 */
export const API_BASE_URL = (
  process.env.API_BASE_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

/** 백엔드로 넘길 경로의 공통 접두사. 이 아래는 Next 라우트로 쓰지 않는다. */
export const API_PREFIX = "/api/v1";

/**
 * 백엔드 WebSocket 경로의 공통 접두사. `API_PREFIX`처럼 프록시(next.config.ts)가 백엔드로 넘긴다.
 * 브라우저가 핸드셰이크에 세션 쿠키를 실으려면 프론트와 같은 오리진이어야 해서, 백엔드에 직접 붙지 않는다.
 */
export const WS_PREFIX = "/ws";

/**
 * DataGSM이 로그인 후 브라우저를 돌려보내는 프론트 경로. 화면이 아니라, 받은 `code`·`state`를
 * 백엔드 callback으로 넘기는 프록시 경로다 (next.config.ts).
 * 백엔드의 `DATAGSM_OAUTH_REDIRECT_URI`가 `<프론트 오리진>` + 이 경로여야 한다.
 */
export const OAUTH_REDIRECT_PATH = "/callback";

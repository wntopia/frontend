/**
 * 같은 오리진의 경로(`API_PATHS`의 WebSocket 경로)를 브라우저가 열 수 있는 `ws:` / `wss:` 주소로 바꾼다.
 *
 * `new WebSocket`은 `fetch`와 달리 상대 경로를 받지 않는다. 그렇다고 백엔드 주소를 직접 쓰면 쿠키가 프론트 도메인에
 * 있어 핸드셰이크에 실리지 않으므로, 지금 페이지의 오리진에 붙여 프록시(next.config.ts)를 타게 한다.
 * 브라우저에서만 부른다.
 */
export function toWebSocketUrl(path: string): string {
  const url = new URL(path, window.location.href);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

import { API_BASE_URL } from "./base-url";
import { request, type ApiRequestOptions } from "./request";

/**
 * 백엔드 API를 호출하고 봉투를 벗긴 `data`를 돌려준다. 실패하면 `ApiError`를 던진다.
 *
 * 브라우저에서는 같은 오리진의 프록시(next.config.ts rewrites)를 타므로 세션 쿠키가 따라간다.
 * 서버에서는 백엔드를 직접 부르고 **쿠키를 보내지 않는다** — 로그인 여부와 무관한 조회에만 쓰고,
 * 사용자 세션이 필요한 서버 호출은 `@/shared/api/server`의 `serverApiFetch`를 쓴다.
 * 정적인 화면에서 부르면 빌드 때 한 번 조회한 값으로 굳으므로, 요청마다 새로 읽어야 하는 공개 데이터는
 * 같은 곳의 `publicServerApiFetch`를 쓴다.
 */
export function apiFetch<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const baseUrl = typeof window === "undefined" ? API_BASE_URL : "";
  return request<T>(baseUrl, path, options);
}

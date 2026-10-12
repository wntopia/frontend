import "server-only";
import { cookies } from "next/headers";
import { API_BASE_URL } from "./base-url";
import { request, type ApiRequestOptions } from "./request";

/**
 * 서버 컴포넌트에서 **현재 요청의 사용자로서** 백엔드를 호출한다.
 * Next 서버가 보내는 fetch에는 브라우저 쿠키가 자동으로 붙지 않아, 들어온 요청의 쿠키를 옮겨 싣는다.
 *
 * `next/headers`는 클라이언트 번들에 들어갈 수 없어서 배럴(`@/shared/api`)에 싣지 않고
 * `@/shared/api/server`로 따로 import 한다. `cookies()`를 읽으므로 호출한 라우트는 동적 렌더링이 된다.
 */
export async function serverApiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const cookieHeader = (await cookies()).toString();
  if (cookieHeader) headers.set("Cookie", cookieHeader);

  return request<T>(API_BASE_URL, path, { ...options, headers });
}

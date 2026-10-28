import "server-only";
import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
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

/** 공개 조회를 기다리는 시간. 보통 1초 안에 오는 조회들이라, 이보다 늦으면 백엔드가 멈춘 것으로 본다. */
const PUBLIC_FETCH_TIMEOUT_MS = 5_000;

/**
 * 서버 컴포넌트에서 로그인과 무관한 공개 데이터를 **요청마다 새로** 조회한다. 쿠키는 싣지 않는다.
 *
 * `apiFetch`를 서버 컴포넌트에서 그대로 부르면 Next가 그 화면을 빌드 때 한 번 그려 두고 계속 내보내,
 * 최근 변경 같은 값이 배포 시점에 굳는다. 여기서는 `connection()`으로 빌드 때 그리지 않게 하고 요청 시점에
 * 부른다 — 빌드가 백엔드에 닿지 않으므로 백엔드 없이도 빌드된다. 호출한 라우트는 동적 렌더링이 된다.
 *
 * 빌드 중의 `connection()`은 렌더링을 멈추려고 던진다. 이 호출을 `try/catch`로 감쌀 때는
 * `nullOnFailure`처럼 `unstable_rethrow`로 그 신호를 되던져야 한다.
 *
 * 응답을 `PUBLIC_FETCH_TIMEOUT_MS`까지만 기다린다. 부르는 쪽은 Suspense 안에서 화면을 내려보내는 중이라,
 * 백엔드가 멈추면 그 덩어리가 자리표시로 남은 채 응답이 끝나지 않는다. 넘기면 실패로 던진다.
 */
export async function publicServerApiFetch<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  await connection();
  const timeout = AbortSignal.timeout(PUBLIC_FETCH_TIMEOUT_MS);
  return request<T>(API_BASE_URL, path, {
    ...options,
    signal: options?.signal
      ? AbortSignal.any([options.signal, timeout])
      : timeout,
  });
}

/**
 * 조회가 실패하면 던지지 않고 `null`을 돌려준다. 화면 전체가 아니라 한 덩어리(홈의 위젯)만 실패를 그리고
 * 나머지는 그대로 보여 줄 때 쓴다.
 *
 * 잡은 실패는 화면에 자세히 남지 않으니 서버 로그에 남긴다. `ApiError`에는 경로가 없어 무엇을 부르다
 * 실패했는지 `label`로 함께 적는다. `connection()` · `notFound()`처럼 Next가 던져서 흐름을 바꾸는 신호는
 * 실패가 아니므로 되던진다.
 */
export async function nullOnFailure<T>(
  promise: Promise<T>,
  label: string,
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    unstable_rethrow(error);
    console.error(`[${label}] 조회 실패`, error);
    return null;
  }
}

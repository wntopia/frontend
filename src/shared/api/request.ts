import { ApiError } from "./error";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** 객체는 JSON으로, FormData는 `multipart/form-data`로 보낸다. */
  body?: FormData | object;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

/**
 * the-sdk가 모든 응답을 감싸는 봉투. 실패 응답도 같은 모양이고 `data`만 빠진다.
 * (`/api/v1/oauth/datagsm/**`는 감싸지 않지만 페이지 이동으로만 쓰는 경로라 여기로 오지 않는다)
 */
type CommonApiResponse<T> = {
  status: string;
  code: number;
  message: string;
  data?: T;
};

/** 브라우저용·서버용 래퍼가 함께 쓰는 본체. 직접 쓰지 말고 `apiFetch` / `serverApiFetch`를 쓴다. */
export async function request<T>(
  baseUrl: string,
  path: string,
  { method = "GET", body, headers, signal }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    // Content-Type을 직접 넣으면 boundary가 빠져 서버가 파싱하지 못한다. fetch에 맡긴다.
    requestBody = body;
  } else if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    signal,
  });

  return unwrap<T>(response);
}

async function unwrap<T>(response: Response): Promise<T> {
  // the-sdk는 본문이 없는 성공을 204로 돌려준다.
  if (response.status === 204) return undefined as T;

  const payload = (await response
    .json()
    .catch(() => null)) as CommonApiResponse<T> | null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message ?? response.statusText,
    );
  }
  if (payload === null) {
    // 백엔드가 아닌 무언가(잘못된 API_BASE_URL, 게이트웨이의 HTML 페이지)가 답한 경우다.
    throw new ApiError(response.status, "응답을 해석할 수 없습니다.");
  }

  return payload.data as T;
}

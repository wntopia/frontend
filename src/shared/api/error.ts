/**
 * 백엔드가 2xx가 아닌 응답을 돌려줬을 때 던지는 에러.
 * 화면이 401(비로그인) / 404(없는 문서) / 그 외를 갈라 처리할 수 있도록 HTTP 상태를 담는다.
 * 네트워크 단절처럼 응답 자체가 없는 실패는 fetch가 던진 에러가 그대로 올라온다.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** `status`를 주면 그 상태 코드의 ApiError인지까지 확인한다. */
export function isApiError(error: unknown, status?: number): error is ApiError {
  return (
    error instanceof ApiError && (status === undefined || error.status === status)
  );
}

import {
  API_PATHS,
  apiFetch,
  isApiError,
  type AuthStatusResDto,
} from "@/shared/api";
import type { SessionUser } from "../model/types";

/**
 * 현재 로그인한 사용자를 조회한다. 로그인하지 않았으면 `null`.
 *
 * 백엔드는 비로그인을 401로 알리는데, 이건 실패가 아니라 정상적인 상태라 에러로 올리지 않는다.
 * 그 외의 실패(서버 장애 등)는 '비로그인'과 구분되어야 하므로 그대로 던진다.
 *
 * 서버에서는 요청 쿠키를 실어 보내는 fetcher를 넘겨야 한다 (`../server.ts` 참고).
 */
export async function fetchSession(
  fetcher: typeof apiFetch = apiFetch,
): Promise<SessionUser | null> {
  try {
    const { authenticated, user } = await fetcher<AuthStatusResDto>(
      API_PATHS.authMe,
    );
    return authenticated ? user : null;
  } catch (error) {
    if (isApiError(error, 401)) return null;
    throw error;
  }
}

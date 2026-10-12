import { ROUTES } from "@/shared/config";

const STORAGE_KEY = "jw-return-to";

/** 로그인 화면에 복귀 주소를 실어 보내는 쿼리 이름 */
export const RETURN_TO_PARAM = "next";

/** 상대 경로를 해석하기 위한 가짜 오리진. 실제로 요청을 보내지 않는다. */
const PARSE_BASE = "http://return-to.invalid";

/**
 * 복귀 주소로 써도 되는 값이면 정리해서 돌려주고, 아니면 `null`.
 *
 * 쿼리와 저장소에서 오는 값은 누구나 조작할 수 있어, 로그인 직후 다른 사이트로
 * 보내는 데 악용되지 않도록 우리 사이트 안의 경로만 받는다. `//evil.com`이나
 * `/\evil.com`처럼 경로처럼 보이는 외부 주소는 브라우저와 같은 방식으로 해석해 봐야 걸러진다.
 */
export function sanitizeReturnTo(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("/")) return null;

  let url: URL;
  try {
    url = new URL(value, PARSE_BASE);
  } catch {
    return null;
  }
  if (url.origin !== PARSE_BASE) return null;

  // 로그인 화면으로 복귀하면 로그인하자마자 다시 로그인 화면을 보게 된다.
  if (
    url.pathname === ROUTES.signin ||
    url.pathname.startsWith(`${ROUTES.signin}/`)
  ) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

/** 로그인 후 `returnTo`로 돌아오는 로그인 화면 주소 */
export function signinHref(returnTo?: string | null): string {
  const safe = sanitizeReturnTo(returnTo);
  if (!safe) return ROUTES.signin;
  return `${ROUTES.signin}?${RETURN_TO_PARAM}=${encodeURIComponent(safe)}`;
}

/**
 * 백엔드의 로그인 엔드포인트는 복귀 주소를 받지 않고 항상 고정된 주소로 돌려보낸다.
 * 그래서 DataGSM을 다녀오는 동안 복귀 주소를 브라우저에 맡겨 둔다. 탭마다 따로 로그인할 수
 * 있도록 localStorage가 아닌 sessionStorage를 쓴다.
 */
export function rememberReturnTo(returnTo?: string | null) {
  const safe = sanitizeReturnTo(returnTo);
  try {
    // 값이 없을 때 지우지 않으면 예전에 중단된 로그인의 복귀 주소로 가게 된다.
    if (safe) sessionStorage.setItem(STORAGE_KEY, safe);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장이 막혀 있으면 로그인 후 홈으로 가게 될 뿐, 로그인 자체는 계속한다.
  }
}

/** 맡겨 둔 복귀 주소를 꺼내고 지운다. */
export function consumeReturnTo(): string | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return sanitizeReturnTo(value);
  } catch {
    return null;
  }
}

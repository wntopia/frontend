import "server-only";
import { cache } from "react";
import { serverApiFetch } from "@/shared/api/server";
import { fetchSession } from "./api/fetch-session";

/**
 * 서버 컴포넌트에서 현재 요청의 세션을 조회한다. 로그인하지 않았으면 `null`.
 * 한 번의 렌더링 안에서는 여러 곳에서 불러도 백엔드를 한 번만 호출한다.
 *
 * `next/headers`에 의존해 클라이언트 번들에 들어갈 수 없으므로 배럴이 아니라
 * `@/entities/session/server`로 import 한다.
 */
export const getServerSession = cache(() => fetchSession(serverApiFetch));

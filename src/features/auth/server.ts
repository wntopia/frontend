import "server-only";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/entities/session";
import { getServerSession } from "@/entities/session/server";
import { signinHref } from "./model/return-to";

/**
 * 로그인이 필요한 화면의 서버 컴포넌트 맨 앞에서 부른다.
 * 로그인하지 않았으면 로그인 화면으로 보내고, 로그인 후에는 `returnTo`로 돌아온다.
 *
 * 화면이 그려지기 전에 서버에서 막으므로 비로그인 사용자에게 화면이 잠깐 보이는 일이 없다.
 * 레이아웃은 화면 간 이동 때 다시 실행되지 않아 검사가 빠지므로, 레이아웃이 아닌 화면에서 부른다.
 */
export async function requireSession(returnTo: string): Promise<SessionUser> {
  const user = await getServerSession();
  if (!user) redirect(signinHref(returnTo));
  return user;
}

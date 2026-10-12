"use client";

import type { ReactNode } from "react";
import { API_PATHS } from "@/shared/api";
import { rememberReturnTo } from "../model/return-to";

type SigninButtonProps = {
  /** 로그인 후 돌아갈 경로. 없으면 홈으로 간다. */
  returnTo?: string | null;
  className?: string;
  children: ReactNode;
};

/**
 * DataGSM 로그인을 시작한다.
 *
 * `fetch`나 `<Link>`가 아니라 일반 `<a>`인 것은, 백엔드가 302로 DataGSM 인가 페이지를
 * 가리키기 때문에 브라우저가 페이지째로 따라가야 하기 때문이다.
 */
export function SigninButton({
  returnTo,
  className,
  children,
}: SigninButtonProps) {
  return (
    <a
      href={API_PATHS.oauthSignin}
      onClick={() => rememberReturnTo(returnTo)}
      className={className}
    >
      {children}
    </a>
  );
}

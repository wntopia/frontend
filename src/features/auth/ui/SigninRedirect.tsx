"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/shared/config";
import { consumeReturnTo } from "../model/return-to";

/**
 * 로그인 성공 후 착지 지점에서, 로그인 전에 보던 화면으로 돌려보낸다.
 * 복귀 주소가 sessionStorage에 있어 서버에서는 알 수 없으므로 브라우저에서 이동한다.
 */
export function SigninRedirect() {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    // 개발 모드(Strict Mode)는 이펙트를 두 번 실행한다. 복귀 주소는 꺼내면 지워지므로
    // 두 번째 실행이 빈 값을 읽고 홈으로 덮어쓰지 않게 막는다.
    if (redirected.current) return;
    redirected.current = true;

    router.replace(consumeReturnTo() ?? ROUTES.home);
  }, [router]);

  return (
    <p role="status" className="text-[13.5px] text-fg-subtle">
      로그인하는 중…
    </p>
  );
}

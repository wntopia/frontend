"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearSession } from "@/entities/session";
import { isApiError } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { signout } from "../api/signout";

/** 로그아웃하고 홈으로 보낸다. */
export function SignoutButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle");

  async function handleClick() {
    setStatus("pending");
    try {
      await signout();
    } catch (error) {
      // 401은 세션이 이미 끝났다는 뜻이라 로그아웃된 것으로 본다.
      if (!isApiError(error, 401)) {
        setStatus("failed");
        return;
      }
    }

    clearSession();
    router.replace(ROUTES.home);
    // 로그인 상태로 받아 둔 화면(마이페이지 등)이 라우터 캐시에서 다시 나오지 않게 한다.
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "pending"}
      className="cursor-pointer rounded-[9px] bg-surface-2 px-[15px] py-[9px] text-[13px] font-semibold text-fg-muted elevate-control transition hover:elevate-1 disabled:cursor-default disabled:opacity-60"
    >
      {status === "failed" ? "로그아웃 실패 · 다시 시도" : "로그아웃"}
    </button>
  );
}

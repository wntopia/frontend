"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDisplayName, getInitial, useSession } from "@/entities/session";
import { ROUTES } from "@/shared/config";
import { signinHref } from "../model/return-to";

/** 헤더 오른쪽 끝의 계정 자리. 비로그인이면 로그인 버튼, 로그인했으면 이름 첫 글자 아바타. */
export function AccountButton() {
  const session = useSession();
  const pathname = usePathname();

  if (session.status === "loading") {
    // 세션을 확인하는 동안 아바타 크기의 빈 원으로 자리를 잡아 헤더가 밀리지 않게 한다.
    return (
      <span
        aria-hidden
        className="h-[34px] w-[34px] flex-shrink-0 rounded-full bg-elevated elevate-control"
      />
    );
  }

  if (session.status === "unauthenticated") {
    return (
      <Link
        href={signinHref(pathname)}
        className="flex-shrink-0 rounded-[9px] bg-surface-2 px-[15px] py-2 text-[13.5px] font-semibold text-fg elevate-control transition hover:elevate-1 hover:text-fg"
      >
        로그인
      </Link>
    );
  }

  const name = getDisplayName(session.user);

  return (
    <Link
      href={ROUTES.mypage}
      aria-label={`${name} 마이페이지`}
      title={name}
      className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-elevated elevate-control text-[12.5px] font-bold text-fg-muted hover:text-fg-muted"
    >
      {getInitial(session.user)}
    </Link>
  );
}

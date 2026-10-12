import type { SessionUser } from "./types";

/**
 * 화면에 보일 이름.
 * 학생 정보가 없는 계정(교사 등)은 이름이 내려오지 않아 이메일 아이디로 대신한다.
 */
export function getDisplayName(user: SessionUser): string {
  return (
    user.student?.name?.trim() || user.email?.split("@")[0]?.trim() || "사용자"
  );
}

/** 아바타에 넣을 한 글자 */
export function getInitial(user: SessionUser): string {
  // 서로게이트 쌍(이모지 등)이 반으로 잘리지 않도록 코드 포인트 단위로 자른다.
  return Array.from(getDisplayName(user))[0].toUpperCase();
}

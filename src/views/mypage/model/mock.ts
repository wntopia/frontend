import type { Contribution, FavoriteDocument, MyStats } from "./types";

/*
 * 통계 · 최근 기여 · 즐겨찾는 문서를 받아 올 백엔드 API가 아직 없다 (#25).
 * 시안 값을 넣어 두면 남의 기록이 로그인한 사용자의 것처럼 보이므로 비워 두고, 화면은 빈 상태를 그린다.
 * API가 생기면 이 파일을 호출 결과로 갈아끼운다.
 */
export const myStats: MyStats | null = null;
export const myContributions: Contribution[] = [];
export const myFavorites: FavoriteDocument[] = [];

import type { RecentChange } from "@/entities/document";
import { ROUTES } from "@/shared/config";

/** 백엔드 연동 전까지 사용하는 디자인 시안 데이터 */
export const RECENT_CHANGES: RecentChange[] = [
  {
    id: "geumseong-high",
    title: "금성고등학교",
    href: ROUTES.document,
    activity: "active",
    summary: [
      { text: "이서연", emphasis: "strong" },
      { text: " 외 3명이 오늘 " },
      { text: "5회", emphasis: "count" },
      { text: " 수정" },
    ],
    time: "방금",
  },
  {
    id: "sports-day-2026",
    title: "2026 체육대회",
    href: "#",
    activity: "idle",
    summary: [
      { text: "박민준", emphasis: "strong" },
      { text: "이 '경기 종목' 문단 추가" },
    ],
    time: "32분 전",
  },
  {
    id: "broadcasting-club",
    title: "방송부",
    href: "#",
    activity: "idle",
    summary: [
      { text: "정하윤", emphasis: "strong" },
      { text: " 외 1명이 오늘 " },
      { text: "3회", emphasis: "count" },
      { text: " 수정" },
    ],
    time: "1시간 전",
  },
  {
    id: "lunch-menu",
    title: "급식 메뉴",
    href: "#",
    activity: "created",
    summary: [
      { text: "관리자봇", emphasis: "strong" },
      { text: "이 문서 생성" },
    ],
    time: "3시간 전",
  },
  {
    id: "band-soriullim",
    title: "밴드부 소리울림",
    href: "#",
    activity: "idle",
    summary: [{ text: "김도윤", emphasis: "strong" }, { text: "이 오타 수정" }],
    time: "어제",
  },
];

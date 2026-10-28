import type { RecentChangeResDto } from "@/shared/api";
import { formatRelativeTime, subjectParticle } from "@/shared/lib";
import type {
  ChangeSummarySegment,
  DocumentActivity,
  RecentChange,
} from "./types";

/**
 * 최근 변경 응답을 목록의 한 줄로 바꾼다.
 *
 * 상대 시간은 지금 시각에 달려 있어 서버에서 계산해 문자열로 내려보낸다. 한 목록의 줄들이 같은 '지금'을
 * 기준으로 하도록 `now`는 부르는 쪽에서 한 번만 잡아 넘긴다.
 */
export function toRecentChange(
  change: RecentChangeResDto,
  now: Date,
): RecentChange {
  return {
    articleId: change.articleId,
    title: change.title,
    activity: activityOf(change),
    summary: summarize(change),
    time: formatRelativeTime(change.updatedAt, now),
  };
}

function activityOf({
  newlyCreated,
  todayEditCount,
}: RecentChangeResDto): DocumentActivity {
  if (newlyCreated) return "created";
  return todayEditCount > 0 ? "active" : "idle";
}

/**
 * "이서연 외 3명이 오늘 5회 수정" · "박민준이 수정" · "김도윤이 문서 생성".
 *
 * 횟수는 오늘 두 번 이상 고친 문서에만 적는다 — 한 번이면 옆의 시각으로 충분하다.
 * 백엔드는 줄마다 편집 요약을 주지 않아 무엇을 고쳤는지는 적지 않는다.
 * 비로그인으로 만든 문서처럼 이름을 모르면 이름 없이 한 일만 적는다.
 */
function summarize({
  lastEditorName,
  newlyCreated,
  todayEditCount,
  todayEditorCount,
}: RecentChangeResDto): ChangeSummarySegment[] {
  const name = lastEditorName?.trim() || null;

  if (newlyCreated) {
    return name
      ? [strong(name), { text: `${subjectParticle(name)} 문서 생성` }]
      : [{ text: "문서 생성" }];
  }

  if (todayEditCount < 2) {
    return name
      ? [strong(name), { text: `${subjectParticle(name)} 수정` }]
      : [{ text: "문서 수정" }];
  }

  const count: ChangeSummarySegment = {
    text: `${todayEditCount.toLocaleString("ko-KR")}회`,
    emphasis: "count",
  };
  if (!name) return [{ text: "오늘 " }, count, { text: " 수정" }];

  // 마지막 기여자도 오늘 고친 사람 수에 들어 있어 그 사람을 뺀 나머지가 '외 N명'이다.
  const others = todayEditorCount - 1;
  return [
    strong(name),
    {
      text:
        others > 0
          ? ` 외 ${others.toLocaleString("ko-KR")}명이 오늘 `
          : `${subjectParticle(name)} 오늘 `,
    },
    count,
    { text: " 수정" },
  ];
}

function strong(text: string): ChangeSummarySegment {
  return { text, emphasis: "strong" };
}

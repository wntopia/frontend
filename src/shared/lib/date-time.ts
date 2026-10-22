/**
 * 백엔드 시각(UTC ISO 문자열)을 화면에 표시하는 포맷.
 *
 * 서버는 UTC로 돌 수 있고 브라우저는 사용자의 시간대로 돈다. 같은 시각이 어디서 그려도 같은 글자가 되도록
 * 로케일과 시간대를 한국으로 고정한다 — 고정하지 않으면 하이드레이션 불일치가 난다.
 */
const PARTS = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  // 일부 런타임은 hour12: false에서 자정을 "24"로 찍는다.
  hourCycle: "h23",
});

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type DateInput = string | Date;

function partsOf(input: DateInput) {
  const parts: Record<string, string> = {};
  for (const { type, value } of PARTS.formatToParts(new Date(input))) {
    parts[type] = value;
  }
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  };
}

/** `2026.06.20` */
export function formatDate(input: DateInput): string {
  const { year, month, day } = partsOf(input);
  return `${year}.${month}.${day}`;
}

/** `14:32` */
export function formatTime(input: DateInput): string {
  const { hour, minute } = partsOf(input);
  return `${hour}:${minute}`;
}

/** `2026-07-06 14:32` */
export function formatDateTime(input: DateInput): string {
  const { year, month, day, hour, minute } = partsOf(input);
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/** 한국 날짜로 며칠 차이인지. 24시간이 아니라 달력 기준이라 어젯밤 11시는 1시간 전이어도 '어제'다. */
function calendarDaysBetween(from: DateInput, to: DateInput): number {
  const a = partsOf(from);
  const b = partsOf(to);
  const dayOf = (p: typeof a) =>
    Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day));
  return Math.round((dayOf(b) - dayOf(a)) / DAY);
}

/**
 * `방금` · `N분 전` · `N시간 전` · `어제` · `N일 전` · `2026.06.20`
 *
 * 지금 시각에 따라 글자가 달라지므로 서버 컴포넌트에서 계산해 문자열로 내려보낸다.
 * 클라이언트 컴포넌트에서 부르면 서버와 브라우저의 '지금'이 달라 하이드레이션 불일치가 날 수 있다.
 */
export function formatRelativeTime(
  input: DateInput,
  now: DateInput = new Date(),
): string {
  const elapsed = new Date(now).getTime() - new Date(input).getTime();
  // 서버 간 시계 차이로 미래 시각이 올 수 있다.
  if (elapsed < MINUTE) return "방금";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`;

  const days = calendarDaysBetween(input, now);
  if (days <= 0) return `${Math.floor(elapsed / HOUR)}시간 전`;
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  return formatDate(input);
}

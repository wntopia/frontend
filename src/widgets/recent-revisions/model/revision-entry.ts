import { getEditorName } from "@/entities/document";
import type { ArticleRevisionSummaryResDto } from "@/shared/api";
import { formatDate, formatRelativeTime, subjectParticle } from "@/shared/lib";

/** 글자 수 변화의 색 — added(늘어남)·removed(줄어듦)·neutral(그대로) */
export type DeltaTone = "added" | "removed" | "neutral";

/** 문서 사이드바 '편집 역사'의 한 줄 */
export type RevisionEntry = {
  revision: number;
  editorName: string;
  /** 마커에 넣을 한 글자 */
  initial: string;
  /** 이름 뒤에 이어지는 조사와 한 일 (예: "이 오탈자 수정") */
  action: string;
  /** 편집 시각을 모르면 null */
  time: string | null;
  delta: { text: string; tone: DeltaTone } | null;
  /** 오늘 한 편집. 시안처럼 마커를 초록으로 칠한다 */
  today: boolean;
};

/**
 * 리비전 응답을 사이드바 한 줄로 바꾼다.
 *
 * 상대 시간과 '오늘' 여부는 지금 시각에 달려 있어 서버에서 한 번 계산해 문자열로 내려보낸다.
 * `now`를 받는 것은 한 목록 안의 항목들이 같은 '지금'을 기준으로 계산되게 하기 위해서다.
 */
export function toRevisionEntry(
  revision: ArticleRevisionSummaryResDto,
  now: Date,
): RevisionEntry {
  const editorName = getEditorName(revision.editor);
  // 첫 리비전은 편집 요약이 있어도 '문서 생성'으로 보인다. 사이드바에서는 그쪽이 더 알려 줄 만한 사실이다.
  const what =
    revision.revision === 1
      ? "문서 생성"
      : revision.summary?.trim() || "수정";

  return {
    revision: revision.revision,
    editorName,
    // 서로게이트 쌍이 반으로 잘리지 않도록 코드 포인트 단위로 자른다.
    initial: (Array.from(editorName)[0] ?? "?").toUpperCase(),
    action: `${subjectParticle(editorName)} ${what}`,
    time: revision.editedAt
      ? formatRelativeTime(revision.editedAt, now)
      : null,
    delta: toDelta(revision.charDelta),
    today:
      revision.editedAt !== null &&
      formatDate(revision.editedAt) === formatDate(now),
  };
}

function toDelta(charDelta: number | null): RevisionEntry["delta"] {
  // 글자 수 변화가 기록되기 전에 만들어진 리비전이다.
  if (charDelta === null) return null;

  const amount = Math.abs(charDelta).toLocaleString("ko-KR");
  if (charDelta > 0) return { text: `+${amount}자`, tone: "added" };
  if (charDelta < 0) return { text: `-${amount}자`, tone: "removed" };
  return { text: "±0자", tone: "neutral" };
}

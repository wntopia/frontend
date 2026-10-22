import {
  CREATION_REVISION,
  describeCharDelta,
  getEditorName,
} from "@/entities/document";
import type { ArticleRevisionSummaryResDto, IsoDateTime } from "@/shared/api";
import {
  formatDate,
  formatRelativeTime,
  formatTime,
  subjectParticle,
} from "@/shared/lib";
import type { Revision } from "./types";

const HOUR = 60 * 60 * 1000;

type TimelineContext = {
  /** 문서 생성 시각. 리비전 1은 생성이 아니라 첫 수정 때 기록되므로 생성 항목의 시각은 이 값을 쓴다. */
  createdAt: IsoDateTime | null;
  /** 상대 시간과 '오늘' 판정의 기준. 한 화면 안에서 항목마다 기준이 달라지지 않게 한 번만 잡아 넘긴다. */
  now: Date;
};

/**
 * 리비전 목록 응답을 타임라인 항목으로 바꾼다.
 * 시각을 글자로 미리 만들어 두므로 서버에서 불러야 한다 — 브라우저에서 다시 계산하면 '지금'이 달라 하이드레이션이 어긋난다.
 *
 * `totalRevisions`가 0이면 한 번도 수정되지 않은 문서다. 백엔드는 첫 수정 때에야 생성 시점 내용을 리비전 1로
 * 기록하므로 목록이 비어 있지만, 생성은 있었으니 생성 항목 하나를 그린다.
 */
export function toTimelineRevisions(
  items: ArticleRevisionSummaryResDto[],
  totalRevisions: number,
  context: TimelineContext,
): Revision[] {
  if (totalRevisions === 0) {
    return [creationRevision(context.createdAt, null, context.now)];
  }
  return items.map((item) =>
    item.revision === CREATION_REVISION
      ? creationRevision(
          context.createdAt ?? item.editedAt,
          item.charDelta,
          context.now,
        )
      : editRevision(item, context.now),
  );
}

function editRevision(
  item: ArticleRevisionSummaryResDto,
  now: Date,
): Revision {
  const name = getEditorName(item.editor);
  return {
    id: `r${item.revision}`,
    kind: isToday(item.editedAt, now) ? "active" : "default",
    // 편집 요약은 시안의 "'연혁' 문단 추가"처럼 이름 뒤에 이어 붙는 문장이다. 없거나 비었으면 '수정'으로 맺는다.
    summary: [
      { text: name, emphasis: "strong" },
      { text: `${subjectParticle(name)} ${item.summary?.trim() || "수정"}` },
    ],
    time: timeLabel(item.editedAt, now),
    minor: item.minorEdit,
    delta: describeCharDelta(item.charDelta) ?? undefined,
  };
}

/**
 * 문서 생성 항목. 리비전 1의 편집자는 생성자가 아니라 처음 수정한 사람으로 기록되므로(백엔드가 첫 수정 때
 * 생성 시점 내용을 리비전 1로 남긴다) 이름을 붙이지 않는다. 생성자는 응답에 없다.
 */
function creationRevision(
  createdAt: IsoDateTime | null,
  charDelta: number | null,
  now: Date,
): Revision {
  return {
    id: `r${CREATION_REVISION}`,
    kind: isToday(createdAt, now) ? "active" : "default",
    summary: [{ text: "문서 생성" }],
    time: timeLabel(createdAt, now),
    delta: describeCharDelta(charDelta) ?? undefined,
  };
}

function isToday(at: IsoDateTime | null, now: Date): boolean {
  return at !== null && formatDate(at) === formatDate(now);
}

/**
 * 오늘 편집은 '3시간 전'처럼 상대 시간만으로 충분하다. 그보다 앞선 편집은 '어제 21:14'처럼 시각을 붙여
 * 같은 날의 여러 편집을 구분할 수 있게 한다.
 */
function timeLabel(at: IsoDateTime | null, now: Date): string {
  if (at === null) return "시각 미상";
  const relative = formatRelativeTime(at, now);
  const recent = now.getTime() - new Date(at).getTime() < HOUR;
  return recent || isToday(at, now)
    ? relative
    : `${relative} ${formatTime(at)}`;
}

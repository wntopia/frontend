import {
  CREATION_REVISION,
  describeCharDelta,
  getEditorName,
  type CharDeltaTone,
} from "@/entities/document";
import type { ArticleRevisionSummaryResDto, IsoDateTime } from "@/shared/api";
import { formatDate, formatRelativeTime, subjectParticle } from "@/shared/lib";

/** 문서 사이드바 '편집 역사'의 한 줄 */
export type RevisionEntry = {
  revision: number;
  /** 편집한 사람. 문서 생성 항목은 만든 사람이 응답에 없어 비운다 */
  editorName: string | null;
  /** 마커에 넣을 한 글자. 이름이 없으면 빈 마커다 */
  initial: string;
  /** 이름 뒤에 이어지는 조사와 한 일 (예: "이 오탈자 수정"). 이름이 없으면 한 일만 */
  action: string;
  /** 편집 시각을 모르면 null */
  time: string | null;
  delta: { text: string; tone: CharDeltaTone } | null;
  /** 오늘 한 편집. 시안처럼 마커를 초록으로 칠한다 */
  today: boolean;
};

type EntryContext = {
  /** 문서 생성 시각. 생성 항목(리비전 1)의 시각은 리비전이 아니라 이 값을 쓴다 */
  createdAt: IsoDateTime | null;
  /** 한 목록 안의 항목들이 같은 '지금'을 기준으로 계산되도록 한 번만 잡아 넘긴다 */
  now: Date;
};

/**
 * 리비전 응답을 사이드바 줄로 바꾼다.
 *
 * 상대 시간과 '오늘' 여부는 지금 시각에 달려 있어 서버에서 한 번 계산해 문자열로 내려보낸다.
 * `totalRevisions`가 0이면 한 번도 수정되지 않은 문서다 — 목록은 비어 있지만 생성은 있었으니 생성 줄 하나를 그린다.
 */
export function toRevisionEntries(
  revisions: ArticleRevisionSummaryResDto[],
  totalRevisions: number,
  context: EntryContext,
): RevisionEntry[] {
  if (totalRevisions === 0) {
    return [creationEntry(context.createdAt, null, context.now)];
  }
  return revisions.map((revision) =>
    revision.revision === CREATION_REVISION
      ? creationEntry(
          context.createdAt ?? revision.editedAt,
          revision.charDelta,
          context.now,
        )
      : editEntry(revision, context.now),
  );
}

function editEntry(
  revision: ArticleRevisionSummaryResDto,
  now: Date,
): RevisionEntry {
  const editorName = getEditorName(revision.editor);
  return {
    revision: revision.revision,
    editorName,
    // 서로게이트 쌍이 반으로 잘리지 않도록 코드 포인트 단위로 자른다.
    initial: (Array.from(editorName)[0] ?? "?").toUpperCase(),
    action: `${subjectParticle(editorName)} ${revision.summary?.trim() || "수정"}`,
    time: relativeTime(revision.editedAt, now),
    delta: describeCharDelta(revision.charDelta),
    today: isToday(revision.editedAt, now),
  };
}

/** 문서 생성 줄. 리비전 1의 편집자는 만든 사람이 아니라 처음 고친 사람이라 이름을 붙이지 않는다. */
function creationEntry(
  createdAt: IsoDateTime | null,
  charDelta: number | null,
  now: Date,
): RevisionEntry {
  return {
    revision: CREATION_REVISION,
    editorName: null,
    initial: "",
    action: "문서 생성",
    time: relativeTime(createdAt, now),
    delta: describeCharDelta(charDelta),
    today: isToday(createdAt, now),
  };
}

function relativeTime(at: IsoDateTime | null, now: Date): string | null {
  return at === null ? null : formatRelativeTime(at, now);
}

function isToday(at: IsoDateTime | null, now: Date): boolean {
  return at !== null && formatDate(at) === formatDate(now);
}

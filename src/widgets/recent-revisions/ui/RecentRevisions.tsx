import Link from "next/link";
import type { CharDeltaTone } from "@/entities/document";
import type { ArticleRevisionSummaryResDto, IsoDateTime } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { toRevisionEntries } from "../model/revision-entry";

const DELTA_TONE: Record<CharDeltaTone, string> = {
  added: "text-success",
  removed: "text-danger",
  neutral: "text-fg-subtle",
};

type RecentRevisionsProps = {
  articleId: number;
  /** 최신 순 리비전 몇 건. 나머지는 '전체'로 편집 역사 화면에서 본다 */
  revisions: ArticleRevisionSummaryResDto[];
  /** 리비전 목록의 `totalElements`. 0이면 한 번도 수정되지 않은 문서다 */
  totalRevisions: number;
  createdAt: IsoDateTime | null;
};

/** 문서 사이드바의 '편집 역사' — 최근 리비전 몇 건과 편집 역사 화면 링크 */
export function RecentRevisions({
  articleId,
  revisions,
  totalRevisions,
  createdAt,
}: RecentRevisionsProps) {
  const entries = toRevisionEntries(revisions, totalRevisions, {
    createdAt,
    now: new Date(),
  });

  return (
    <div className="rounded-[14px] bg-surface p-4 elevate-1">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[13px] font-bold text-fg">편집 역사</div>
        <Link
          href={ROUTES.documentHistory(articleId)}
          // 편집 역사 화면은 제목 · 생성 시각을 얻으려고 문서를 조회해, 미리 가져오면 조회수가 오른다
          prefetch={false}
          className="text-[11.5px] text-accent"
        >
          전체
        </Link>
      </div>

      <div className="relative pl-6">
        <div className="absolute bottom-1.5 left-2 top-1 w-[1.5px] bg-line" />
        {entries.map((entry, i) => (
          <div
            key={entry.revision}
            className={`relative ${i < entries.length - 1 ? "mb-4" : ""}`}
          >
            <span
              className={`absolute -left-6 top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[8.5px] font-bold ${
                entry.today
                  ? "border-[1.5px] border-success bg-success/15 text-success"
                  : "border-[1.5px] border-line-strong bg-surface-2 text-fg-soft"
              }`}
            >
              {entry.initial}
            </span>
            <div className="line-clamp-2 text-[12.5px] leading-[1.5] text-fg-muted [overflow-wrap:anywhere]">
              {entry.editorName && (
                <b className="text-fg">{entry.editorName}</b>
              )}
              {entry.action}
            </div>
            {(entry.time || entry.delta) && (
              <div className="mt-0.5 font-mono text-[10.5px] text-fg-subtle">
                {entry.time}
                {entry.time && entry.delta && " · "}
                {entry.delta && (
                  <span className={DELTA_TONE[entry.delta.tone]}>
                    {entry.delta.text}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

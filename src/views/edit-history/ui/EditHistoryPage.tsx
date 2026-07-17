import { HistoryTopBar } from "@/widgets/history-top-bar";
import { RevisionStats } from "@/widgets/revision-stats";
import { RevisionTimeline } from "@/widgets/revision-timeline";
import { HISTORY_DOCUMENT_TITLE } from "../model/mock";

/** 편집 역사 화면 — 문서의 리비전 통계와 타임라인 */
export function EditHistoryPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <HistoryTopBar documentTitle={HISTORY_DOCUMENT_TITLE} />

      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-9">
        <div className="mb-7">
          <RevisionStats />
        </div>
        <RevisionTimeline />
      </div>
    </div>
  );
}

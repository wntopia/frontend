import { Backlinks } from "@/widgets/backlinks";
import { Header } from "@/widgets/header";
import { MissingDocumentNotice } from "@/widgets/missing-document-notice";
import { BACKLINKS, MISSING_DOCUMENT_TITLE } from "../model/mock";

/** 문서없음 화면 — 아직 작성되지 않은 문서로 이동했을 때 */
export function MissingDocumentPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header variant="plain" />

      <div className="mx-auto max-w-[760px] px-8 pb-[120px] pt-[90px] text-center">
        <MissingDocumentNotice title={MISSING_DOCUMENT_TITLE} />
        <div className="mt-[60px]">
          <Backlinks backlinks={BACKLINKS} />
        </div>
      </div>
    </div>
  );
}

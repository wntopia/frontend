import { PopularDocumentCard } from "@/entities/document";
import { POPULAR_DOCUMENTS } from "../model/mock";

/** 홈의 '인기 문서' 그리드 */
export function PopularDocuments() {
  return (
    <section>
      <h2 className="mb-4 text-[19px] font-bold">인기 문서</h2>
      <div className="grid grid-cols-2 gap-3">
        {POPULAR_DOCUMENTS.map((doc, index) => (
          <PopularDocumentCard key={doc.id} doc={doc} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { PopularArticleResDto } from "@/shared/api";
import { ROUTES } from "@/shared/config";

/** 카드의 면과 여백. 자리표시도 같은 값을 써야 불러온 뒤 그리드 높이가 바뀌지 않는다. */
const CARD = "block rounded-xl bg-surface p-4 elevate-1";

type PopularDocumentCardProps = {
  doc: PopularArticleResDto;
  /** 목록에서의 순위 (1부터). 디자인상 "01" 형태로 표시된다. */
  rank: number;
};

/** 인기 문서 그리드의 카드 */
export function PopularDocumentCard({ doc, rank }: PopularDocumentCardProps) {
  return (
    <Link
      href={ROUTES.document(doc.id)}
      // 미리 가져오기도 문서를 조회해 조회수를 올린다 (`RecentChangeItem` 참고). 여기서는 순위에 오른 문서가
      // 홈에 보인다는 이유만으로 조회수를 더 얻어, 순위가 스스로 굳어지게 된다.
      prefetch={false}
      className={`${CARD} transition hover:-translate-y-0.5 hover:elevate-2`}
    >
      <div className="mb-1.5 font-mono text-[11px] text-accent">
        {String(rank).padStart(2, "0")}
      </div>
      {/* 긴 제목은 두 줄까지 보이고, 띄어쓰기 없는 제목도 카드 밖으로 넘치지 않게 끊는다. */}
      <div className="mb-1 line-clamp-2 text-[15px] font-bold text-fg [overflow-wrap:anywhere]">
        {doc.title}
      </div>
      {/* 서버·클라이언트 렌더 결과가 갈리지 않도록 로케일을 고정한다 */}
      <div className="text-xs text-fg-subtle">
        조회 {doc.viewCount.toLocaleString("ko-KR")}
      </div>
    </Link>
  );
}

/** 인기 문서 카드가 들어올 자리. 글줄마다 실제 글자 크기의 줄 높이(1.5em)를 잡아 둔다. */
export function PopularDocumentCardSkeleton() {
  return (
    <div aria-hidden className={`${CARD} motion-safe:animate-pulse`}>
      <div className="mb-1.5 flex h-[1.5em] items-center text-[11px]">
        <span className="h-[0.9em] w-4 rounded-md bg-elevated" />
      </div>
      <div className="mb-1 flex h-[1.5em] items-center text-[15px]">
        <span className="h-[0.9em] w-3/5 rounded-md bg-elevated" />
      </div>
      <div className="flex h-4 items-center">
        <span className="h-3 w-14 rounded-md bg-elevated" />
      </div>
    </div>
  );
}

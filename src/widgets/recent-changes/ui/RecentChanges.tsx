import Link from "next/link";
import { RecentChangeItem } from "@/entities/document";
import { ROUTES } from "@/shared/config";
import { RECENT_CHANGES } from "../model/mock";

/** 홈의 '최근 변경' 목록 */
export function RecentChanges() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[19px] font-bold">최근 변경</h2>
        <Link
          href={ROUTES.history}
          className="text-[12.5px] text-accent hover:text-accent"
        >
          전체 보기
        </Link>
      </div>
      <div className="divide-y divide-[#202329] overflow-hidden rounded-[14px] border border-line">
        {RECENT_CHANGES.map((change) => (
          <RecentChangeItem key={change.id} change={change} />
        ))}
      </div>
    </section>
  );
}

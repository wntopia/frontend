import Link from "next/link";
import { ROUTES } from "@/shared/config";

type CreateDocumentCtaProps = {
  query: string;
};

/** 검색 결과 하단의 문서 생성 유도 배너 */
export function CreateDocumentCta({ query }: CreateDocumentCtaProps) {
  return (
    <div className="mt-8 flex items-center justify-between rounded-xl bg-surface px-5 py-[18px] elevate-1">
      <div className="text-[13.5px] text-fg-soft">찾는 문서가 없나요?</div>
      <Link
        href={ROUTES.edit}
        className="flex-shrink-0 rounded-lg bg-accent px-[14px] py-2 text-[13px] font-bold text-on-accent elevate-control transition hover:bg-accent-hover hover:text-on-accent"
      >
        {`'${query}' 문서 새로 만들기`}
      </Link>
    </div>
  );
}

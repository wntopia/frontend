import Link from "next/link";
import { ROUTES } from "@/shared/config";

type MissingDocumentNoticeProps = {
  /** 아직 만들어지지 않은 문서의 제목 */
  title: string;
};

/** 문서가 없음을 알리고 생성·검색으로 유도하는 안내 */
export function MissingDocumentNotice({ title }: MissingDocumentNoticeProps) {
  return (
    <section>
      <div className="mx-auto mb-[26px] flex h-14 w-14 items-center justify-center rounded-[14px] border-[1.5px] border-dashed border-[#ff6b6b] font-mono text-2xl text-[#ff6b6b]">
        ?
      </div>

      <div className="mb-2.5 font-mono text-xs uppercase tracking-[.1em] text-fg-subtle">
        문서 없음
      </div>
      <h1 className="mb-[14px] text-[28px] font-extrabold">
        {`'${title}' 문서가 아직 없습니다`}
      </h1>
      <p className="mx-auto mb-[30px] max-w-[480px] text-[15px] leading-[1.8] text-[#a8adb5]">
        이 문서는 다른 문서에서 링크되었지만 아직 작성되지 않았습니다. 알고 있는
        내용이 있다면 지금 첫 문단을 작성해보세요.
      </p>

      <div className="flex justify-center gap-2.5">
        <Link
          href={ROUTES.edit}
          className="rounded-[9px] bg-accent px-5 py-[11px] text-sm font-bold text-[#06101f] hover:text-[#06101f]"
        >
          이 문서 새로 만들기
        </Link>
        <Link
          href={ROUTES.search}
          className="rounded-[9px] border border-line-strong bg-surface-2 px-5 py-[11px] text-sm font-semibold text-fg-muted hover:text-fg-muted"
        >
          비슷한 문서 찾기
        </Link>
      </div>
    </section>
  );
}

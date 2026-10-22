import Link from "next/link";

type SearchNoticeProps = {
  title: string;
  description: string;
  /** 안내 아래에 둘 다음 행동 */
  action?: { href: string; label: string };
};

/**
 * 결과 목록 자리에 대신 보이는 안내 (검색어 없음, 일치하는 문서 없음 등).
 * 시안이 없어 결과 카드와 같은 면에 담았다.
 */
export function SearchNotice({
  title,
  description,
  action,
}: SearchNoticeProps) {
  return (
    <div className="rounded-xl bg-surface px-5 py-10 text-center elevate-1">
      <div className="text-[15.5px] font-bold text-fg">{title}</div>
      {/* 한국어 문장이 낱말 중간에서 끊기지 않게 한다 */}
      <p className="mt-2 break-keep text-[13.5px] leading-[1.6] text-fg-dim">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-block rounded-[9px] bg-surface-2 px-[15px] py-2 text-[13px] font-semibold text-fg elevate-control transition hover:elevate-1 hover:text-fg"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

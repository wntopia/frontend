import Link from "next/link";
import type { Backlink } from "@/entities/document";

type BacklinksProps = {
  backlinks: Backlink[];
};

/** '이 문서를 링크한 문서' 카드 */
export function Backlinks({ backlinks }: BacklinksProps) {
  return (
    <div className="rounded-xl border border-line px-5 py-[18px] text-left">
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[.1em] text-fg-subtle">
        이 문서를 링크한 문서
      </div>
      <div className="divide-y divide-[#202329]">
        {backlinks.map((backlink) => (
          <Link
            key={backlink.id}
            href={backlink.href}
            className="flex items-center justify-between py-2 text-[13.5px] text-fg-muted hover:text-fg-muted"
          >
            <span>{backlink.title}</span>
            <span className="font-mono text-[11.5px] text-fg-subtle">
              {backlink.section}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

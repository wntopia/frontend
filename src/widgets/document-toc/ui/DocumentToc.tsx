import type { TocItem } from "@/entities/document";
import { TocLinks } from "./TocLinks";

/** 문서 오른쪽의 목차 카드. 제목이 없는 문서에서는 그리지 않는다. */
export function DocumentToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="목차"
      className="rounded-[14px] bg-surface-2/70 p-4 pb-3.5 elevate-1 backdrop-blur-[10px]"
    >
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-subtle">
        이 문서에서
      </div>
      <TocLinks items={items} />
    </nav>
  );
}

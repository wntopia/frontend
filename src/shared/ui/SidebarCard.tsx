import type { ReactNode } from "react";

type SidebarCardProps = {
  /** 카드 상단에 모노스페이스 대문자로 표시되는 라벨 */
  title: string;
  children: ReactNode;
};

/** 사이드바 카드 골격 (위키 현황·분류 등에서 공유) */
export function SidebarCard({ title, children }: SidebarCardProps) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-[18px]">
      <div className="mb-[14px] font-mono text-[10.5px] uppercase tracking-[.1em] text-fg-subtle">
        {title}
      </div>
      {children}
    </div>
  );
}

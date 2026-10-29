import type { ReactNode } from "react";

type SidebarCardProps = {
  /** 카드 상단에 모노스페이스 대문자로 표시되는 라벨. 스크린리더가 제목으로 찾아가도록 `<h2>`로 그린다 */
  title: string;
  /**
   * 카드 안쪽 여백을 없앤다. 줄마다 자기 좌우 여백과 hover 면이 있어 줄을 카드 끝까지 채우는 목록(최근 변경)에 쓴다.
   * 라벨만 다른 카드와 같은 자리에 둔다.
   */
  flush?: boolean;
  children: ReactNode;
};

/** 사이드바 · 홈 그리드 카드 골격 (위키 현황 · 분류 · 최근 변경 등에서 공유) */
export function SidebarCard({
  title,
  flush = false,
  children,
}: SidebarCardProps) {
  return (
    <section
      className={`rounded-[14px] bg-surface elevate-1 ${
        flush ? "overflow-hidden" : "p-[18px]"
      }`}
    >
      <h2
        className={`font-mono text-[10.5px] uppercase tracking-[.1em] text-fg-subtle ${
          flush ? "px-[18px] pb-1.5 pt-[18px]" : "mb-[14px]"
        }`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

import { SidebarCard } from "@/shared/ui";
import { WIKI_STATS } from "../model/mock";

/** 홈 사이드바의 '위키 현황' 카드 */
export function WikiStats() {
  return (
    <SidebarCard title="위키 현황">
      <div className="divide-y divide-[#202329]">
        {WIKI_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex justify-between py-[7px] text-[13.5px]"
          >
            <span className="text-[#a8adb5]">{stat.label}</span>
            <b className={`font-mono ${stat.highlight ? "text-success" : ""}`}>
              {stat.value}
            </b>
          </div>
        ))}
      </div>
    </SidebarCard>
  );
}

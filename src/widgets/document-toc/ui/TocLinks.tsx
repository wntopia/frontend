"use client";

import { useEffect, useState } from "react";
import type { TocItem, WikiHeadingLevel } from "@/entities/document";

/**
 * 제목이 화면 위에서 이 거리 안으로 올라오면 그 문단을 읽는 중으로 본다.
 * 고정 상단 바(58px)와 제목의 scroll-mt-20(80px)을 넘기되, 목차로 이동한 직후 그 제목이 바로 잡히도록 조금 여유를 둔다.
 */
const READING_LINE = 96;

/** 하위 제목은 들여 써서 문단 구조가 보이게 한다. 시안에는 h2만 있다. */
const LEVEL_INDENT: Record<WikiHeadingLevel, string> = {
  2: "",
  3: "pl-3.5",
  4: "pl-7",
};

/** 주소의 `#문단`. 브라우저는 한글 앵커를 퍼센트 인코딩해서 돌려준다. */
function readHash(): string {
  const hash = window.location.hash.slice(1);
  try {
    return decodeURIComponent(hash);
  } catch {
    // 손으로 고친 주소처럼 인코딩이 깨진 값은 제목 id와 맞을 리 없다.
    return hash;
  }
}

/** 목차 링크 목록. 스크롤 위치에 따라 지금 읽고 있는 문단을 강조한다. */
export function TocLinks({ items }: { items: TocItem[] }) {
  // 서버 렌더링에서는 스크롤 위치를 알 수 없어 강조 없이 그리고, 브라우저에서 처음 계산할 때 채운다.
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // 문서 끝에 닿으면 끝 쪽 문단은 읽기선까지 올라오지 못한다. 그래도 강조가 비지 않게 끝 문단을 고르되,
      // 목차로 끝 근처 문단에 넘어왔다면 그 문단이 화면에 보이는 동안은 고른 문단을 강조한다.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const hashTarget = readHash();
        const targeted = headings.find((heading) => {
          if (heading.id !== hashTarget) return false;
          const { top, bottom } = heading.getBoundingClientRect();
          return bottom > 0 && top < window.innerHeight;
        });
        setActiveId((targeted ?? headings[headings.length - 1]).id);
        return;
      }

      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > READING_LINE) break;
        current = heading.id;
      }
      setActiveId(current);
    };
    // 스크롤 이벤트는 프레임보다 자주 올 수 있어 한 프레임에 한 번만 계산한다.
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    // 주소에 `#문단`이 붙어 들어오면 처음부터 중간 위치라 스크롤 전에 한 번 계산한다.
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // 이미 문서 끝에 있으면 목차를 눌러도 스크롤이 일어나지 않는다. 주소의 문단만 바뀌므로 따로 듣는다.
    window.addEventListener("hashchange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return items.map((item) => {
    const active = item.id === activeId;
    return (
      <a
        key={item.id}
        href={`#${item.id}`}
        aria-current={active ? "location" : undefined}
        className={`flex items-center gap-2.5 py-1 text-[13px] ${
          LEVEL_INDENT[item.level]
        } ${active ? "font-semibold text-fg" : "text-fg-muted"}`}
      >
        <span
          className={`flex-shrink-0 ${
            active ? "h-0.5 w-5 bg-accent" : "h-[1.5px] w-[14px] bg-faint"
          }`}
        />
        {item.label}
      </a>
    );
  });
}

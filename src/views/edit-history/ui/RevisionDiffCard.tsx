"use client";

import { useState } from "react";

/**
 * 오늘 수정된 리비전 묶음 카드.
 * '차이 보기' 토글로 변경 내용(diff)을 펼치므로 클라이언트 컴포넌트로 둔다.
 */
export function RevisionDiffCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-[#131417] px-4 py-[14px]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-fg">
          <b>이서연</b> 외 3명이 오늘 <b className="text-success">5회</b> 수정
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer rounded-[7px] border border-line-strong bg-surface-2 px-2.5 py-[5px] text-xs text-[#a8adb5]"
        >
          {open ? "차이 닫기" : "차이 보기"}
        </button>
      </div>
      <div className="mt-[5px] font-mono text-[11.5px] text-fg-subtle">
        14:32 · 14:10 · 13:52 · 11:20 · 09:03
      </div>

      {open && (
        <div className="mt-[14px] border-t border-[#202329] pt-[14px] font-mono text-[13px] leading-[1.9]">
          <div className="text-fg-subtle">
            2026.03 제45회 입학식, 신입생 320명 입학
          </div>
          <div className="rounded-[3px] bg-success/10 px-1 py-0.5 text-[#9be3c4]">
            + 2026.07 급식 위생 점검 결과 추가
          </div>
          <div className="rounded-[3px] bg-[#ff6b6b]/[0.08] px-1 py-0.5 text-[#ff9b9b] line-through decoration-[#ff6b6b]/40">
            - 2026.06 임시 급식실 운영 (초안)
          </div>
        </div>
      )}
    </div>
  );
}

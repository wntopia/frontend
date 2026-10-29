import Link from "next/link";
import { ROUTES } from "@/shared/config";
import { PlusIcon } from "@/shared/icons";

/**
 * 홈 그리드의 새 문서 작성 권유 칸.
 * 위키는 읽는 사람이 쓰는 사람이 되어야 자라므로, 그리드에서 유일하게 강조색으로 채워 먼저 눈에 띄게 한다.
 * 새 문서 화면은 로그인이 필요하지만 그 검사는 화면이 하므로 여기서는 세션을 읽지 않는다
 * (읽으면 홈이 세션마다 달라진다).
 */
export function WriteDocumentCta() {
  return (
    <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[14px] bg-accent p-[22px] text-on-accent elevate-1">
      {/* 채운 면이 납작해 보이지 않게 위쪽 모서리에 밝은 빛을 옅게 얹는다 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/20 blur-[40px]"
      />

      <div className="relative">
        <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[.1em] opacity-70">
          함께 만드는 위키
        </div>
        <h2 className="mb-2 break-keep text-[19px] font-extrabold leading-[1.4] tracking-[-.01em]">
          우리 학교 이야기,
          <br />
          직접 기록해 보세요
        </h2>
        <p className="break-keep text-[13px] leading-[1.6] opacity-80">
          아직 아무도 쓰지 않은 이야기가 있다면 첫 문서를 남겨 주세요.
        </p>
      </div>

      <Link
        href={ROUTES.documentNew()}
        className="relative rounded-[9px] bg-on-accent px-4 py-2.5 text-[13.5px] font-bold transition hover:opacity-90"
      >
        {/* globals.css의 `a { color: inherit }`가 레이어 밖이라 링크에 준 글자색 유틸을 이긴다. 안쪽에서 색을 준다. */}
        <span className="flex items-center justify-center gap-1.5 text-accent">
          <PlusIcon size={15} />새 문서 만들기
        </span>
      </Link>
    </section>
  );
}

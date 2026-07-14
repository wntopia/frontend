import Link from "next/link";
import type { ReactNode } from "react";

/** 이미 작성된 문서로 향하는 위키 링크(파란색). */
export function WikiLink({ children }: { children: ReactNode }) {
  return (
    <Link href="#" className="border-b border-accent/35 text-accent">
      {children}
    </Link>
  );
}

/** 아직 작성되지 않은 문서로 향하는 링크(붉은 점선). */
export function MissingLink({ children }: { children: ReactNode }) {
  return (
    <Link
      href="#"
      className="border-b border-dashed border-[#ff6b6b]/45 text-[#ff6b6b]"
    >
      {children}
    </Link>
  );
}

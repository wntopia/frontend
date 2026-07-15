import Link from "next/link";
import { Header } from "@/widgets/header";

/** 초기 세팅용 임시 홈 — 각 화면 라우트 진입점 */
const pages = [
  { href: "/mypage", label: "마이페이지", status: "구현됨" },
  { href: "#", label: "홈", status: "예정" },
  { href: "#", label: "검색결과", status: "예정" },
  { href: "/document", label: "문서 상세 페이지", status: "구현됨" },
  { href: "#", label: "문서없음", status: "예정" },
  { href: "#", label: "편집", status: "예정" },
  { href: "/document/history", label: "편집역사", status: "구현됨" },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />
      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-11">
        <h1 className="text-[21px] font-extrabold">금성위키 · 화면 목록</h1>
        <p className="mt-1 text-[13.5px] text-fg-subtle">
          디자인에서 가져온 7개 화면의 라우트입니다.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pages.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
            >
              <div className="text-[15px] font-semibold text-fg-muted">
                {p.label}
              </div>
              <div
                className={`mt-2 font-mono text-[11px] ${
                  p.status === "구현됨" ? "text-success" : "text-fg-subtle"
                }`}
              >
                {p.status}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ROUTES } from "@/shared/config";
import { Header } from "@/widgets/header";

/** 디자인에서 가져온 7개 화면. 모두 포팅되어 각 라우트로 연결된다. */
const SCREENS = [
  { label: "마이페이지", href: ROUTES.mypage },
  { label: "홈", href: ROUTES.home },
  { label: "검색결과", href: ROUTES.search },
  { label: "문서 상세 페이지", href: ROUTES.document },
  { label: "문서없음", href: ROUTES.missingDocument },
  { label: "편집", href: ROUTES.edit },
  { label: "편집역사", href: ROUTES.history },
];

/** 초기 세팅용 임시 홈 — 각 화면 라우트 진입점 */
export function ScreenIndexPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />
      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-11">
        <h1 className="text-[21px] font-extrabold">금성위키 · 화면 목록</h1>
        <p className="mt-1 text-[13.5px] text-fg-subtle">
          디자인에서 가져온 7개 화면의 라우트입니다.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SCREENS.map((screen) => (
            <Link
              key={screen.label}
              href={screen.href}
              className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
            >
              <div className="text-[15px] font-semibold text-fg-muted">
                {screen.label}
              </div>
              <div className="mt-2 font-mono text-[11px] text-success">
                구현됨
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

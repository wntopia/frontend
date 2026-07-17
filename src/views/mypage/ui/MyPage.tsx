import Link from "next/link";
import { Header } from "@/widgets/header";

const stats = [
  { value: "128", label: "총 편집 수", color: "text-accent" },
  { value: "9", label: "새로 만든 문서", color: "text-success" },
  { value: "5회", label: "오늘 편집", color: "text-fg" },
];

const contributions = [
  {
    href: "#",
    dot: "bg-success",
    text: "금성고등학교 · 급식 위생 점검 결과 추가",
    time: "방금",
  },
  { href: "#", dot: "bg-[#3a3f47]", text: "방송부 · 부원 명단 갱신", time: "어제" },
  { href: "#", dot: "bg-accent/60", text: "급식 메뉴 · 문서 생성", time: "3일 전" },
];

const favorites = ["금성고등학교", "방송부", "2026 체육대회"];

export function MyPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />

      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-11">
        {/* 프로필 */}
        <div className="mb-[34px] flex items-center gap-[18px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line-strong bg-elevated text-[22px] font-bold text-fg-muted">
            이
          </div>
          <div>
            <div className="text-[21px] font-extrabold">이서연</div>
            <div className="mt-[3px] font-mono text-xs text-fg-subtle">
              2학년 3반 · 2026.03 가입
            </div>
          </div>
          <div className="flex-1" />
          <button className="cursor-pointer rounded-[9px] border border-line-strong bg-surface-2 px-[15px] py-[9px] text-[13px] font-semibold text-fg-muted">
            프로필 편집
          </button>
        </div>

        {/* 통계 */}
        <div className="mb-9 flex gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl border border-line bg-surface p-4"
            >
              <div className={`font-mono text-[22px] font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="mt-[3px] text-[12.5px] text-fg-subtle">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 최근 기여 + 즐겨찾기 */}
        <div className="flex gap-10">
          <div className="min-w-0 flex-1">
            <div className="mb-[14px] text-base font-bold">최근 기여</div>
            <div className="overflow-hidden rounded-xl border border-line">
              {contributions.map((c, i) => (
                <Link
                  key={i}
                  href={c.href}
                  className={`flex items-center gap-3 px-4 py-[13px] transition-colors hover:bg-[#161719] ${
                    i < contributions.length - 1 ? "border-b border-[#202329]" : ""
                  }`}
                >
                  <span
                    className={`h-[7px] w-[7px] flex-shrink-0 rounded-full ${c.dot}`}
                  />
                  <div className="flex-1 text-[13.5px] text-fg-muted">
                    {c.text}
                  </div>
                  <span className="font-mono text-[11px] text-fg-subtle">
                    {c.time}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-[260px] flex-shrink-0">
            <div className="mb-[14px] text-base font-bold">즐겨찾는 문서</div>
            <div className="rounded-xl border border-line bg-surface p-1.5">
              {favorites.map((f) => (
                <Link
                  key={f}
                  href="#"
                  className="block rounded-[7px] px-[11px] py-[9px] text-[13.5px] text-fg-muted transition-colors hover:bg-surface-2"
                >
                  {f}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

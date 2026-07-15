import Link from "next/link";
import { RevisionDiffCard } from "./RevisionDiffCard";

const stats = [
  { value: "231", label: "전체 리비전", color: "text-accent" },
  { value: "48", label: "기여자", color: "text-success" },
  { value: "2026.06.20", label: "최초 생성", color: "text-fg" },
];

/** 타임라인 마커 색상 변형 — active(편집 중), bot(자동 편집), 기본 */
const marker = {
  active: "border-success bg-success/15",
  bot: "border-accent bg-accent/[0.14]",
  default: "border-line-strong bg-surface-2",
};

const revisions = [
  {
    body: (
      <>
        <b>박민준</b>이 &lsquo;연혁&rsquo; 문단 추가
      </>
    ),
    delta: <span className="text-success">+412자</span>,
    time: "어제 21:14",
    variant: "default" as const,
  },
  {
    body: (
      <>
        <b>정하윤</b>이 오타 <b>2회</b> 수정
      </>
    ),
    delta: <span className="text-fg-subtle">±6자</span>,
    time: "3일 전",
    variant: "default" as const,
  },
  {
    body: (
      <>
        <b>관리자봇</b>이 분류 정리
      </>
    ),
    delta: null,
    time: "지난주",
    variant: "bot" as const,
  },
  {
    body: (
      <>
        <b>이서연</b>이 문서 생성
      </>
    ),
    delta: null,
    time: "2026.06.20",
    variant: "default" as const,
  },
];

export function EditHistoryPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* 상단 바 */}
      <div className="sticky top-0 z-50 border-b border-[#23262c] bg-bg/85 backdrop-blur-[10px]">
        <div className="mx-auto flex h-[58px] max-w-[1000px] items-center gap-4 px-8">
          <Link
            href="/document"
            className="flex items-center gap-[7px] text-[13.5px] text-[#a8adb5]"
          >
            <span className="text-[15px]">←</span> 금성고등학교
          </Link>
          <div className="flex-1" />
          <span className="text-[13.5px] font-bold">편집 역사</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-9">
        {/* 리비전 통계 */}
        <div className="mb-7 flex gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl border border-line bg-surface px-4 py-[14px]"
            >
              <div className={`font-mono text-xl font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="mt-0.5 text-xs text-fg-subtle">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 타임라인 */}
        <div className="relative pl-[30px]">
          <div className="absolute bottom-1.5 left-[9px] top-1.5 w-[1.5px] bg-line" />

          <div className="relative mb-[22px]">
            <span
              className={`absolute -left-[30px] top-0.5 h-5 w-5 rounded-full border-[1.5px] ${marker.active}`}
            />
            <RevisionDiffCard />
          </div>

          {revisions.map((r, i) => (
            <div
              key={i}
              className={`relative ${
                i < revisions.length - 1 ? "mb-[22px]" : ""
              }`}
            >
              <span
                className={`absolute -left-[30px] top-0.5 h-5 w-5 rounded-full border-[1.5px] ${marker[r.variant]}`}
              />
              <div className="rounded-xl border border-line bg-[#131417] px-4 py-[14px]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-fg">{r.body}</div>
                  {r.delta && (
                    <span className="font-mono text-xs">{r.delta}</span>
                  )}
                </div>
                <div className="mt-[5px] font-mono text-[11.5px] text-fg-subtle">
                  {r.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

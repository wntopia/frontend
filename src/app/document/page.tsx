import Link from "next/link";
import type { ReactNode } from "react";
import DocumentTopNav from "./DocumentTopNav";

/** 이미 작성된 문서로 향하는 위키 링크(파란색). */
function WikiLink({ children }: { children: ReactNode }) {
  return (
    <Link href="#" className="border-b border-accent/35 text-accent">
      {children}
    </Link>
  );
}

/** 아직 작성되지 않은 문서로 향하는 링크(붉은 점선). */
function MissingLink({ children }: { children: ReactNode }) {
  return (
    <Link
      href="#"
      className="border-b border-dashed border-[#ff6b6b]/45 text-[#ff6b6b]"
    >
      {children}
    </Link>
  );
}

const tags = ["분류: 학교", "서울", "고등학교"];

const toc = [
  { id: "s1", label: "개요" },
  { id: "s2", label: "연혁" },
  { id: "s3", label: "상징" },
  { id: "s4", label: "동아리" },
  { id: "s5", label: "대중교통" },
];
// 스냅샷 기준 현재 보고 있는 문단
const activeSection = "s2";

const history = [
  { key: "1981.11", text: "학교법인 금성학원 설립 인가", missing: false, node: null },
  { key: "1982.03", text: "제1회 입학식(신입생 480명)", missing: false, node: null },
];

const timeline = [
  {
    initial: "이",
    active: true,
    body: (
      <>
        <b className="text-fg">이서연</b> 외 3명이 오늘{" "}
        <b className="text-success">5회</b> 수정
      </>
    ),
    meta: <>방금 · 편집 중</>,
  },
  {
    initial: "박",
    active: false,
    body: (
      <>
        <b className="text-fg">박민준</b>이 &lsquo;연혁&rsquo; 문단 추가
      </>
    ),
    meta: (
      <>
        어제 · <span className="text-success">+412자</span>
      </>
    ),
  },
  {
    initial: "정",
    active: false,
    body: (
      <>
        <b className="text-fg">정하윤</b>이 오타 2회 수정
      </>
    ),
    meta: <>3일 전</>,
  },
  {
    initial: "이",
    active: false,
    body: (
      <>
        <b className="text-fg">이서연</b>이 문서 생성
      </>
    ),
    meta: <>2026.06.20</>,
  },
];

const h2 =
  "scroll-mt-20 mt-[46px] mb-4 text-2xl font-bold tracking-[-0.015em]";
const p = "mb-5 text-base leading-[1.9] text-fg-muted";

export default function DocumentPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <DocumentTopNav />

      <div className="mx-auto flex max-w-[1120px] gap-12 px-8">
        {/* 본문 */}
        <article className="w-[700px] flex-shrink-0 pb-[120px] pt-[52px]">
          <div className="mb-[18px] flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-[5px] border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-[#8b919a]"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-[38px] font-extrabold leading-[1.15] tracking-[-0.025em]">
            금성고등학교
          </h1>

          <div className="mt-[14px] flex flex-wrap items-center gap-[14px] font-mono text-xs text-fg-subtle">
            <span>
              최종 수정 <b className="text-[#a8adb5]">2026-07-06 14:32</b>
            </span>
            <span className="text-[#3a3f47]">·</span>
            <span>기여자 48</span>
            <span className="text-[#3a3f47]">·</span>
            <span>조회 12,904</span>
          </div>

          <h2 id="s1" className={h2}>
            개요
          </h2>
          <p className={p}>
            금성고등학교(錦城高等學校)는 서울특별시 ○○구에 위치한{" "}
            <WikiLink>공립</WikiLink> 일반계 고등학교이다.{" "}
            <WikiLink>1982년</WikiLink> 개교하여 올해로 44주년을 맞았으며,
            &lsquo;스스로 배우고 함께 성장하는 학교&rsquo;를 교훈으로 삼는다.
            입학 정보는 <WikiLink>입학 안내</WikiLink> 문서를 참고할 것.
          </p>
          <p className={p}>
            과학중점학교로 지정되어 있으며, 심화 과정은{" "}
            <MissingLink>금성고 과학중점과정</MissingLink> 문서를 참조. 아직
            작성되지 않은 문서는 이렇게 붉게 표시된다.
          </p>

          <h2 id="s2" className={h2}>
            연혁
          </h2>
          <div className="border-l-2 border-line pl-5">
            {history.map((h) => (
              <div
                key={h.key}
                className="mb-[15px] text-[15.5px] leading-[1.6] text-fg-muted"
              >
                <b className="font-mono text-[13.5px] text-accent">{h.key}</b>
                &nbsp;&nbsp;{h.text}
              </div>
            ))}
            <div className="mb-[15px] text-[15.5px] leading-[1.6] text-fg-muted">
              <b className="font-mono text-[13.5px] text-accent">2008.09</b>
              &nbsp;&nbsp;<WikiLink>중앙도서관</WikiLink> 리모델링 완료
            </div>
            <div className="mb-[15px] text-[15.5px] leading-[1.6] text-fg-muted">
              <b className="font-mono text-[13.5px] text-accent">2020.03</b>
              &nbsp;&nbsp;<MissingLink>원격수업</MissingLink> 전면 시행
            </div>
            <div className="text-[15.5px] leading-[1.6] text-fg-muted">
              <b className="font-mono text-[13.5px] text-accent">2026.03</b>
              &nbsp;&nbsp;제45회 입학식, 신입생 320명
            </div>
          </div>

          <h2 id="s3" className={h2}>
            상징
          </h2>
          <p className={p}>
            교화는 <b className="text-fg">개나리</b>, 교목은{" "}
            <b className="text-fg">느티나무</b>이다. 교표 및 교가 악보는{" "}
            <MissingLink>금성고 교가</MissingLink> 문서에서 확인할 수 있다.
          </p>

          <h2 id="s4" className={h2}>
            동아리
          </h2>
          <p className={p}>
            대표 동아리로 <WikiLink>방송부</WikiLink>,{" "}
            <WikiLink>밴드부 소리울림</WikiLink>,{" "}
            <MissingLink>천문동아리 페르세우스</MissingLink> 등이 있다.
          </p>

          <h2 id="s5" className={h2}>
            이용 가능한 대중교통
          </h2>
          <p className="text-base leading-[1.9] text-fg-muted">
            지하철 <WikiLink>2호선</WikiLink> ○○역 3번 출구 도보 8분. 간선버스
            143, 240번이 정문 앞에 정차한다.
          </p>
        </article>

        {/* 우측 플로팅 사이드바 */}
        <aside className="w-[260px] flex-shrink-0 pt-[52px]">
          <div className="sticky top-[78px]">
            {/* 목차 */}
            <nav className="rounded-[14px] border border-line bg-surface-2/70 p-4 pb-3.5 backdrop-blur-[10px]">
              <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-subtle">
                이 문서에서
              </div>
              {toc.map((item) => {
                const active = item.id === activeSection;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`flex items-center gap-2.5 py-1 text-[13px] ${
                      active
                        ? "font-semibold text-fg"
                        : "text-fg-muted"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        active
                          ? "h-0.5 w-5 bg-accent"
                          : "h-[1.5px] w-[14px] bg-[#3a3f47]"
                      }`}
                    />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* 편집 역사 */}
            <div className="mt-4 rounded-[14px] border border-line bg-surface p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[13px] font-bold text-fg">편집 역사</div>
                <Link href="#" className="text-[11.5px] text-accent">
                  전체
                </Link>
              </div>
              <div className="relative pl-6">
                <div className="absolute bottom-1.5 left-2 top-1 w-[1.5px] bg-line" />
                {timeline.map((item, i) => (
                  <div
                    key={i}
                    className={`relative ${
                      i < timeline.length - 1 ? "mb-4" : ""
                    }`}
                  >
                    <span
                      className={`absolute -left-6 top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[8.5px] font-bold ${
                        item.active
                          ? "border-[1.5px] border-success bg-success/15 text-success"
                          : "border-[1.5px] border-line-strong bg-surface-2 text-[#a8adb5]"
                      }`}
                    >
                      {item.initial}
                    </span>
                    <div className="text-[12.5px] leading-[1.5] text-fg-muted">
                      {item.body}
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-fg-subtle">
                      {item.meta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

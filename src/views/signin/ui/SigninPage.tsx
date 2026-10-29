import Link from "next/link";
import type { ReactNode } from "react";
import { RETURN_TO_PARAM, SigninButton } from "@/features/auth";
import { ROUTES } from "@/shared/config";
import { firstParam, type SearchParams } from "@/shared/lib";
import { Alert, Logo } from "@/shared/ui";

/** 사유는 주소에 실려 오는 임의의 문자열이라 화면을 덮지 않을 만큼만 보여 준다. */
const MAX_REASON_LENGTH = 200;

/** 로그인해야 쓸 수 있는 것들. 버튼만 덩그러니 두면 왜 로그인하는지 알 수 없어 함께 보인다. */
const BENEFITS: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "문서 쓰고 고치기",
    description: "새 문서를 만들고, 틀린 내용을 바로잡을 수 있어요.",
    icon: (
      <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3Z M13.5 6.5l3 3" />
    ),
  },
  {
    title: "실시간 공동편집",
    description: "같은 문서를 여러 사람이 동시에 편집해요.",
    icon: (
      <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1 M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M22 19v-1a4 4 0 0 0-3-3.87 M16 4.13a3 3 0 0 1 0 5.74" />
    ),
  },
  {
    title: "내 기여 기록",
    description: "고친 문서와 편집 역사가 마이페이지에 남아요.",
    icon: <path d="M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2" />,
  },
];

/**
 * 로그인 화면.
 * 시안에 없는 화면이라 다른 화면의 카드·버튼 모양과 토큰을 그대로 빌려 만들었다.
 * 로그인 한 가지만 하는 화면이라 헤더 없이 카드만 화면 한가운데에 둔다.
 */
export async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // 백엔드는 로그인에 실패하면 `/signin?error&reason=<사유>`로 돌려보낸다.
  // `error`는 값 없이 이름만 오므로 값이 아니라 존재 여부를 본다.
  const failed = params.error !== undefined;
  const reason = firstParam(params.reason)?.slice(0, MAX_REASON_LENGTH);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
      {/* 카드 뒤의 은은한 빛 — 면이 비어 보이지 않게 강조색을 아주 옅게 깐다 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <main className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        <section className="grid w-full max-w-[760px] overflow-hidden rounded-[18px] bg-surface elevate-2 md:grid-cols-[1.05fr_1fr]">
          {/* 왼쪽: 로그인하면 할 수 있는 것 */}
          <div className="order-2 flex flex-col justify-center bg-sunken px-7 py-8 md:order-1 md:px-9 md:py-10">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[.14em] text-fg-subtle">
              Members only
            </div>
            <h2 className="mb-7 text-[19px] font-extrabold leading-[1.4] tracking-[-.01em]">
              {/* 학생 계정이 아니면 백엔드가 문서 수정과 공동편집을 막으므로 교사를 따로 부르지 않는다. */}
              함께 쓰는 교내 위키
              <br />
              기록에 참여하세요
            </h2>

            <ul className="flex flex-col gap-5">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className="flex gap-3.5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-accent/12 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      width={18}
                      height={18}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {benefit.icon}
                    </svg>
                  </span>
                  <div>
                    <div className="mb-0.5 text-[14px] font-bold">
                      {benefit.title}
                    </div>
                    <p className="text-[13px] leading-[1.6] text-fg-dim">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 오른쪽: 로그인 동작 */}
          <div className="order-1 flex flex-col justify-center px-7 py-9 md:order-2 md:px-9 md:py-10">
            <div className="mb-6">
              <Logo size={44} />
            </div>
            <h1 className="mb-2 text-[24px] font-extrabold tracking-[-.02em]">
              지무위키에 로그인
            </h1>
            <p className="mb-7 text-sm leading-[1.7] text-fg-soft">
              DataGSM 계정 하나로 바로 시작할 수 있어요.
            </p>

            {failed && (
              <Alert
                title="로그인하지 못했습니다."
                detail={reason}
                className="mb-[18px]"
              >
                다시 시도해 주세요.
              </Alert>
            )}

            <SigninButton
              returnTo={firstParam(params[RETURN_TO_PARAM])}
              className="group flex items-center justify-center gap-2 rounded-[10px] bg-accent px-5 py-[13px] text-sm font-bold text-on-accent elevate-control transition hover:bg-accent-hover hover:text-on-accent"
            >
              DataGSM으로 로그인
              <svg
                viewBox="0 0 24 24"
                width={16}
                height={16}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14 M13 6l6 6-6 6" />
              </svg>
            </SigninButton>

            <div className="mt-6 border-t border-divider pt-5 text-[12.5px] leading-[1.6] text-fg-subtle">
              로그인하지 않아도 문서는 읽을 수 있어요.{" "}
              <Link
                href={ROUTES.home}
                className="font-semibold text-fg-soft underline-offset-4 hover:underline"
              >
                둘러보기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

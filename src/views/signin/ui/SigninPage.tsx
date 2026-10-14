import { RETURN_TO_PARAM, SigninButton } from "@/features/auth";
import { firstParam, type SearchParams } from "@/shared/lib";
import { Logo } from "@/shared/ui";
import { Header } from "@/widgets/header";

/** 사유는 주소에 실려 오는 임의의 문자열이라 화면을 덮지 않을 만큼만 보여 준다. */
const MAX_REASON_LENGTH = 200;

/**
 * 로그인 화면.
 * 시안에 없는 화면이라 다른 화면의 카드·버튼 모양과 토큰을 그대로 빌려 만들었다.
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
    <div className="min-h-screen bg-bg text-fg">
      <Header variant="plain" />

      <div className="mx-auto max-w-[760px] px-8 pb-[120px] pt-[90px]">
        <section className="mx-auto max-w-[400px] rounded-[14px] bg-surface px-8 py-9 text-center elevate-1">
          <div className="mb-5 flex justify-center">
            <Logo size={40} />
          </div>
          <h1 className="mb-2.5 text-[22px] font-extrabold">
            지무위키에 로그인
          </h1>
          <p className="mb-[26px] text-sm leading-[1.7] text-fg-soft">
            DataGSM 계정으로 로그인하면 문서를 쓰고 고칠 수 있습니다.
          </p>

          {failed && (
            <div
              role="alert"
              className="mb-[18px] rounded-[9px] bg-danger/10 px-[14px] py-3 text-left text-[13px] leading-[1.6] text-danger-fg"
            >
              <b className="font-bold">로그인하지 못했습니다.</b> 다시 시도해
              주세요.
              {reason && (
                <div className="mt-1 break-words text-xs opacity-80">
                  {reason}
                </div>
              )}
            </div>
          )}

          <SigninButton
            returnTo={firstParam(params[RETURN_TO_PARAM])}
            className="block rounded-[9px] bg-accent px-5 py-[11px] text-sm font-bold text-on-accent elevate-control transition hover:bg-accent-hover hover:text-on-accent"
          >
            DataGSM으로 로그인
          </SigninButton>
        </section>
      </div>
    </div>
  );
}

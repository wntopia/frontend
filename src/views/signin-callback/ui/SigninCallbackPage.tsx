import { SigninRedirect } from "@/features/auth";

/**
 * 로그인 성공 후 백엔드가 돌려보내는 착지 화면.
 * 곧바로 로그인 전에 보던 화면으로 넘어가므로 진행 중이라는 안내만 둔다.
 */
export function SigninCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
      <SigninRedirect />
    </div>
  );
}

import { getClassLabel, getDisplayName, getInitial } from "@/entities/session";
import { SignoutButton } from "@/features/auth";
import { requireSession } from "@/features/auth/server";
import { ROUTES } from "@/shared/config";
import { Header } from "@/widgets/header";

/**
 * 마이페이지. 로그인한 사용자만 들어올 수 있다.
 *
 * 시안의 통계 · 최근 기여 · 즐겨찾는 문서 · 프로필 편집은 받아 올 백엔드 API가 없어 빼 두었다.
 * 빈 상태로 그리면 '기여가 없다'는 잘못된 정보가 되기 때문이다. API가 생기면 시안에서 다시 옮긴다.
 */
export async function MyPage() {
  const user = await requireSession(ROUTES.mypage);
  // 학생이 아닌 계정(교사 등)은 학년 · 반이 없어 어떤 계정으로 들어왔는지 알 수 있게 이메일을 보인다.
  const caption = getClassLabel(user) ?? user.email;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />

      <div className="mx-auto max-w-[1000px] px-8 pb-[120px] pt-11">
        {/* 프로필 */}
        <div className="flex items-center gap-[18px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-elevated elevate-2 text-[22px] font-bold text-fg-muted">
            {getInitial(user)}
          </div>
          <div>
            <div className="text-[21px] font-extrabold">
              {getDisplayName(user)}
            </div>
            {caption && (
              <div className="mt-[3px] font-mono text-xs text-fg-subtle">
                {caption}
              </div>
            )}
          </div>
          <div className="flex-1" />
          <SignoutButton />
        </div>
      </div>
    </div>
  );
}

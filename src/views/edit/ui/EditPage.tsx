import { requireSession } from "@/features/auth/server";
import { ROUTES } from "@/shared/config";
import { EDIT_DOCUMENT } from "../model/mock";
import { EditWorkspace } from "./EditWorkspace";

/**
 * 편집 화면. 로그인한 사용자만 들어올 수 있다.
 *
 * 로그인 검사는 서버에서 해야 하는데 편집 화면 본체는 상태를 가진 클라이언트 컴포넌트라,
 * 검사만 하는 서버 컴포넌트를 한 겹 두었다.
 */
export async function EditPage() {
  await requireSession(ROUTES.edit);

  return (
    <EditWorkspace
      title={EDIT_DOCUMENT.title}
      initialContent={EDIT_DOCUMENT.content}
      backHref={ROUTES.document}
      backLabel={EDIT_DOCUMENT.title}
    />
  );
}

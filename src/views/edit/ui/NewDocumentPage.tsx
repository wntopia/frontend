import { requireSession } from "@/features/auth/server";
import { NEW_DOCUMENT_TITLE_PARAM, ROUTES } from "@/shared/config";
import { firstParam, type SearchParams } from "@/shared/lib";
import { EditWorkspace } from "./EditWorkspace";

/**
 * 새 문서 작성 화면. 편집 화면과 같은 본체를 빈 본문으로 연다.
 *
 * 아직 문서가 없어 주소에 id가 없다. '문서 없음' 화면이나 검색 결과처럼 만들 제목을 이미 아는
 * 곳에서 오면 그 제목이 쿼리로 실려 온다.
 *
 * 백엔드는 비로그인 생성도 받지만 여기서는 로그인을 요구한다. 로그인한 채로 만들어야 만든 사람이
 * 기여 통계에 남는다.
 */
export async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const title = firstParam(params[NEW_DOCUMENT_TITLE_PARAM])?.trim() ?? "";
  // 로그인하고 돌아왔을 때도 제목이 채워져 있도록 쿼리째로 복귀 주소를 만든다.
  const returnTo = ROUTES.documentNew(title);
  await requireSession(returnTo);

  return (
    // 돌아갈 문서가 없으므로 그만두면 홈으로 간다.
    <EditWorkspace
      target={{ kind: "create" }}
      initialTitle={title}
      initialContent=""
      imageUrl={null}
      backHref={ROUTES.home}
      backLabel="홈"
      returnTo={returnTo}
    />
  );
}

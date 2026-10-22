import { ROUTES } from "@/shared/config";

/**
 * 문서의 절대 주소를 클립보드에 넣고 성공 여부를 준다. 지금 보던 문단(#)이나 쿼리는 싣지 않는다 —
 * 링크를 받은 사람이 문서를 처음부터 보게 한다.
 *
 * Clipboard API는 보안 연결(https, localhost)에서만 있어 http로 연 사설 IP 같은 곳에서는 아예 없다.
 * 서비스는 https로 열리므로 폐기 예정인 `document.execCommand("copy")`로 메우지 않고 실패로 알린다.
 * Safari는 클릭 처리 중에 곧바로 불러야 쓰기를 허락하므로, 부르는 쪽은 이 함수를 await 뒤로 미루지 않는다.
 */
export async function copyDocumentLink(articleId: number): Promise<boolean> {
  if (!navigator.clipboard) return false;

  const url = new URL(ROUTES.document(articleId), window.location.origin);
  try {
    await navigator.clipboard.writeText(url.href);
    return true;
  } catch {
    // 권한이 막혔거나 창이 포커스를 잃은 경우다.
    return false;
  }
}

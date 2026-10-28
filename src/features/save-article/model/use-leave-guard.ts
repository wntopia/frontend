import { useCallback, useEffect } from "react";

const LEAVE_MESSAGE =
  "저장하지 않은 내용이 있습니다. 이 화면을 떠나면 쓰던 내용이 사라집니다. 떠날까요?";

/**
 * 저장하지 않은 내용이 있는 동안 화면을 떠나기 전에 확인을 받는다.
 *
 * - 새로고침 · 탭 닫기 · 주소 입력 · 일반 `<a>`(로그인 버튼 등)로 떠나면 `beforeunload`로 브라우저가 묻는다.
 *   문구는 브라우저가 정하며 바꿀 수 없다.
 * - 앱 안의 `<Link>` 이동은 페이지를 내리지 않아 `beforeunload`가 일어나지 않는다. 돌려주는 함수를
 *   그 링크의 `onNavigate`에 걸어야 묻는다.
 * - 브라우저의 뒤로/앞으로 가기는 Next가 취소할 방법을 주지 않아 묻지 못하고 떠난다.
 */
export function useLeaveGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
      // Chrome 119 미만처럼 오래된 브라우저는 returnValue가 있어야 묻는다.
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);

  return useCallback(
    (event: { preventDefault: () => void }) => {
      if (active && !window.confirm(LEAVE_MESSAGE)) event.preventDefault();
    },
    [active],
  );
}

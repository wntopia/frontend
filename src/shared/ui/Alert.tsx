import type { ReactNode } from "react";

type AlertProps = {
  /** 무엇이 실패했는지 (굵게 표시된다) */
  title: string;
  /** 제목 뒤에 이어 붙는 안내 — 무엇을 하면 되는지 */
  children?: ReactNode;
  /** 서버가 준 사유처럼 덜 중요한 세부 정보. 작게 한 줄 아래에 둔다. */
  detail?: ReactNode;
  className?: string;
};

/**
 * 사용자가 한 동작(로그인, 저장 …)이 실패했음을 그 자리에서 알리는 상자.
 *
 * 토스트처럼 사라지지 않고, 동작을 다시 하거나 화면을 떠날 때까지 남는다. 실패를 읽고
 * 무엇을 고칠지 판단할 시간이 필요하고, 쓰던 내용은 화면에 그대로 있어야 하기 때문이다.
 */
export function Alert({ title, children, detail, className = "" }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-[9px] bg-danger/10 px-[14px] py-3 text-left text-[13px] leading-[1.6] text-danger-fg ${className}`}
    >
      <b className="font-bold">{title}</b> {children}
      {detail && (
        <div className="mt-1 break-words text-xs opacity-80">{detail}</div>
      )}
    </div>
  );
}

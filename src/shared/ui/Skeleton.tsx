type SkeletonProps = {
  /** 크기와 여백. 모서리는 `round`로 고른다. */
  className?: string;
  /**
   * 아바타처럼 둥근 자리. `className`의 `rounded-full`로는 기본 모서리를 이기지 못할 수 있어
   * (두 클래스가 함께 붙으면 생성된 CSS의 순서가 이긴다) 따로 받는다.
   */
  round?: boolean;
};

/**
 * 내용이 오기 전에 자리를 잡아 두는 막대.
 * 화면 읽기 도구에는 의미가 없어 숨기고, 움직임 줄이기를 켠 사용자에게는 깜빡이지 않는다.
 */
export function Skeleton({ className = "", round = false }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`block bg-elevated motion-safe:animate-pulse ${
        round ? "rounded-full" : "rounded-md"
      } ${className}`}
    />
  );
}

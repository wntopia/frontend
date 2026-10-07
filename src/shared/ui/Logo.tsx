/* eslint-disable @next/next/no-img-element -- 24px 정적 로고라 next/image 최적화가 필요 없다. */

/**
 * 지무위키 로고 마크.
 * 원본 G가 검은색이라 다크 모드에선 밝게 바꾼 이미지를 쓰고, 모드에 따라 CSS로 교체한다.
 */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <>
      <img
        src="/logo-dark.png"
        alt=""
        width={size}
        height={size}
        className="flex-shrink-0 light:hidden"
      />
      <img
        src="/logo-light.png"
        alt=""
        width={size}
        height={size}
        className="hidden flex-shrink-0 light:block"
      />
    </>
  );
}

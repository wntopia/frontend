/** 글자 수 변화의 색 — added(늘어남)·removed(줄어듦)·neutral(그대로) */
export type CharDeltaTone = "added" | "removed" | "neutral";

/**
 * 리비전 1은 '문서 생성'이다. 다만 백엔드는 문서를 만들 때가 아니라 **첫 수정 때** 생성 시점 내용을 리비전 1로
 * 기록하고, 편집자와 시각도 그 첫 수정의 것으로 남긴다. 그래서 리비전 1은 편집자 이름 없이 그리고 시각은 문서의
 * `createdAt`을 쓴다. 한 번도 수정되지 않은 문서는 리비전 목록이 비어 있다.
 */
export const CREATION_REVISION = 1;

/**
 * 직전 리비전 대비 글자 수 변화를 `+412자` · `−12자` · `±0자`로 적는다.
 * 이 값을 기록하기 전에 남은 리비전은 `null`이라, 0과 구분해 아무것도 표시하지 않는다.
 */
export function describeCharDelta(
  charDelta: number | null,
): { text: string; tone: CharDeltaTone } | null {
  if (charDelta === null) return null;
  if (charDelta === 0) return { text: "±0자", tone: "neutral" };

  const amount = Math.abs(charDelta).toLocaleString("ko-KR");
  return charDelta > 0
    ? { text: `+${amount}자`, tone: "added" }
    : { text: `−${amount}자`, tone: "removed" };
}

const HANGUL_FIRST = 0xac00;
const HANGUL_LAST = 0xd7a3;
/** 한글 음절은 (초성 × 21 + 중성) × 28 + 종성 순으로 놓여 있어, 28로 나눈 나머지가 받침이다. */
const FINAL_CONSONANT_COUNT = 28;

/**
 * 낱말 뒤에 붙일 주격 조사. 이름처럼 값이 정해지지 않은 낱말 뒤에서 '이'/'가'를 고르는 데 쓴다.
 * 마지막 글자가 한글이 아니면 받침을 알 수 없어 `이(가)`를 돌려준다.
 */
export function subjectParticle(word: string): "이" | "가" | "이(가)" {
  const trimmed = word.trimEnd();
  // 한글 음절은 BMP 안에 있어 마지막 코드 유닛만 보면 된다.
  const last = trimmed.charCodeAt(trimmed.length - 1);
  if (Number.isNaN(last) || last < HANGUL_FIRST || last > HANGUL_LAST) {
    return "이(가)";
  }
  return (last - HANGUL_FIRST) % FINAL_CONSONANT_COUNT === 0 ? "가" : "이";
}

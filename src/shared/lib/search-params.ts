/** Next가 page에 넘기는 `searchParams`를 풀었을 때의 모양 */
export type SearchParams = Record<string, string | string[] | undefined>;

/** 같은 이름이 여러 번 온 쿼리(`?q=a&q=b`)는 배열로 오므로 첫 값만 쓴다. */
export function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

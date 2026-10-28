/** 한 번의 입력이 바꾼 구간. `index`부터 `removed`글자를 지우고 그 자리에 `inserted`를 넣는다 */
export type TextChange = {
  index: number;
  removed: number;
  inserted: string;
};

/** `Y.Text` 변경 이벤트의 delta 한 조각 */
type DeltaOp = {
  insert?: string | object | unknown[];
  retain?: number;
  delete?: number;
};

/**
 * textarea의 값이 `previous`에서 `next`로 바뀐 구간을 찾는다. 바뀐 게 없으면 `null`.
 *
 * 입력 이벤트는 바뀐 결과만 주므로 앞뒤로 같은 부분을 걷어 낸다. 같은 글자가 이어진 곳("aa"에 "a"를 넣기)은
 * 어디가 바뀌었는지 글자만으로는 알 수 없어 입력 직후의 커서(`cursor`, 보통 넣은 글자 바로 뒤)를 기준으로 삼는다.
 * 다른 사람의 편집과 합칠 때 넣은 위치가 실제로 입력한 자리여야 글자가 엉뚱한 곳에 붙지 않기 때문이다.
 */
export function diffText(
  previous: string,
  next: string,
  cursor: number = next.length,
): TextChange | null {
  if (previous === next) return null;

  // 커서 앞의 늘어난 글자 수만큼은 새로 넣은 글자이므로, 같은 앞부분을 그보다 길게 잡지 않는다.
  const grown = Math.max(0, next.length - previous.length);
  const prefixLimit = Math.max(
    0,
    Math.min(previous.length, next.length, cursor - grown),
  );
  let start = 0;
  while (start < prefixLimit && previous[start] === next[start]) start++;

  let previousEnd = previous.length;
  let nextEnd = next.length;
  while (
    previousEnd > start &&
    nextEnd > start &&
    previous[previousEnd - 1] === next[nextEnd - 1]
  ) {
    previousEnd--;
    nextEnd--;
  }

  // 이모지처럼 두 칸(서로게이트 쌍)으로 된 글자를 반으로 가르지 않는다. 반쪽 글자는 Yjs가 UTF-8로 보낼 때 깨진다.
  if (start > 0 && isHighSurrogate(previous.charCodeAt(start - 1))) start--;
  if (nextEnd < next.length && isLowSurrogate(next.charCodeAt(nextEnd))) {
    nextEnd++;
    previousEnd++;
  }

  return {
    index: start,
    removed: previousEnd - start,
    inserted: next.slice(start, nextEnd),
  };
}

/**
 * 다른 사람의 변경(`delta`)이 들어온 뒤 내 커서가 있어야 할 위치. 커서보다 앞에 글자가 들어오거나 빠진 만큼 옮기고,
 * 커서 바로 그 자리에 들어온 글자는 커서 뒤에 둔다 — 내가 이어 치는 글자가 남의 글자 사이에 끼지 않게 한다.
 */
export function transformIndex(index: number, delta: DeltaOp[]): number {
  let position = 0;
  let shift = 0;
  for (const op of delta) {
    if (position > index) break;
    if (op.retain !== undefined) {
      position += op.retain;
    } else if (op.delete !== undefined) {
      if (position < index) shift -= Math.min(op.delete, index - position);
      position += op.delete;
    } else if (op.insert !== undefined && position < index) {
      shift += typeof op.insert === "string" ? op.insert.length : 1;
    }
  }
  return Math.max(0, index + shift);
}

function isHighSurrogate(code: number) {
  return code >= 0xd800 && code <= 0xdbff;
}

function isLowSurrogate(code: number) {
  return code >= 0xdc00 && code <= 0xdfff;
}

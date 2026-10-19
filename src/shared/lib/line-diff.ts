/** 줄 단위 비교 결과의 한 덩어리. 같은 종류의 줄이 이어지면 한 덩어리로 묶는다. */
export type LineDiffChunk = {
  type: "equal" | "removed" | "added";
  lines: string[];
};

export type LineDiff = {
  /** 앞 글의 줄을 위에서부터 따라가며 지운 줄·더한 줄·그대로인 줄을 차례로 놓은 것 */
  chunks: LineDiffChunk[];
  /**
   * `false`면 계산량 상한에 걸려 최소 차이를 찾지 못한 결과다. 앞뒤의 같은 줄 사이 구간 전체를 지우고
   * 다시 쓴 것으로 돌려주므로 틀리지는 않지만, 그 구간 안에서 그대로인 줄도 지운 줄·더한 줄로 보인다.
   */
  exact: boolean;
};

type DiffLinesOptions = {
  /** 계산량 상한. 아래 `DEFAULT_MAX_WORK` 참고 */
  maxWork?: number;
};

/** 위키 파서(`parseWikiText`)와 같은 줄 구분 — 줄바꿈 문자만 다른 줄은 같은 줄로 본다. */
const LINE_BREAK = /\r\n|\r|\n/;

/**
 * 계산량 상한. 알고리즘이 대각선 하나를 넓히거나 같은 줄 하나를 건널 때마다 1씩 센다.
 *
 * Myers 알고리즘은 지우고 더한 줄 수를 D라 할 때 대략 D²/2만큼 일하고, 되짚어 가려고 그만큼 위치를 기록해 둔다.
 * 브라우저 메인 스레드에서 돌기 때문에 상한이 없으면 대부분 바뀐 긴 문서에서 화면이 멈춘다.
 * 걸리는 시간은 이 값에 비례한다. 개발 PC의 Chrome에서 상한까지 가는 데 10ms 안팎, CPU를 4배 느리게 해도
 * 긴 작업 기준(50ms) 안쪽이 되도록 정했다. 지운 줄과 더한 줄이 합쳐 1,000줄 가까이 될 때까지는 최소 차이를 찾는다.
 * 그보다 많이 바뀐 문서는 어차피 대부분의 줄이 바뀐 것이라, 통째로 지우고 더한 것으로 보여도 잃는 정보가 적다.
 */
const DEFAULT_MAX_WORK = 500_000;

const EQUAL = 0;
const REMOVED = 1;
const ADDED = 2;
type EditOp = typeof EQUAL | typeof REMOVED | typeof ADDED;

/**
 * 두 글을 줄 단위로 비교한다. 지운 줄이 더한 줄보다 먼저 오도록 바뀐 구간마다 정리해 돌려준다.
 *
 * 빈 글은 줄이 없는 것으로 본다(`""`를 나누면 빈 줄 하나가 되지만, 그러면 문서를 처음 쓸 때 빈 줄을 지운 것처럼 보인다).
 */
export function diffLines(
  before: string,
  after: string,
  { maxWork = DEFAULT_MAX_WORK }: DiffLinesOptions = {},
): LineDiff {
  const a = toLines(before);
  const b = toLines(after);

  // 위키 편집은 대개 한두 곳만 고친다. 앞뒤의 같은 줄을 먼저 떼어 내면 가운데 짧은 구간만 비교하면 된다.
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start++;
  }
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }

  const chunks = new ChunkList();
  chunks.push("equal", a.slice(0, start));

  const [idsA, idsB] = internLines(a, start, endA, b, start, endB);
  const ops = shortestEditScript(idsA, idsB, maxWork);
  if (ops === null) {
    chunks.push("removed", a.slice(start, endA));
    chunks.push("added", b.slice(start, endB));
  } else {
    pushEditScript(chunks, ops, a, start, b, start);
  }

  chunks.push("equal", a.slice(endA));
  return { chunks: chunks.items, exact: ops !== null };
}

function toLines(text: string): string[] {
  return text === "" ? [] : text.split(LINE_BREAK);
}

/** 줄을 정수로 바꿔 둔다. 비교가 문자열 대신 정수 비교가 되어, 긴 문단이 많은 문서에서도 빠르다. */
function internLines(
  a: string[],
  startA: number,
  endA: number,
  b: string[],
  startB: number,
  endB: number,
): [Int32Array, Int32Array] {
  const ids = new Map<string, number>();
  const toIds = (lines: string[], from: number, to: number) => {
    const out = new Int32Array(to - from);
    for (let index = from; index < to; index++) {
      let id = ids.get(lines[index]);
      if (id === undefined) {
        id = ids.size;
        ids.set(lines[index], id);
      }
      out[index - from] = id;
    }
    return out;
  };
  return [toIds(a, startA, endA), toIds(b, startB, endB)];
}

/**
 * Myers(1986)의 O(ND) 알고리즘으로 최단 편집 경로를 찾는다. 상한을 넘으면 `null`.
 *
 * 단계 d마다 대각선 k(= x − y)별로 가장 멀리 간 x를 기록해 두었다가, 끝에서 거꾸로 되짚어 연산 열을 만든다.
 * 단계 d의 기록은 k = −d, −d+2, …, d의 d+1칸이다.
 */
function shortestEditScript(
  a: Int32Array,
  b: Int32Array,
  maxWork: number,
): EditOp[] | null {
  const n = a.length;
  const m = b.length;
  if (n === 0 || m === 0) {
    return [
      ...Array<EditOp>(n).fill(REMOVED),
      ...Array<EditOp>(m).fill(ADDED),
    ];
  }

  const offset = n + m + 1;
  // frontier[offset + k]: 직전 단계까지 대각선 k에서 가장 멀리 간 x. k = 1의 0이 출발점(0, 0)을 만든다.
  const frontier = new Int32Array(2 * offset + 1);
  const trace: Int32Array[] = [];
  let work = 0;

  for (let d = 0; d <= n + m; d++) {
    const row = new Int32Array(d + 1);
    trace.push(row);

    for (let k = -d; k <= d; k += 2) {
      // 위 대각선에서 내려오면 b의 줄을 더한 것이고, 아래 대각선에서 오른쪽으로 오면 a의 줄을 지운 것이다.
      const down =
        k === -d ||
        (k !== d && frontier[offset + k - 1] < frontier[offset + k + 1]);
      let x = down ? frontier[offset + k + 1] : frontier[offset + k - 1] + 1;
      let y = x - k;
      const snakeStart = x;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      work += 1 + x - snakeStart;

      frontier[offset + k] = x;
      row[(k + d) >> 1] = x;
      if (x >= n && y >= m) return backtrack(trace, n, m);
      // 한 단계 안에서도 같은 줄을 건너는 일이 길어질 수 있어 대각선마다 확인한다.
      if (work > maxWork) return null;
    }
  }
  return null;
}

function backtrack(trace: Int32Array[], n: number, m: number): EditOp[] {
  const ops: EditOp[] = [];
  let x = n;
  let y = m;

  for (let d = trace.length - 1; d > 0; d--) {
    const previous = trace[d - 1];
    // 단계 d−1의 기록에서 대각선 k의 칸
    const reachedX = (k: number) => previous[(k + d - 1) >> 1];
    const k = x - y;
    const down = k === -d || (k !== d && reachedX(k - 1) < reachedX(k + 1));
    const previousK = down ? k + 1 : k - 1;
    const previousX = reachedX(previousK);
    const previousY = previousX - previousK;

    while (x > previousX && y > previousY) {
      ops.push(EQUAL);
      x--;
      y--;
    }
    ops.push(down ? ADDED : REMOVED);
    x = previousX;
    y = previousY;
  }
  while (x > 0 && y > 0) {
    ops.push(EQUAL);
    x--;
    y--;
  }
  return ops.reverse();
}

/**
 * 연산 열을 덩어리로 묶는다. 같은 줄 사이의 바뀐 구간은 지운 줄을 모두 먼저, 더한 줄을 뒤에 둔다 —
 * 경로에 따라 지움과 더함이 번갈아 나오는데, 그대로 두면 한 문단을 고친 것이 줄마다 잘게 갈라져 읽기 어렵다.
 */
function pushEditScript(
  chunks: ChunkList,
  ops: EditOp[],
  a: string[],
  startA: number,
  b: string[],
  startB: number,
) {
  let indexA = startA;
  let indexB = startB;
  let removed: string[] = [];
  let added: string[] = [];

  const flushChange = () => {
    chunks.push("removed", removed);
    chunks.push("added", added);
    removed = [];
    added = [];
  };

  for (const op of ops) {
    if (op === EQUAL) {
      flushChange();
      chunks.push("equal", [a[indexA]]);
      indexA++;
      indexB++;
    } else if (op === REMOVED) {
      removed.push(a[indexA++]);
    } else {
      added.push(b[indexB++]);
    }
  }
  flushChange();
}

/** 같은 종류가 이어지면 앞 덩어리에 붙이고, 빈 덩어리는 버린다. */
class ChunkList {
  readonly items: LineDiffChunk[] = [];

  push(type: LineDiffChunk["type"], lines: string[]) {
    if (lines.length === 0) return;
    const last = this.items.at(-1);
    if (last?.type === type) {
      last.lines.push(...lines);
    } else {
      this.items.push({ type, lines: [...lines] });
    }
  }
}

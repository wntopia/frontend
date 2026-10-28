import * as Y from "yjs";
import type { Awareness } from "y-protocols/awareness";

/**
 * 접속자 색 팔레트의 칸 수. 색 값은 `globals.css`의 `--presence-1` ~ `--presence-8`에 있다.
 * 다른 사람에게는 색 값이 아니라 칸 번호를 보낸다 — 받는 사람의 라이트·다크 모드에 맞는 색으로 그리기 위해서다.
 */
export const PRESENCE_COLOR_COUNT = 8;

/**
 * 나를 다른 사람에게 알리는 정보. `key`는 같은 사람의 여러 탭을 한 명으로 묶는 계정 식별자(DataGSM 계정 id)다.
 * 백엔드의 현재 편집자 API도 같은 기준(계정 id)으로 묶어, 편집 화면과 문서 화면의 사람 수가 어긋나지 않는다.
 */
export type PresenceUser = {
  key: string | null;
  name: string;
};

/** awareness에 싣는 사용자 정보. `color`는 팔레트 칸 번호(0부터)다 */
type PresenceUserState = PresenceUser & { color: number };

/**
 * awareness에 싣는 커서. textarea 위치(숫자)가 아니라 Yjs 상대 위치(JSON)를 보낸다. 받는 사이에 누가 앞쪽에 글자를
 * 넣어도 상대 위치는 같은 글자에 붙어 있어, 받는 쪽이 자기 문서 기준으로 바꾸면 커서가 엉뚱한 글자로 밀리지 않는다.
 */
export type PresenceCursorState = {
  anchor: unknown;
  head: unknown;
};

/** 화면에 그릴 다른 접속 하나(탭 하나). 같은 사람이 탭을 여럿 열면 접속도 여럿이다 */
export type PresencePeer = {
  clientId: number;
  user: PresenceUser;
  color: number;
  /** 내 계정의 다른 탭 */
  self: boolean;
  cursor: PresenceCursorState | null;
};

/** 상단 바에 그릴 다른 사람 한 명. 같은 계정의 탭들을 묶었다 */
export type PresenceParticipant = {
  key: string;
  name: string;
  color: number;
  tabs: number;
};

/**
 * 사용자의 색 칸. 계정 식별자에서 결정적으로 고른다 — 누구의 화면에서든, 다시 들어와도, 탭을 여럿 열어도 같은 사람은
 * 같은 색이다. 식별자가 없으면 접속(clientID)마다 고른다. 칸이 여덟뿐이라 두 사람이 같은 색일 수 있는데, 그래도 이름표와
 * 상단 바의 이름으로 가를 수 있어 접속자끼리 색을 나눠 갖는 조율(모두가 같은 결과를 내야 한다)은 하지 않았다.
 */
export function pickPresenceColor(
  key: string | null,
  clientId: number,
): number {
  if (key === null) return clientId % PRESENCE_COLOR_COUNT;
  // FNV-1a. 연속된 계정 id(1, 2, 3…)도 고르게 흩어지게 한 번 섞는다.
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % PRESENCE_COLOR_COUNT;
}

/** 색 칸을 그 색의 CSS 변수로. 컴포넌트는 이 값을 `--presence`에 넣고 `bg-(--presence)`처럼 쓴다 */
export function presenceColorVar(color: number): string {
  return `var(--presence-${(color % PRESENCE_COLOR_COUNT) + 1})`;
}

/** 내 정보를 awareness에 싣는다. provider가 상태를 바꿀 때마다 방에 보낸다 */
export function publishPresenceUser(
  awareness: Awareness,
  user: PresenceUser,
): void {
  const state: PresenceUserState = {
    ...user,
    color: pickPresenceColor(user.key, awareness.clientID),
  };
  awareness.setLocalStateField("user", state);
}

/** 지금 textarea 선택 구간을 상대 위치로 바꾼다. 같은 커서면 같은 JSON이 나와 보낼지 말지를 문자열로 비교할 수 있다 */
export function toCursorState(
  text: Y.Text,
  anchor: number,
  head: number,
): PresenceCursorState {
  return {
    anchor: Y.relativePositionToJSON(
      Y.createRelativePositionFromTypeIndex(text, anchor),
    ),
    head: Y.relativePositionToJSON(
      Y.createRelativePositionFromTypeIndex(text, head),
    ),
  };
}

/**
 * 받은 상대 위치를 내 문서의 위치로 바꾼다. 아직 받지 못한 글자를 가리키거나(커서가 update보다 먼저 왔다) 깨진 값이면
 * `null` — 다음 변경 때 다시 바꿔 본다.
 */
export function toAbsoluteIndex(
  doc: Y.Doc,
  text: Y.Text,
  relative: unknown,
): number | null {
  if (typeof relative !== "object" || relative === null) return null;
  try {
    const absolute = Y.createAbsolutePositionFromRelativePosition(
      Y.createRelativePositionFromJSON(relative),
      doc,
    );
    return absolute && absolute.type === text ? absolute.index : null;
  } catch {
    return null;
  }
}

/**
 * awareness의 다른 접속을 화면에 그릴 모양으로 읽는다. 백엔드는 awareness를 해석하지 않고 릴레이만 하므로 무엇이든
 * 올 수 있다. 모양이 맞지 않는 필드는 없는 것으로 보고, 이름이 없는 접속(아직 사용자 정보를 싣기 전)은 빼낸다.
 */
export function readPresencePeers(
  awareness: Awareness,
  me: PresenceUser,
): PresencePeer[] {
  const peers: PresencePeer[] = [];
  awareness.getStates().forEach((state, clientId) => {
    if (clientId === awareness.clientID) return;
    const user = readUser(state.user);
    if (!user) return;
    peers.push({
      clientId,
      user: { key: user.key, name: user.name },
      color: user.color ?? pickPresenceColor(user.key, clientId),
      self: me.key !== null && user.key === me.key,
      cursor: readCursor(state.cursor),
    });
  });
  // 그리는 순서가 상태가 올 때마다 바뀌지 않게 고정한다.
  return peers.sort((a, b) => a.clientId - b.clientId);
}

/**
 * 상단 바에 그릴 사람들. 같은 계정의 탭은 한 명으로 묶고 나는 뺀다 — 내 다른 탭도 '함께 편집하는 사람'이 아니다.
 * 계정 식별자가 없는 접속은 묶을 기준이 없어 접속마다 한 명이다.
 */
export function groupParticipants(
  peers: PresencePeer[],
): PresenceParticipant[] {
  const byKey = new Map<string, PresenceParticipant>();
  for (const peer of peers) {
    if (peer.self) continue;
    const key = peer.user.key ?? `client:${peer.clientId}`;
    const existing = byKey.get(key);
    if (existing) existing.tabs++;
    else
      byKey.set(key, {
        key,
        name: peer.user.name,
        color: peer.color,
        tabs: 1,
      });
  }
  return [...byKey.values()];
}

function readUser(
  value: unknown,
): (PresenceUser & { color: number | null }) | null {
  if (typeof value !== "object" || value === null) return null;
  const { key, name, color } = value as Record<string, unknown>;
  if (typeof name !== "string" || name.trim() === "") return null;
  return {
    key: typeof key === "string" ? key : null,
    name: name.trim(),
    color:
      typeof color === "number" && Number.isInteger(color) && color >= 0
        ? color % PRESENCE_COLOR_COUNT
        : null,
  };
}

function readCursor(value: unknown): PresenceCursorState | null {
  if (typeof value !== "object" || value === null) return null;
  const { anchor, head } = value as Record<string, unknown>;
  if (typeof anchor !== "object" || anchor === null) return null;
  if (typeof head !== "object" || head === null) return null;
  return { anchor, head };
}

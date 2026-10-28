import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { Awareness } from "y-protocols/awareness";
import type { CollaborationSnapshot } from "./provider";
import {
  publishPresenceUser,
  readPresencePeers,
  type PresencePeer,
  type PresenceUser,
} from "./presence";

const NO_PEERS: PresencePeer[] = [];
const subscribeNothing = () => () => {};
const getNoPeers = () => NO_PEERS;

type AwarenessChange = {
  added: number[];
  updated: number[];
  removed: number[];
};

/**
 * 나를 방에 알리고(이름 · 색) 다른 접속들을 읽는다. 커서는 textarea가 있을 때만 의미가 있어 `PresenceCursors`가 싣는다.
 *
 * awareness는 provider가 연결을 시작할 때 만들고 멈출 때 없앤다(StrictMode에서는 한 번 바뀐다). 그래서 스냅샷의
 * awareness가 바뀔 때마다 내 정보를 다시 싣고 다시 구독한다. 접속할 때 provider가 로컬 상태 전체를 보내므로, 연결 전에
 * 실어 둔 정보도 다른 사람에게 간다.
 *
 * `me`는 그릴 때마다 새로 만들지 않은 값을 넘긴다. 바뀌면 다시 싣고 다시 구독한다.
 */
export function usePresence(
  snapshot: CollaborationSnapshot,
  me: PresenceUser | null,
): PresencePeer[] {
  const awareness = snapshot.awareness;

  useEffect(() => {
    if (awareness && me) publishPresenceUser(awareness, me);
  }, [awareness, me]);

  const store = useMemo(
    () => (awareness && me ? createPeerStore(awareness, me) : null),
    [awareness, me],
  );

  return useSyncExternalStore(
    store?.subscribe ?? subscribeNothing,
    store?.getSnapshot ?? getNoPeers,
    getNoPeers,
  );
}

function createPeerStore(awareness: Awareness, me: PresenceUser) {
  let peers = readPresencePeers(awareness, me);
  return {
    subscribe(listener: () => void) {
      const onChange = ({ added, updated, removed }: AwarenessChange) => {
        // 내 커서가 움직일 때마다 화면 전체를 다시 그리지 않도록 내 상태만 바뀐 변경은 건너뛴다.
        const others = [...added, ...updated, ...removed].some(
          (clientId) => clientId !== awareness.clientID,
        );
        if (!others) return;
        peers = readPresencePeers(awareness, me);
        listener();
      };
      awareness.on("change", onChange);
      // 구독하기 전(첫 렌더와 effect 사이)에 바뀐 것도 놓치지 않는다.
      const latest = readPresencePeers(awareness, me);
      if (!samePeers(latest, peers)) {
        peers = latest;
        listener();
      }
      return () => awareness.off("change", onChange);
    },
    getSnapshot: () => peers,
  };
}

function samePeers(a: PresencePeer[], b: PresencePeer[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

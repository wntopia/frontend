import * as Y from "yjs";

/** 본문을 담는 `Y.Text`의 이름. 백엔드에 저장되는 스냅샷(`sync`)도 이 이름으로 읽히므로 바꾸지 않는다. */
export const TEXT_NAME = "content";

/**
 * 줄바꿈을 LF로 맞춘다. 웹에서 multipart로 저장된 본문은 CRLF로 오는데(#41), textarea는 값을 CRLF로 넣어도
 * LF로 돌려준다. 그대로 `Y.Text`에 넣으면 문서 위치와 textarea 위치가 줄마다 어긋난다.
 */
export function normalizeLineBreaks(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

/**
 * 진행 중인 편집 상태가 없을 때 본문(`content`)으로 Yjs 문서를 처음 채우는 update를 만든다.
 *
 * 두 사람이 거의 동시에 들어와 각자 `content`로 문서를 채우면, 보통의 Yjs 삽입은 넣은 사람(clientID)이 달라
 * 서로 다른 글자로 취급되어 합치면 본문이 두 번 들어간다. 백엔드는 이 경합을 막지 않는다 — 진행 중 상태가 없으면
 * 접속한 모두에게 `content`를 준다. 그래서 채우는 쪽을 결정적으로 만든다. 본문에서 구한 고정 clientID로 빈 문서에
 * 넣으면 같은 본문은 누가 만들어도 바이트까지 같은 update가 되고, Yjs는 같은 id의 글자를 하나로 합친다.
 *
 * clientID를 본문의 해시로 정해, 그사이 본문이 바뀌어 서로 다른 본문으로 채운 경우에는 id가 달라진다. 이때는 두 번
 * 들어가지만, 같은 id에 다른 글자가 붙어 문서가 깨지는 것보다 낫다. 이 경우는 provider가 재접속에서 따로 다룬다.
 */
export function createSeedUpdate(content: string): Uint8Array {
  const seed = new Y.Doc();
  seed.clientID = hashContent(content);
  seed.getText(TEXT_NAME).insert(0, content);
  const update = Y.encodeStateAsUpdate(seed);
  seed.destroy();
  return update;
}

/**
 * FNV-1a(32비트). Yjs가 clientID로 쓰는 범위(부호 없는 32비트 정수)에 맞춘다.
 * 보안용이 아니라 같은 본문이면 같은 값, 다른 본문이면 거의 확실히 다른 값이면 된다.
 */
function hashContent(content: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index++) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

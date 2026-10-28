/**
 * 바이트와 base64 문자열을 오간다. 백엔드(`java.util.Base64`의 기본 인코더)와 같은 표준 알파벳 · 패딩을 쓴다.
 *
 * `String.fromCharCode(...bytes)`를 한 번에 부르면 큰 배열에서 인자 개수 한도를 넘으므로 나눠서 넘긴다.
 */
const CHUNK_SIZE = 0x8000;

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let start = 0; start < bytes.length; start += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(start, start + CHUNK_SIZE));
  }
  return btoa(binary);
}

/** 올바른 base64가 아니면 `atob`이 던지는 에러가 그대로 올라온다. */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

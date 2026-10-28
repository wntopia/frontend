import { API_PATHS, toWebSocketUrl } from "@/shared/api";

/**
 * 문서의 공동편집 방에 들어가는 WebSocket을 연다. 브라우저에서만 부른다.
 *
 * 같은 오리진의 프록시 경로로 열어야 세션 쿠키가 핸드셰이크에 실린다. 쿠키가 없으면 백엔드가 401로 거절하는데,
 * 브라우저는 그 상태 코드를 알려 주지 않고 `close`(1006)만 준다. 그래서 거절 사유는 연결을 쓰는 쪽이 따로 알아낸다.
 */
export function openCollaborationSocket(articleId: number): WebSocket {
  return new WebSocket(
    toWebSocketUrl(API_PATHS.articleCollaboration(articleId)),
  );
}

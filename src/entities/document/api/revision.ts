import {
  API_PATHS,
  apiFetch,
  type ArticleRevisionResDto,
} from "@/shared/api";

/**
 * 특정 리비전 시점의 문서를 조회한다. 없는 문서이거나 범위를 벗어난 리비전이면 404 `ApiError`를 던진다.
 *
 * 리비전 N의 `content`는 N번째 수정 직후의 본문이고, 리비전 1은 문서를 만들 때의 본문이다(`CREATION_REVISION`).
 * 문서 조회(`fetchArticle`)와 달리 조회수를 세지 않는다.
 */
export function fetchArticleRevision(
  articleId: number,
  revision: number,
  fetcher: typeof apiFetch = apiFetch,
): Promise<ArticleRevisionResDto> {
  return fetcher<ArticleRevisionResDto>(
    API_PATHS.articleRevision(articleId, revision),
  );
}

/**
 * 브라우저에 담아 두는 리비전 수. 본문이 통째로 들어 있어, 편집 역사를 오래 훑어도 메모리가 계속 늘지 않게
 * 가장 오래 쓰지 않은 것부터 버린다.
 */
const MAX_CACHED_REVISIONS = 50;

/** 같은 리비전을 여러 카드가 동시에 불러도 요청이 한 번만 가도록 결과가 아니라 요청을 담는다. */
const revisionRequests = new Map<string, Promise<ArticleRevisionResDto>>();

/**
 * 브라우저에서 리비전을 조회한다. 과거 리비전은 내용이 바뀌지 않으므로 한 번 받은 것은 다시 요청하지 않는다.
 *
 * `latest: true`인 리비전은 담아 두지 않는다. 다음 수정이 생기면 `latest`가 달라지기 때문이다 — 백엔드도 같은
 * 이유로 최신 리비전은 캐시하지 않는다. 실패한 요청도 지워서 다시 시도하면 새로 요청한다.
 */
export function loadArticleRevision(
  articleId: number,
  revision: number,
): Promise<ArticleRevisionResDto> {
  // 서버에서는 이 모듈이 요청 사이에 살아 있어, 담아 두면 메모리가 줄지 않는다.
  if (typeof window === "undefined") {
    return fetchArticleRevision(articleId, revision);
  }

  const key = `${articleId}:${revision}`;
  const cached = revisionRequests.get(key);
  if (cached) {
    // 다시 넣어 맨 뒤로 보낸다. Map은 넣은 순서를 지키므로 맨 앞이 가장 오래 쓰지 않은 것이 된다.
    revisionRequests.delete(key);
    revisionRequests.set(key, cached);
    return cached;
  }

  const forget = () => {
    // 그사이 밀려났다가 같은 리비전을 다시 요청했을 수 있어, 이 요청이 담겨 있을 때만 지운다.
    if (revisionRequests.get(key) === request) revisionRequests.delete(key);
  };
  const request = fetchArticleRevision(articleId, revision).then(
    (result) => {
      if (result.latest) forget();
      return result;
    },
    (error: unknown) => {
      forget();
      throw error;
    },
  );

  revisionRequests.set(key, request);
  if (revisionRequests.size > MAX_CACHED_REVISIONS) {
    const oldest = revisionRequests.keys().next();
    if (!oldest.done) revisionRequests.delete(oldest.value);
  }
  return request;
}

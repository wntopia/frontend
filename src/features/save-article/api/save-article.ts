import {
  API_PATHS,
  apiFetch,
  type ArticleResDto,
  type CreateArticleReqDto,
  type UpdateArticleReqDto,
} from "@/shared/api";

/**
 * 새 문서를 만든다. 같은 제목의 문서가 이미 있으면 409 `ApiError`를 던진다.
 *
 * 백엔드는 비로그인 생성도 받지만, 화면이 로그인을 요구해 만든 사람이 기여 통계에 남게 한다.
 */
export function createArticle(
  req: CreateArticleReqDto,
): Promise<ArticleResDto> {
  return apiFetch<ArticleResDto>(API_PATHS.articles, {
    method: "POST",
    body: toFormData(req),
  });
}

/**
 * 문서 본문을 바꾸고, 이미지를 주면 대표 이미지도 바꾼다.
 * 비로그인이거나 `student`가 없는 계정이면 401, 없는 문서면 404 `ApiError`를 던진다.
 */
export function updateArticle(
  articleId: number,
  req: UpdateArticleReqDto,
): Promise<ArticleResDto> {
  return apiFetch<ArticleResDto>(API_PATHS.article(articleId), {
    method: "PUT",
    body: toFormData(req),
  });
}

/**
 * 요청 DTO를 multipart 본문으로 옮긴다. 값이 없는 필드는 싣지 않아 백엔드가 기본값(이미지 유지 등)을 쓰게 한다.
 * Content-Type은 fetch가 boundary와 함께 붙이므로 여기서도 `apiFetch`에서도 정하지 않는다.
 */
function toFormData(
  fields: Record<string, string | number | boolean | File | undefined>,
): FormData {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    form.append(name, value instanceof File ? value : String(value));
  }
  return form;
}

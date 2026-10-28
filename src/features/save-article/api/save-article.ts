import {
  API_PATHS,
  apiFetch,
  type ArticleResDto,
  type CreateArticleReqDto,
  type UpdateArticleImageReqDto,
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
 * 기존 문서의 대표 이미지만 바꾼다. 본문은 공동편집 WebSocket으로 따로 저장한다.
 * 비로그인이거나 `student`가 없는 계정이면 401, 없는 문서면 404, 이미지 저장소에 올리지 못하면 502 `ApiError`를 던진다.
 */
export function updateArticleImage(
  articleId: number,
  req: UpdateArticleImageReqDto,
): Promise<ArticleResDto> {
  return apiFetch<ArticleResDto>(API_PATHS.articleImage(articleId), {
    method: "PATCH",
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

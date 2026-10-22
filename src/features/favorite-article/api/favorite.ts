import { API_PATHS, apiFetch, type FavoriteStatusResDto } from "@/shared/api";

/** 문서가 내 즐겨찾기에 들어 있는지. 비로그인이면 백엔드가 401 대신 `false`를 준다. */
export async function fetchFavoriteStatus(articleId: number): Promise<boolean> {
  const { favorited } = await apiFetch<FavoriteStatusResDto>(
    API_PATHS.articleFavorite(articleId),
  );
  return favorited;
}

/** 즐겨찾기에 추가한다. 이미 들어 있어도 성공한다. 없는 문서면 404 `ApiError`를 던진다. */
export function addFavorite(articleId: number): Promise<void> {
  return apiFetch<void>(API_PATHS.articleFavorite(articleId), {
    method: "PUT",
  });
}

/** 즐겨찾기에서 해제한다. 원래 없었어도 성공한다. */
export function removeFavorite(articleId: number): Promise<void> {
  return apiFetch<void>(API_PATHS.articleFavorite(articleId), {
    method: "DELETE",
  });
}

import {
  API_PATHS,
  apiFetch,
  type CategoryListItemResDto,
} from "@/shared/api";

/** 분류 전체를 이름 순으로, 분류마다 속한 문서 수와 함께 조회한다. */
export function fetchCategories(
  fetcher: typeof apiFetch = apiFetch,
): Promise<CategoryListItemResDto[]> {
  return fetcher<CategoryListItemResDto[]>(API_PATHS.categories);
}

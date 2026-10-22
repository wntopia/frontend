import {
  API_PATHS,
  apiFetch,
  type LookupArticleTitlesReqDto,
  type LookupArticleTitlesResDto,
} from "@/shared/api";

/**
 * 이 제목의 문서가 이미 있는지. 문서를 만들 때 겹침을 가리는 규칙(앞뒤·연속 공백, 유니코드 정규화,
 * 대소문자)을 백엔드가 그대로 적용하므로, 프론트에서 제목을 비교하지 않고 묻는다.
 */
export async function articleTitleExists(title: string): Promise<boolean> {
  const body: LookupArticleTitlesReqDto = { titles: [title] };
  const { items } = await apiFetch<LookupArticleTitlesResDto>(
    API_PATHS.articleTitlesLookup,
    { method: "POST", body },
  );
  return items[0]?.exists ?? false;
}

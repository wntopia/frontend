import {
  API_PATHS,
  apiFetch,
  type LookupArticleTitlesReqDto,
  type LookupArticleTitlesResDto,
} from "@/shared/api";
import type { WikiLinkTargets } from "../model/link-targets";

/** 백엔드가 한 번에 받는 제목 수. 넘기면 요청 전체가 400이다. */
const LOOKUP_BATCH_SIZE = 200;

/**
 * 한 본문에서 확인하는 링크 대상의 상한. 링크가 아주 많은 문서 하나를 열 때마다 요청이 끝없이 늘지 않게 한다.
 * 넘는 대상은 판정하지 않은 채로 두며, 그래도 누르면 제대로 찾아간다 (`WikiContent` 참고).
 */
const MAX_RESOLVED_TARGETS = LOOKUP_BATCH_SIZE * 5;

/**
 * 제목마다 문서가 있는지와 그 id를 요청 순서대로 받는다. 로그인과 상관없는 조회라 서버에서도 쿠키 없이 부른다.
 *
 * 문서를 만들 때 겹침을 가리는 규칙(앞뒤·연속 공백, 유니코드 정규화, 대소문자)을 백엔드가 그대로 적용하므로,
 * 프론트에서 제목을 비교하지 않고 묻는다.
 */
async function lookupArticleTitles(
  titles: string[],
): Promise<LookupArticleTitlesResDto["items"]> {
  const body: LookupArticleTitlesReqDto = { titles };
  const { items } = await apiFetch<LookupArticleTitlesResDto>(
    API_PATHS.articleTitlesLookup,
    { method: "POST", body },
  );
  return items;
}

/** 이 제목의 문서 id. 없으면 `null`이다. */
export async function findArticleIdByTitle(
  title: string,
): Promise<number | null> {
  const [item] = await lookupArticleTitles([title]);
  return item?.exists ? item.id : null;
}

/** 이 제목의 문서가 이미 있는지 */
export async function articleTitleExists(title: string): Promise<boolean> {
  return (await findArticleIdByTitle(title)) !== null;
}

/**
 * 본문의 링크 대상들이 가리키는 문서를 한 번에 확인한다.
 *
 * 실패해도 던지지 않는다. 링크 색을 정하는 데만 쓰는 보조 조회라 본문은 그대로 보여야 하므로, 확인하지 못한
 * 대상은 결과에서 빠진 채('판정 불가')로 돌려준다. 200개씩 나눈 묶음마다 따로 성패를 받아, 한 묶음이 실패해도
 * 나머지 판정은 살린다.
 */
export async function resolveLinkTargets(
  titles: readonly string[],
): Promise<WikiLinkTargets> {
  const targets = new Map<string, number | null>();
  const unique = [...new Set(titles)].slice(0, MAX_RESOLVED_TARGETS);
  // 빈 목록은 백엔드가 400으로 받는다
  if (unique.length === 0) return targets;

  const batches: string[][] = [];
  for (let start = 0; start < unique.length; start += LOOKUP_BATCH_SIZE) {
    batches.push(unique.slice(start, start + LOOKUP_BATCH_SIZE));
  }

  const results = await Promise.allSettled(batches.map(lookupArticleTitles));
  results.forEach((result, batchIndex) => {
    if (result.status === "rejected") return;
    // 응답은 요청한 순서 그대로 온다
    batches[batchIndex].forEach((title, index) => {
      const item = result.value[index];
      if (item) targets.set(title, item.exists ? item.id : null);
    });
  });

  return targets;
}

import type { Metadata } from "next";
import {
  readArticleId,
  readRevision,
  type RevisionRouteProps,
} from "@/entities/document";
import { getArticleRevision } from "@/entities/document/server";

/** 탭 제목에 문서 제목과 리비전 번호를 싣는다. */
export async function generateRevisionMetadata(
  props: RevisionRouteProps,
): Promise<Metadata> {
  // 화면도 같은 리비전을 읽는다. `getArticleRevision`이 한 번의 렌더링 안에서 호출을 합쳐 주므로 백엔드는 한 번만 불린다.
  const revision = await getArticleRevision(
    await readArticleId(props),
    await readRevision(props),
  );

  return {
    title: `${revision.title} (리비전 ${revision.revision}) · 지무위키`,
    // 지난 본문이 검색 결과에 지금 문서와 나란히 걸리지 않게 한다.
    robots: { index: false },
  };
}

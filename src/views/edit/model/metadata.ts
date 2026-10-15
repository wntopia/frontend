import type { Metadata } from "next";
import { readArticleId, type ArticleRouteProps } from "@/entities/document";
import { EDIT_DOCUMENT } from "./mock";

/** 탭 제목에 편집 중인 문서의 제목을 싣는다. */
export async function generateEditMetadata(
  props: ArticleRouteProps,
): Promise<Metadata> {
  // 아직은 어떤 id든 같은 시안 문서라 id를 쓰지 않지만, 문서가 될 수 없는 주소는 화면과 똑같이 404로 끝낸다.
  await readArticleId(props);

  return { title: `${EDIT_DOCUMENT.title} 편집 · 지무위키` };
}

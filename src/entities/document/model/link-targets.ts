import type { WikiBlock, WikiInline } from "./wiki-syntax";

/**
 * 링크 대상 제목 → 그 제목의 문서 id. 없는 문서는 `null`이고, 확인하지 못한 제목은 들어 있지 않다.
 *
 * '없음'과 '모름'을 가르는 것은 확인하지 못한 링크를 붉게 칠하지 않기 위해서다. 붉은 링크는 문서가 없다는
 * 주장이라, 조회가 실패했을 뿐인 링크에 쓰면 있는 문서를 없다고 알리게 된다.
 */
export type WikiLinkTargets = ReadonlyMap<string, number | null>;

/** 본문의 링크 대상 제목을 처음 나온 순서대로, 겹치지 않게 모은다. */
export function collectLinkTargets(blocks: WikiBlock[]): string[] {
  const targets = new Set<string>();

  const visit = (nodes: WikiInline[]) => {
    for (const node of nodes) {
      if (node.type === "link") targets.add(node.target);
      else if (node.type === "bold") visit(node.children);
    }
  };

  for (const block of blocks) {
    if (block.type === "list") block.items.forEach(visit);
    else visit(block.children);
  }

  return [...targets];
}

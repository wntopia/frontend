/**
 * 위키 문법으로 된 본문을 화면에 그릴 수 있는 구조(블록 → 인라인)로 바꾼다.
 *
 * 지원하는 문법
 *   == 제목 ==            문단 제목. `=` 2~4개가 차례로 h2~h4
 *   [[문서명]]            위키 링크
 *   [[문서명|보일 글자]]   문서명과 다른 글자로 보이는 위키 링크
 *   '''굵게'''            굵은 글씨
 *   * 항목                목록
 *   빈 줄                 문단 구분. 문단 안의 줄바꿈은 그대로 줄바꿈이 된다
 *
 * 문법이 완성되지 않은 입력(닫히지 않은 `[[`, 짝이 맞지 않는 `==`)은 오류로 보지 않고
 * 입력한 글자 그대로 둔다. 편집 중인 본문은 언제나 미완성 상태를 거치기 때문이다.
 */

/** 문장을 이루는 한 조각 */
export type WikiInline =
  | { type: "text"; text: string }
  | { type: "bold"; children: WikiInline[] }
  | {
      type: "link";
      /** 링크가 가리키는 문서 제목 */
      target: string;
      /** 화면에 보이는 글자. `[[문서명|보일 글자]]`가 아니면 target과 같다 */
      label: string;
    }
  | { type: "break" };

export type WikiHeadingLevel = 2 | 3 | 4;

export type WikiBlock =
  | {
      type: "heading";
      level: WikiHeadingLevel;
      /** 목차가 가리키는 앵커. 한 문서 안에서 겹치지 않는다 */
      id: string;
      children: WikiInline[];
    }
  | { type: "paragraph"; children: WikiInline[] }
  | { type: "list"; items: WikiInline[][] };

/** 목차의 한 항목 */
export type TocItem = {
  id: string;
  level: WikiHeadingLevel;
  label: string;
};

const HEADING_MARK = "=";
const MIN_HEADING_LEVEL = 2;
const MAX_HEADING_LEVEL = 4;

const LIST_ITEM = /^\*\s+(.+)$/;

/**
 * 링크 안에는 대괄호를 허용하지 않는다. `[[a [[b]]`처럼 겹쳐 쓴 입력에서 안쪽의
 * 완성된 링크만 잡히고 바깥의 닫히지 않은 `[[`는 글자로 남게 하기 위해서다.
 */
const INLINE_TOKEN = /\[\[([^[\]]+)\]\]|'''(.+?)'''/g;

export function parseWikiText(source: string): WikiBlock[] {
  const blocks: WikiBlock[] = [];
  const toAnchorId = createAnchorIds();
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const closeParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({
      type: "paragraph",
      children: paragraphLines.flatMap((line, index) =>
        index === 0
          ? parseInline(line)
          : [{ type: "break" } as const, ...parseInline(line)],
      ),
    });
    paragraphLines = [];
  };

  const closeList = () => {
    if (listItems.length === 0) return;
    blocks.push({ type: "list", items: listItems.map(parseInline) });
    listItems = [];
  };

  for (const rawLine of source.split(/\r\n|\r|\n/)) {
    const line = rawLine.trim();

    if (line === "") {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = parseHeading(line);
    if (heading) {
      closeParagraph();
      closeList();
      const children = parseInline(heading.text);
      blocks.push({
        type: "heading",
        level: heading.level,
        id: toAnchorId(toPlainText(children)),
        children,
      });
      continue;
    }

    const listItem = LIST_ITEM.exec(line);
    if (listItem) {
      closeParagraph();
      listItems.push(listItem[1]);
      continue;
    }

    closeList();
    paragraphLines.push(line);
  }

  closeParagraph();
  closeList();

  return blocks;
}

/** 본문의 제목을 나온 순서대로 모은다. 렌더러가 그리는 제목의 id와 같은 id를 갖는다. */
export function extractToc(blocks: WikiBlock[]): TocItem[] {
  return blocks.flatMap((block) =>
    block.type === "heading"
      ? [
          {
            id: block.id,
            level: block.level,
            label: toPlainText(block.children),
          },
        ]
      : [],
  );
}

/** 양쪽 `=` 개수가 같은 줄만 제목이다. 개수가 다르면 제목으로 보지 않는다. */
function parseHeading(
  line: string,
): { level: WikiHeadingLevel; text: string } | null {
  let opening = 0;
  while (line[opening] === HEADING_MARK) opening += 1;
  let closing = 0;
  while (line[line.length - 1 - closing] === HEADING_MARK) closing += 1;

  if (opening !== closing) return null;
  if (opening < MIN_HEADING_LEVEL || opening > MAX_HEADING_LEVEL) return null;

  // `====`처럼 `=`만 있는 줄은 앞뒤가 겹쳐 세어져 여기서 빈 문자열이 된다
  const text = line.slice(opening, line.length - closing).trim();
  if (text === "") return null;

  return { level: opening as WikiHeadingLevel, text };
}

/** 링크와 굵은 글씨는 한 줄 안에서만 닫힌다. 닫히지 않은 표시가 다음 줄까지 삼키지 않게 한다. */
function parseInline(text: string): WikiInline[] {
  const nodes: WikiInline[] = [];
  let cursor = 0;

  const pushText = (value: string) => {
    if (value === "") return;
    const last = nodes[nodes.length - 1];
    if (last?.type === "text") last.text += value;
    else nodes.push({ type: "text", text: value });
  };

  for (const match of text.matchAll(INLINE_TOKEN)) {
    const [token, linkBody, boldBody] = match;
    pushText(text.slice(cursor, match.index));
    cursor = match.index + token.length;

    if (linkBody !== undefined) {
      // 문서명이 빈 링크(`[[ ]]`, `[[|글자]]`)는 가리킬 문서가 없어 글자로 남긴다
      const link = toLink(linkBody);
      if (link) nodes.push(link);
      else pushText(token);
    } else {
      nodes.push({ type: "bold", children: parseInline(boldBody) });
    }
  }
  pushText(text.slice(cursor));

  return nodes;
}

function toLink(body: string): WikiInline | null {
  const separator = body.indexOf("|");
  const target = (separator === -1 ? body : body.slice(0, separator)).trim();
  if (target === "") return null;

  const label = separator === -1 ? "" : body.slice(separator + 1).trim();
  return { type: "link", target, label: label || target };
}

function toPlainText(nodes: WikiInline[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return node.text;
        case "bold":
          return toPlainText(node.children);
        case "link":
          return node.label;
        case "break":
          return " ";
      }
    })
    .join("");
}

/**
 * 제목 글자로 앵커 id를 만드는 함수를 돌려준다. 순번(s1, s2…) 대신 글자를 쓰는 것은 문단을
 * 추가하거나 순서를 바꿔도 `#연혁` 같은 주소가 같은 문단을 가리키게 하기 위해서다.
 * 같은 제목이 여러 번 나오면 뒤의 것에 `-2`, `-3`을 붙인다.
 */
function createAnchorIds(): (text: string) => string {
  const used = new Set<string>();
  // 같은 제목이 아주 많을 때 매번 `-2`부터 다시 세지 않도록 제목별로 마지막 번호를 기억한다
  const lastSuffix = new Map<string, number>();

  return (text) => {
    const base =
      text.replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-|-$/g, "") ||
      "section";

    // 번호를 붙인 id가 `== 개요-2 ==`처럼 직접 쓴 제목과 겹칠 수도 있어 used로 다시 확인한다
    let suffix = lastSuffix.get(base) ?? 0;
    let id: string;
    do {
      suffix += 1;
      id = suffix === 1 ? base : `${base}-${suffix}`;
    } while (used.has(id));

    lastSuffix.set(base, suffix);
    used.add(id);

    return id;
  };
}

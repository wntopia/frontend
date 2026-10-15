import { MissingLink, WikiLink } from "@/shared/ui";
import type {
  WikiBlock,
  WikiHeadingLevel,
  WikiInline,
} from "../model/wiki-syntax";

type WikiContentVariant = "article" | "preview";

type WikiContentProps = {
  /** `parseWikiText`의 결과. 목차와 같은 파싱 결과를 쓰도록 문자열이 아니라 구조를 받는다 */
  blocks: WikiBlock[];
  /** article: 문서 상세, preview: 편집 화면의 미리보기 */
  variant?: WikiContentVariant;
  /**
   * 아직 작성되지 않은 문서로 판정된 링크 대상. 여기 있는 대상만 붉은 링크가 된다.
   * 문서가 있는지는 백엔드에 물어야 알 수 있어, 렌더러가 스스로 정하지 않고 결과를 받는다.
   */
  missingTargets?: ReadonlySet<string>;
};

type VariantStyle = {
  heading: Record<WikiHeadingLevel, string>;
  paragraph: string;
  list: string;
};

/**
 * 문서 상세와 미리보기는 같은 본문을 그리지만 시안의 글자 크기와 여백이 서로 다르다.
 * h2와 문단은 각 시안의 수치이고, 시안에 없는 h3·h4·목록은 그 수치에 맞춰 정했다.
 */
const VARIANT_STYLES: Record<WikiContentVariant, VariantStyle> = {
  article: {
    heading: {
      // scroll-mt: 목차로 넘어왔을 때 제목이 고정 상단 바에 가려지지 않게 한다
      2: "scroll-mt-20 mt-[46px] mb-4 text-2xl font-bold tracking-[-0.015em]",
      3: "scroll-mt-20 mt-8 mb-3 text-xl font-bold tracking-[-0.01em]",
      4: "scroll-mt-20 mt-6 mb-2.5 text-[17px] font-bold",
    },
    paragraph: "mb-5 text-base leading-[1.9] text-fg-muted last:mb-0",
    list: "mb-5 list-disc pl-[22px] text-base leading-[1.9] text-fg-muted marker:text-fg-subtle last:mb-0",
  },
  preview: {
    heading: {
      2: "mt-6 mb-[14px] text-[22px] font-bold first:mt-0",
      3: "mt-5 mb-3 text-lg font-bold first:mt-0",
      4: "mt-4 mb-2.5 text-base font-bold first:mt-0",
    },
    paragraph: "mb-[18px] text-[15.5px] leading-[1.85] text-fg-muted last:mb-0",
    list: "mb-[18px] list-disc pl-[22px] text-[15.5px] leading-[1.85] text-fg-muted marker:text-fg-subtle last:mb-0",
  },
};

/** 위키 문법 본문. 문서 상세와 편집 미리보기가 함께 쓴다. */
export function WikiContent({
  blocks,
  variant = "article",
  missingTargets,
}: WikiContentProps) {
  const style = VARIANT_STYLES[variant];
  const inline = (nodes: WikiInline[]) => (
    <Inline nodes={nodes} variant={variant} missingTargets={missingTargets} />
  );

  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Heading = `h${block.level}` as const;
            return (
              <Heading
                key={index}
                id={block.id}
                className={style.heading[block.level]}
              >
                {inline(block.children)}
              </Heading>
            );
          }
          case "paragraph":
            return (
              <p key={index} className={style.paragraph}>
                {inline(block.children)}
              </p>
            );
          case "list":
            return (
              <ul key={index} className={style.list}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{inline(item)}</li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}

type InlineProps = {
  nodes: WikiInline[];
  variant: WikiContentVariant;
  missingTargets?: ReadonlySet<string>;
};

function Inline({ nodes, variant, missingTargets }: InlineProps) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "text":
        return node.text;
      case "break":
        return <br key={index} />;
      case "bold":
        return (
          <b key={index} className="text-fg">
            <Inline
              nodes={node.children}
              variant={variant}
              missingTargets={missingTargets}
            />
          </b>
        );
      case "link": {
        const missing = missingTargets?.has(node.target) ?? false;

        // 미리보기에서 링크를 눌러 편집 화면을 벗어나면 저장하지 않은 본문을 잃는다.
        // 시안도 미리보기의 링크는 색만 입힌 글자로 그린다.
        if (variant === "preview") {
          return (
            <span
              key={index}
              className={missing ? "text-danger" : "text-accent"}
            >
              {node.label}
            </span>
          );
        }

        return missing ? (
          <MissingLink key={index}>{node.label}</MissingLink>
        ) : (
          <WikiLink key={index}>{node.label}</WikiLink>
        );
      }
    }
  });
}

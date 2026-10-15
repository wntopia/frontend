import { WikiContent, parseWikiText } from "@/entities/document";

type EditorPreviewProps = {
  /** 위키 문법으로 된 본문 */
  content: string;
};

/** 미리보기 패널. 편집기에 입력한 본문을 문서 상세와 같은 렌더러로 그린다. */
export function EditorPreview({ content }: EditorPreviewProps) {
  const blocks = parseWikiText(content);

  return (
    <div className="min-h-[480px] rounded-xl bg-surface px-[26px] py-6 elevate-1">
      {blocks.length > 0 ? (
        <WikiContent blocks={blocks} variant="preview" />
      ) : (
        <p className="text-[15.5px] leading-[1.85] text-fg-subtle">
          미리 볼 내용이 없습니다.
        </p>
      )}
    </div>
  );
}

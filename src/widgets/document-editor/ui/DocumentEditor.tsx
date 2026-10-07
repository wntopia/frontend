import { EditorPreview } from "./EditorPreview";

const TEXTAREA_PLACEHOLDER =
  "== 문단 제목 ==\n본문 내용을 입력하세요. [[존재하는 문서]]는 자동으로 링크됩니다.";

type DocumentEditorProps = {
  title: string;
  /** 위키 문법으로 된 본문 */
  content: string;
  onContentChange: (content: string) => void;
  showPreview: boolean;
};

/** 제목·본문 편집기와 편집 요약 입력 */
export function DocumentEditor({
  title,
  content,
  onContentChange,
  showPreview,
}: DocumentEditorProps) {
  return (
    <div>
      <input
        aria-label="문서 제목"
        defaultValue={title}
        className="mb-[18px] w-full border-b border-divider bg-transparent pb-[14px] text-[30px] font-extrabold tracking-[-.02em] text-fg outline-none"
      />

      {showPreview ? (
        <EditorPreview />
      ) : (
        <textarea
          aria-label="본문"
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={TEXTAREA_PLACEHOLDER}
          className="h-[480px] w-full resize-y rounded-xl bg-sunken p-[22px] elevate-inset font-mono text-sm leading-[1.9] text-fg-muted outline-none placeholder:text-faint"
        />
      )}

      <div className="mt-4 flex items-center gap-2.5">
        <input
          aria-label="편집 요약"
          placeholder="편집 요약 (예: 연혁 문단에 2026년 내용 추가)"
          className="min-w-0 flex-1 rounded-[9px] bg-surface elevate-control px-[14px] py-2.5 text-[13.5px] text-fg outline-none"
        />
        <label className="flex flex-shrink-0 items-center gap-[7px] text-[13px] text-fg-soft">
          <input type="checkbox" className="h-[15px] w-[15px] accent-accent" />
          가벼운 수정
        </label>
      </div>
    </div>
  );
}

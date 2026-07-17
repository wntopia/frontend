"use client";

import { useState } from "react";
import { DocumentEditor } from "@/widgets/document-editor";
import { EditGuide } from "@/widgets/edit-guide";
import { EditorTopBar } from "@/widgets/editor-top-bar";
import { EDIT_DOCUMENT } from "../model/mock";

/**
 * 편집 화면.
 * 미리보기 전환 버튼(상단 바)과 미리보기 패널(편집기)이 서로 다른 위젯이라,
 * 두 위젯의 공통 조상인 이 화면이 전환 상태를 갖는다.
 *
 * 본문도 이 화면이 갖는다. 미리보기로 전환하면 textarea가 언마운트되는데,
 * 본문을 textarea 안에만 두면 그때 입력한 내용이 사라지기 때문이다.
 */
export function EditPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState(EDIT_DOCUMENT.content);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <EditorTopBar
        documentTitle={EDIT_DOCUMENT.title}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((prev) => !prev)}
      />

      <div className="mx-auto flex max-w-[1120px] gap-7 px-8 pb-[100px] pt-8">
        <div className="min-w-0 flex-1">
          <DocumentEditor
            title={EDIT_DOCUMENT.title}
            content={content}
            onContentChange={setContent}
            showPreview={showPreview}
          />
        </div>
        <aside className="w-[260px] flex-shrink-0">
          <EditGuide />
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { SigninButton } from "@/features/auth";
import {
  ArticleImagePicker,
  useLeaveGuard,
  usePickedImage,
  useSaveArticle,
  type SaveTarget,
} from "@/features/save-article";
import { Alert } from "@/shared/ui";
import { DocumentEditor } from "@/widgets/document-editor";
import { EditGuide } from "@/widgets/edit-guide";
import { EditorTopBar } from "@/widgets/editor-top-bar";

type EditWorkspaceProps = {
  /** 새 문서를 만드는지, 어느 문서를 고치는지 */
  target: SaveTarget;
  /** 새 문서는 주소로 받은 제목(없으면 빈 문자열), 기존 문서는 고칠 수 없는 지금 제목 */
  initialTitle: string;
  /** 편집을 시작할 때의 본문. 새 문서는 빈 문자열이다. */
  initialContent: string;
  /** 지금 저장된 대표 이미지 주소. 새 문서이거나 이미지가 없으면 `null` */
  imageUrl: string | null;
  /** 편집을 그만두면 돌아갈 곳과, 그곳을 가리키는 이름 */
  backHref: string;
  backLabel: string;
  /** 저장이 로그인 만료로 실패해 다시 로그인했을 때 돌아올 주소 */
  returnTo: string;
};

/**
 * 편집 화면의 본체. 기존 문서 편집과 새 문서 작성이 함께 쓴다.
 * 저장 버튼(상단 바), 입력 칸(편집기), 대표 이미지(사이드바)가 서로 다른 위젯이라
 * 세 위젯의 공통 조상인 이 화면이 입력 값을 모두 갖고, 저장 동작은 `features/save-article`에 맡긴다.
 *
 * 본문도 이 화면이 갖는다. 미리보기로 전환하면 textarea가 언마운트되는데,
 * 본문을 textarea 안에만 두면 그때 입력한 내용이 사라지기 때문이다.
 */
export function EditWorkspace({
  target,
  initialTitle,
  initialContent,
  imageUrl,
  backHref,
  backLabel,
  returnTo,
}: EditWorkspaceProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [summary, setSummary] = useState("");
  const [minorEdit, setMinorEdit] = useState(false);
  const [image, pickImage] = usePickedImage();
  const { status, problem, save } = useSaveArticle(target);

  const changed =
    title !== initialTitle ||
    content !== initialContent ||
    image !== null ||
    summary !== "" ||
    minorEdit;
  // 저장에 성공해 문서로 넘어가는 중에는 묻지 않는다.
  const confirmLeave = useLeaveGuard(changed && status !== "saved");

  const alertRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 저장이 막히면 고칠 칸으로 포커스를 옮기고, 칸과 상관없는 실패는 안내가 화면에 들어오게 스크롤한다.
  // 미리보기 중이라 본문 칸이 없으면 옮기지 않는다 — 안내는 그대로 보인다.
  useEffect(() => {
    if (!problem) return;
    const field =
      problem.field === "title"
        ? titleRef.current
        : problem.field === "content"
          ? contentRef.current
          : null;
    if (field) field.focus();
    else alertRef.current?.scrollIntoView({ block: "nearest" });
  }, [problem]);

  const locked = status !== "idle";

  return (
    <div className="min-h-screen bg-bg text-fg">
      <EditorTopBar
        backHref={backHref}
        backLabel={backLabel}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((prev) => !prev)}
        onSave={() =>
          save({ title, content, image: image?.file ?? null, summary, minorEdit })
        }
        saving={locked}
        onLeave={confirmLeave}
      />

      <div className="mx-auto flex max-w-[1120px] gap-7 px-8 pb-[100px] pt-8">
        <div className="min-w-0 flex-1">
          {problem && (
            // 고정된 상단 바(58px)에 가리지 않을 만큼 띄워서 스크롤한다.
            <div ref={alertRef} className="mb-5 scroll-mt-[74px]">
              <Alert title={problem.title} detail={problem.detail}>
                {problem.message}
                {problem.needsSignin && (
                  // 전역 `a { color: inherit; text-decoration: none }`이 레이어 밖에 있어 링크에 준 색·밑줄
                  // 유틸리티를 덮는다. 그래서 버튼 모양 대신 안내 글자색을 물려받고, 밑줄은 안쪽 span에 건다.
                  <div className="mt-1.5">
                    <SigninButton returnTo={returnTo} className="font-bold">
                      <span className="underline underline-offset-2">
                        다시 로그인
                      </span>
                    </SigninButton>
                  </div>
                )}
              </Alert>
            </div>
          )}

          <DocumentEditor
            title={title}
            // 기존 문서의 제목은 백엔드가 수정 요청에서 받지 않아 고칠 수 없게 둔다.
            onTitleChange={target.kind === "create" ? setTitle : undefined}
            content={content}
            onContentChange={setContent}
            showPreview={showPreview}
            // 편집 요약·가벼운 수정은 수정 요청에만 있는 필드라 새 문서에서는 숨긴다.
            revisionNote={
              target.kind === "update"
                ? {
                    summary,
                    minorEdit,
                    onSummaryChange: setSummary,
                    onMinorEditChange: setMinorEdit,
                  }
                : undefined
            }
            locked={locked}
            titleRef={titleRef}
            contentRef={contentRef}
          />
        </div>
        <aside className="w-[260px] flex-shrink-0">
          <div className="mb-4">
            <ArticleImagePicker
              currentUrl={imageUrl}
              picked={image}
              onPick={pickImage}
              disabled={locked}
            />
          </div>
          <EditGuide />
        </aside>
      </div>
    </div>
  );
}

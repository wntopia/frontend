import { useRef, useState, type ChangeEvent } from "react";
import { Alert, SidebarCard } from "@/shared/ui";
import {
  findImageProblem,
  formatFileSize,
  MAX_IMAGE_BYTES,
} from "../model/draft";
import type { SaveProblem } from "../model/save-problem";
import type { PickedImage } from "../model/use-picked-image";

/** 편집 화면 상단 바의 보조 버튼과 같은 모양을 사이드바 폭에 맞게 줄였다 */
const BUTTON =
  "cursor-pointer rounded-lg bg-surface-2 elevate-control px-3 py-[7px] text-[12.5px] font-semibold text-fg-muted hover:text-fg-muted disabled:cursor-default disabled:opacity-60";

type ArticleImagePickerProps = {
  /** 지금 저장되어 있는 대표 이미지. 새 문서이거나 이미지가 없는 문서는 `null` */
  currentUrl: string | null;
  /** 새로 고른 이미지. 저장할 때 올린다 */
  picked: PickedImage | null;
  /** 파일을 고르면 `File`, 선택을 취소하면 `null` */
  onPick: (file: File | null) => void;
  /** 저장하는 동안 고르지 못하게 한다 */
  disabled: boolean;
};

/**
 * 편집 화면 사이드바의 '대표 이미지' 카드. 시안이 없어 사이드바 카드 골격과 보조 버튼 모양을 빌렸다.
 *
 * 고른 파일은 바로 올리지 않고 저장할 때 올린다. 고르기만 하고 저장하지 않으면 아무것도 바뀌지 않아야 하기 때문이다.
 * 백엔드에 이미지를 지우는 요청이 없어 '이미지 빼기'는 두지 않았다. 기존 문서의 지금 이미지(`currentUrl`)는 공동편집
 * 중 다른 사람이 바꾸면 그 자리에서 바뀐다.
 */
export function ArticleImagePicker({
  currentUrl,
  picked,
  onPick,
  disabled,
}: ArticleImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // 고르는 순간 거른 이유. 저장 실패가 아니라 고르기의 실패라 저장 버튼 쪽이 아닌 이 카드에 남긴다.
  const [problem, setProblem] = useState<SaveProblem | null>(null);
  const shownUrl = picked?.previewUrl ?? currentUrl;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change가 일어나도록 비운다. 거절된 파일을 고친 뒤 다시 고르는 경우다.
    event.target.value = "";
    if (!file) return;

    const invalid = findImageProblem(file);
    setProblem(invalid);
    // 거절하면 원래 고른 이미지를 그대로 둔다.
    if (!invalid) onPick(file);
  }

  function cancelPick() {
    setProblem(null);
    onPick(null);
  }

  return (
    <SidebarCard title="대표 이미지">
      {shownUrl && (
        <div className="mb-3 overflow-hidden rounded-[9px] bg-sunken elevate-inset">
          {/* 고른 파일은 blob: 주소이고 저장된 이미지는 배포마다 다른 저장소 주소라 next/image 대신 img로 그린다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shownUrl}
            alt={picked ? "새로 고른 대표 이미지" : "지금 대표 이미지"}
            className="mx-auto max-h-[180px] w-auto max-w-full"
          />
        </div>
      )}

      <p className="mb-3 break-keep text-[12.5px] leading-[1.7] text-fg-soft">
        {picked ? (
          <>
            <span className="font-mono text-[11.5px] text-fg-muted [overflow-wrap:anywhere]">
              {picked.file.name}
            </span>{" "}
            · {formatFileSize(picked.file.size)}
            <br />
            {currentUrl
              ? "저장하면 지금 이미지를 이 이미지로 바꿉니다."
              : "저장할 때 함께 올립니다."}
          </>
        ) : currentUrl ? (
          "지금 문서에 걸린 이미지입니다. 다른 이미지로 바꿀 수 있습니다."
        ) : (
          `문서 위쪽에 보일 이미지입니다. 없어도 됩니다. ${formatFileSize(MAX_IMAGE_BYTES)}까지 올릴 수 있습니다.`
        )}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className={BUTTON}
        >
          {shownUrl ? "다른 이미지로 바꾸기" : "이미지 고르기"}
        </button>
        {picked && (
          <button
            type="button"
            onClick={cancelPick}
            disabled={disabled}
            className={BUTTON}
          >
            선택 취소
          </button>
        )}
      </div>

      {problem && (
        <Alert title={problem.title} className="mt-3">
          {problem.message}
        </Alert>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="대표 이미지 파일"
        onChange={handleChange}
        hidden
      />
    </SidebarCard>
  );
}

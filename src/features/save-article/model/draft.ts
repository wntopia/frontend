import type { SaveProblem } from "./save-problem";

/**
 * 제목 길이 제한. 백엔드 `@Size(max = 255)`가 자바 `String.length`(UTF-16 단위)로 세므로
 * 같은 단위인 JS `length`로 센다. 앞뒤 공백을 지운 값을 보내고 그 값으로 센다.
 */
export const MAX_TITLE_LENGTH = 255;

/** 편집 요약 길이 제한 (백엔드 `EditMetadata.MAX_SUMMARY_LENGTH`) */
export const MAX_SUMMARY_LENGTH = 500;

/**
 * 대표 이미지 크기 제한. 백엔드의 `max-file-size: 10MB`는 Spring `DataSize`라 1MB를 1024×1024바이트로 센다.
 * 넘는 파일은 고르는 순간 막는다 — 서버는 다 올려 받은 뒤에야 거절하고, 한도를 크게 넘으면 응답 대신
 * 연결을 끊을 수 있어 원인을 알 수 없는 네트워크 오류로 보이기 때문이다.
 */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** 저장할 때 화면에서 모으는 값 */
export type ArticleDraft = {
  title: string;
  content: string;
  image: File | null;
  /** 편집 요약. 기존 문서를 고칠 때만 보낸다 */
  summary: string;
  minorEdit: boolean;
};

/**
 * 무엇을 저장하는지. 새 문서는 POST로 만들고, 기존 문서는 본문을 공동편집 WebSocket으로(`RevisionSaver`),
 * 바꾼 대표 이미지를 PATCH로 저장한다.
 */
export type SaveTarget =
  | { kind: "create" }
  | {
      kind: "update";
      articleId: number;
      /**
       * 백엔드는 `student`가 있는 계정만 문서를 고치게 하고 나머지는 401을 준다(공동편집은 방에 들이지 않는다).
       * 거절을 받았을 때 '다시 로그인'과 '이 계정으로는 안 됨'을 가르는 데만 쓴다.
       */
      studentAccount: boolean;
    };

/** 백엔드가 거절할 입력을 보내기 전에 찾는다. 문제가 없으면 `null` */
export function findDraftProblem(
  draft: ArticleDraft,
  target: SaveTarget,
): SaveProblem | null {
  // 기존 문서의 제목은 보내지 않으므로 새 문서일 때만 본다.
  if (target.kind === "create") {
    const title = draft.title.trim();
    if (title === "") {
      return {
        title: "제목이 비어 있습니다.",
        message: "문서 제목을 입력해 주세요.",
        field: "title",
      };
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return {
        title: "제목이 너무 깁니다.",
        message: `제목은 ${MAX_TITLE_LENGTH}자까지 쓸 수 있습니다. 지금 ${title.length}자입니다.`,
        field: "title",
      };
    }
  }

  if (draft.content.trim() === "") {
    return {
      title: "본문이 비어 있습니다.",
      message: "내용을 한 줄 이상 써 주세요.",
      field: "content",
    };
  }

  return null;
}

/** 대표 이미지로 쓸 수 없는 파일이면 그 이유를, 쓸 수 있으면 `null`을 돌려준다. */
export function findImageProblem(file: File): SaveProblem | null {
  // 백엔드는 형식을 보지 않지만, 이미지가 아니면 문서에서 그려지지 않는다.
  // 형식을 알 수 없는 파일(`type`이 빈 문자열)도 미리 보여 줄 수 없어 받지 않는다.
  if (!file.type.startsWith("image/")) {
    return {
      title: "이미지 파일이 아닙니다.",
      message: "JPG · PNG · GIF · WEBP 같은 이미지 파일을 골라 주세요.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      title: "이미지가 너무 큽니다.",
      message: `대표 이미지는 ${formatFileSize(MAX_IMAGE_BYTES)}까지 올릴 수 있습니다. 고른 파일은 ${formatFileSize(file.size)}입니다.`,
    };
  }
  // 빈 파일은 백엔드가 '이미지 없음'으로 읽고 넘어가 저장은 되는데 이미지가 붙지 않는다.
  if (file.size === 0) {
    return {
      title: "빈 파일입니다.",
      message: "내용이 있는 이미지 파일을 골라 주세요.",
    };
  }
  return null;
}

/**
 * 파일 크기를 제한(10MB)과 같은 단위로 적는다. 올림으로 적어, 한도를 조금 넘은 파일이
 * 반올림 때문에 "10MB"로 보여 왜 거절됐는지 모르게 되는 일을 막는다.
 */
export function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1) return `${Math.ceil(megabytes * 10) / 10}MB`;
  return `${Math.max(1, Math.ceil(bytes / 1024))}KB`;
}

/** 기존 문서의 본문을 새 리비전으로 저장해 달라는 요청 */
export type RevisionSaveRequest = {
  content: string;
  summary?: string;
  minorEdit: boolean;
};

/**
 * 본문 저장의 결과. 실패 사유는 공동편집 연결(`features/collaboration`)의 것과 같다.
 * - `disconnected` · `too-large`: 보내지 못했다
 * - `timeout` · `connection-lost`: 보냈지만 결과를 받지 못했다. 저장됐을 수도 있다
 * - `server-error`: 서버가 오류로 답했다
 */
export type RevisionSaveResult =
  | { ok: true; revision: number | null }
  | {
      ok: false;
      reason:
        | "disconnected"
        | "too-large"
        | "timeout"
        | "connection-lost"
        | "server-error";
      message?: string;
    };

/**
 * 기존 문서의 본문을 저장하는 통로. 수정 모드에서는 화면이 공동편집 연결의 `save`를 넘긴다.
 * 같은 레이어의 기능끼리는 서로 import 하지 않으므로, 저장 동작이 필요한 모양만 여기 적고 화면이 둘을 잇는다.
 */
export type RevisionSaver = (
  request: RevisionSaveRequest,
) => Promise<RevisionSaveResult>;

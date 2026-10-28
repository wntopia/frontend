import { isApiError } from "@/shared/api";
import type { RevisionSaveResult, SaveTarget } from "./draft";

/** 저장을 막았거나 저장이 실패했을 때 그 자리의 `Alert`에 그대로 들어가는 안내 */
export type SaveProblem = {
  /** 무엇이 잘못됐는지 (Alert의 굵은 제목) */
  title: string;
  /** 무엇을 하면 되는지 */
  message: string;
  /** 서버가 준 사유처럼 덜 중요한 세부 정보 */
  detail?: string;
  /** 다시 로그인하면 풀리는 실패라 로그인 버튼을 함께 보인다 */
  needsSignin?: boolean;
  /** 고쳐야 할 입력 칸. 화면이 이 칸으로 포커스를 옮긴다 */
  field?: "title" | "content";
};

/**
 * 보내 보지 않아도 거절될 것을 아는 계정이면 그 안내를, 아니면 `null`을 돌려준다.
 *
 * 백엔드는 `student`가 없는 계정(교사 등)의 문서 수정을 거절한다 — 공동편집 방에 들이지 않고 이미지 교체는 401이다.
 * 왜 편집기가 열리지 않는지 알 수 있게 화면은 들어오자마자 이 안내를 보인다. 연결은 막지 않고 시도한다 — 거절은
 * 백엔드가 판단할 일이라, 정책이 바뀌면 화면을 고치지 않아도 편집되게 둔다.
 */
export function findAccountProblem(target: SaveTarget): SaveProblem | null {
  if (target.kind !== "update" || target.studentAccount) return null;
  return {
    title: "학생 계정만 문서를 고칠 수 있습니다.",
    message:
      "지금 계정으로는 공동편집에 들어갈 수 없어 본문을 읽기만 할 수 있습니다.",
  };
}

/**
 * 저장 요청(새 문서 POST, 대표 이미지 PATCH)의 실패를 사용자가 할 일로 바꾼다. 상태 코드와 응답 사유는 백엔드
 * develop의 ArticleController · CreateArticleServiceImpl · UpdateArticleImageServiceImpl · AuthenticationReader를 보고 맞췄다.
 *
 * 서버의 `message`를 그대로 제목으로 쓰지 않는다. 입력 검증(400)과 크기 초과(413)는 the-sdk의
 * 예외 처리기가 아니라 Spring 기본 오류 응답을 감싸 오므로 "Bad Request" 같은 영어 상태 문구가 담긴다.
 */
export function describeSaveError(
  error: unknown,
  target: SaveTarget,
): SaveProblem {
  if (!isApiError(error)) {
    // 응답을 받지 못한 경우다 (오프라인, 서버 중단, 업로드 중 연결 끊김).
    return {
      title: "서버에 연결하지 못했습니다.",
      message: "인터넷 연결을 확인하고 다시 저장해 주세요. 쓰던 내용은 그대로 있습니다.",
      detail: error instanceof Error ? error.message : undefined,
    };
  }

  switch (error.status) {
    case 400:
      return {
        title: "저장하지 못했습니다.",
        message: "서버가 입력을 받아들이지 않았습니다. 제목과 본문을 확인해 주세요.",
        detail: error.message,
      };
    case 401: {
      // 백엔드는 비로그인과 `student`가 없는 계정을 같은 401로 돌려준다. 후자는 다시 로그인해도
      // 같은 계정으로 돌아와 다시 401이므로 로그인 버튼 대신 사정을 알린다.
      const accountProblem = findAccountProblem(target);
      if (accountProblem) return accountProblem;
      return {
        title: "로그인이 풀렸습니다.",
        message:
          "다시 로그인한 뒤 저장해 주세요. 로그인하면 이 화면을 새로 불러오므로 쓴 내용은 먼저 복사해 두세요.",
        needsSignin: true,
      };
    }
    case 404:
      return {
        title: "문서를 찾을 수 없습니다.",
        message: "그사이 문서가 없어졌을 수 있습니다. 쓴 내용을 복사해 두고 문서를 다시 확인해 주세요.",
        detail: error.message,
      };
    case 409:
      return {
        title: "같은 제목의 문서가 이미 있습니다.",
        message:
          "대소문자나 띄어쓰기만 다른 제목도 같은 문서로 봅니다. 제목을 바꾸거나, 있는 문서를 찾아 고쳐 주세요.",
        field: "title",
      };
    case 413:
      return {
        title: "보낼 내용이 너무 큽니다.",
        message: "대표 이미지와 본문을 합쳐 10MB를 넘을 수 없습니다. 더 작은 이미지를 골라 주세요.",
      };
    case 502:
      // 이미지 저장소에 올리지 못한 경우다. 백엔드는 업로드를 먼저 하고, 기존 문서는 이미지를 본문보다 먼저 올리므로
      // 어느 쪽이든 본문도 저장되지 않았다.
      return {
        title: "대표 이미지를 올리지 못했습니다.",
        message:
          "아무것도 저장되지 않았습니다. 잠시 후 다시 저장하고, 계속 실패하면 이미지를 빼고 저장해 보세요.",
      };
  }

  if (error.status >= 500) {
    return {
      title: "서버 오류로 저장하지 못했습니다.",
      message: "잠시 후 다시 저장해 주세요. 쓰던 내용은 그대로 있습니다.",
      detail: `${error.status} ${error.message}`,
    };
  }
  return {
    title: "저장하지 못했습니다.",
    message: "잠시 후 다시 저장해 주세요. 쓰던 내용은 그대로 있습니다.",
    detail: `${error.status} ${error.message}`,
  };
}

/**
 * 공동편집으로 본문을 저장하지 못한 이유를 사용자가 할 일로 바꾼다. 쓰던 내용은 공동편집 문서에 그대로 있다.
 * 대표 이미지는 본문보다 먼저 올리므로, 이미지는 바뀌고 본문만 저장되지 않았을 수 있어 그 사실을 함께 알린다.
 */
export function describeRevisionSaveFailure(
  result: Extract<RevisionSaveResult, { ok: false }>,
  imageSaved: boolean,
): SaveProblem {
  const imageNote = imageSaved ? " 대표 이미지는 바꿨습니다." : "";
  switch (result.reason) {
    case "disconnected":
      return {
        title: "공동편집 서버에 연결되어 있지 않아 저장하지 못했습니다.",
        message: `다시 연결되면 저장해 주세요. 쓰던 내용은 그대로 있고, 연결되면 다른 사람의 편집과 합쳐집니다.${imageNote}`,
      };
    case "too-large":
      return {
        title: "본문이 너무 커서 저장하지 못했습니다.",
        message: `공동편집 저장은 한 번에 512KB까지 보낼 수 있습니다. 본문을 줄여 다시 저장해 주세요.${imageNote}`,
      };
    case "timeout":
    case "connection-lost":
      // 보낸 뒤에 결과를 못 받았을 뿐이라 저장되었을 수도 있다. 다시 저장해도 본문이 같으면 리비전이 늘지 않는다.
      return {
        title:
          result.reason === "timeout"
            ? "저장 결과를 받지 못했습니다."
            : "저장하는 중에 연결이 끊겼습니다.",
        message: `저장되었을 수도 있습니다. 편집역사를 확인하거나, 연결된 뒤 다시 저장해 주세요. 본문이 같으면 리비전은 늘지 않습니다.${imageNote}`,
      };
    case "server-error":
      return {
        title: "서버 오류로 저장하지 못했습니다.",
        message: `잠시 후 다시 저장해 주세요. 쓰던 내용은 그대로 있습니다.${imageNote}`,
        detail: result.message,
      };
  }
}

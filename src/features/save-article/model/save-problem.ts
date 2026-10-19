import { isApiError } from "@/shared/api";
import type { SaveTarget } from "./draft";

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
 * 저장 요청의 실패를 사용자가 할 일로 바꾼다. 상태 코드와 응답 사유는 백엔드 develop의
 * ArticleController · CreateArticleServiceImpl · AuthenticationReader를 보고 맞췄다.
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
    case 401:
      // 백엔드는 비로그인과 `student`가 없는 계정을 같은 401로 돌려준다. 후자는 다시 로그인해도
      // 같은 계정으로 돌아와 다시 401이므로 로그인 버튼 대신 사정을 알린다.
      if (target.kind === "update" && !target.studentAccount) {
        return {
          title: "학생 계정만 문서를 고칠 수 있습니다.",
          message:
            "지금 계정으로는 저장되지 않습니다. 쓴 내용이 필요하면 복사해 두세요.",
        };
      }
      return {
        title: "로그인이 풀렸습니다.",
        message:
          "다시 로그인한 뒤 저장해 주세요. 로그인하면 이 화면을 새로 불러오므로 쓴 내용은 먼저 복사해 두세요.",
        needsSignin: true,
      };
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
      // 이미지 저장소에 올리지 못한 경우다. 백엔드는 업로드를 먼저 하므로 본문도 저장되지 않았다.
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

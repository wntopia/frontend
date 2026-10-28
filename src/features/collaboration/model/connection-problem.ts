import type { CollaborationSnapshot } from "./provider";

/** 편집 화면의 안내 자리(`Alert`)에 그대로 들어가는 모양. `features/save-article`의 안내와 같다 */
export type ConnectionProblem = {
  title: string;
  message: string;
  detail?: string;
  /** 다시 로그인하면 풀린다. 화면이 로그인 버튼을 함께 보인다 */
  needsSignin?: boolean;
};

/**
 * 다시 연결해도 풀리지 않는 연결 실패를 안내로 바꾼다. 다시 시도 중인 끊김은 상단 바의 연결 상태로만 보인다.
 *
 * `student`가 없는 계정의 거절(`rejected`)은 화면이 들어오자마자 보이는 계정 안내가 이미 같은 말을 하므로 겹쳐 보이지 않는다.
 */
export function describeConnectionProblem(
  snapshot: CollaborationSnapshot,
): ConnectionProblem | null {
  if (snapshot.failure !== "unauthorized") return null;
  return {
    title: "로그인이 풀렸습니다.",
    message:
      "다시 로그인하면 이 화면으로 돌아와 공동편집에 다시 들어갑니다. 연결이 끊긴 뒤에 쓴 내용은 먼저 복사해 두세요.",
    needsSignin: true,
  };
}

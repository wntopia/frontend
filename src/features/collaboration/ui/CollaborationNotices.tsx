"use client";

import { useState } from "react";
import { Alert } from "@/shared/ui";
import {
  MAX_MESSAGE_BYTES,
  type CollaborationProvider,
  type CollaborationSnapshot,
} from "../model/provider";

/**
 * 안내 안의 글자 버튼. 안내의 글자색을 물려받고 밑줄로 누를 수 있음을 보인다.
 * 편집 화면의 '다시 로그인' 링크와 같은 모양이다.
 */
const TEXT_BUTTON = "cursor-pointer font-bold underline underline-offset-2";

type CollaborationNoticesProps = {
  provider: CollaborationProvider;
  snapshot: CollaborationSnapshot;
};

/**
 * 공동편집 중에 사람이 판단하거나 알아야 할 일. 저장 실패 안내와 달리 동시에 여럿일 수 있어 각자 하나씩 둔다.
 * 다시 연결하면 풀리는 끊김은 여기가 아니라 상단 바의 연결 상태로만 보인다.
 */
export function CollaborationNotices({
  provider,
  snapshot,
}: CollaborationNoticesProps) {
  // 복사 결과를 그 본문과 함께 둔다. 닫은 뒤 새로 합치지 못한 본문이 생겼을 때 앞의 결과('복사했습니다')가
  // 새 본문에 이어 보이면, 아직 복사하지 않은 본문을 복사한 줄 알고 닫게 된다.
  const [copyResult, setCopyResult] = useState<{
    draft: string;
    ok: boolean;
  } | null>(null);
  const draft = snapshot.unmergedDraft;
  const copied =
    draft !== null && copyResult?.draft === draft
      ? copyResult.ok
        ? "done"
        : "failed"
      : null;

  async function copyDraft() {
    if (draft === null) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopyResult({ draft, ok: true });
    } catch {
      setCopyResult({ draft, ok: false });
    }
  }

  return (
    <>
      {snapshot.externalContent !== null && (
        <Alert title="편집 화면 밖에서 본문이 저장되었습니다." className="mb-5">
          지금 편집 중인 본문과 다릅니다. 바뀐 본문으로 바꾸면 그 뒤에 함께 고친
          내용은 사라지고, 바꾸지 않고 저장하면 밖에서 바꾼 내용을 덮어씁니다.
          <div className="mt-1.5 flex gap-4">
            <button
              type="button"
              onClick={provider.acceptExternalContent}
              className={TEXT_BUTTON}
            >
              바뀐 본문으로 바꾸기
            </button>
            <button
              type="button"
              onClick={provider.dismissExternalContent}
              className={TEXT_BUTTON}
            >
              지금 본문 유지
            </button>
          </div>
        </Alert>
      )}

      {draft !== null && (
        <Alert
          title="연결이 끊긴 동안 쓴 내용을 합치지 못했습니다."
          className="mb-5"
          detail={
            copied === "failed"
              ? "복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요."
              : undefined
          }
        >
          그사이 다른 사람이 이 문서를 새로 열어 고쳐서, 지금 화면은 그
          내용입니다. 내가 쓴 본문을 복사해 두었다가 필요한 부분을 다시 넣어
          주세요.
          <div className="mt-1.5 flex gap-4">
            <button type="button" onClick={copyDraft} className={TEXT_BUTTON}>
              {copied === "done" ? "복사했습니다" : "내가 쓴 본문 복사"}
            </button>
            <button
              type="button"
              onClick={provider.dismissUnmergedDraft}
              className={TEXT_BUTTON}
            >
              닫기
            </button>
          </div>
        </Alert>
      )}

      {snapshot.serverError !== null && (
        <Alert
          title="공동편집 서버가 요청을 처리하지 못했습니다."
          detail={snapshot.serverError}
          className="mb-5"
        >
          편집 내용은 이 화면에 그대로 있습니다. 계속 보이면 쓴 내용을 복사해
          두고 새로고침해 주세요.
        </Alert>
      )}

      {snapshot.oversized && (
        <Alert
          title="문서가 커서 실시간 동기화 일부를 보내지 못했습니다."
          className="mb-5"
        >
          공동편집 메시지는 한 번에 {MAX_MESSAGE_BYTES / 1024}KB까지 보낼 수
          있습니다. 나중에 들어온 사람이 지금 본문을 다 받지 못할 수 있습니다.
        </Alert>
      )}
    </>
  );
}

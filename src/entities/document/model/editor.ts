/**
 * 백엔드의 편집자 문자열 "학번 이름"(예: "2412 홍길동")에서 앞의 학번.
 * 학번을 모르는 계정은 백엔드가 그 자리에 `?`를 넣는다 ("? 홍길동").
 */
const STUDENT_NUMBER_PREFIX = /^(\d+|\?)\s+/;

/**
 * 리비전 편집자 문자열에서 화면에 보일 이름만 꺼낸다. 시안의 편집 역사는 이름만 보여 준다.
 * 모양이 다르면 받은 문자열을 그대로 쓴다.
 */
export function getEditorName(editor: string): string {
  const trimmed = editor.trim();
  return trimmed.replace(STUDENT_NUMBER_PREFIX, "") || trimmed;
}

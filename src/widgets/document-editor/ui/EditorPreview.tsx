/**
 * 미리보기 패널.
 * 시안의 예시 문서를 그대로 그린다 — 위키 문법 파서가 없어 편집기에
 * 입력한 내용을 반영하지는 않는다.
 */
export function EditorPreview() {
  return (
    <div className="min-h-[480px] rounded-xl border border-line bg-[#131417] px-[26px] py-6">
      <h2 className="mb-[14px] text-[22px] font-bold">개요</h2>
      <p className="mb-[18px] text-[15.5px] leading-[1.85] text-fg-muted">
        금성고등학교(錦城高等學校)는 서울특별시 ○○구에 위치한{" "}
        <span className="text-accent">공립</span> 일반계 고등학교이다.{" "}
        <span className="text-accent">1982년</span> 개교하여 올해로 44주년을
        맞았다.
      </p>

      <h2 className="mb-[14px] mt-6 text-[22px] font-bold">연혁</h2>
      <p className="text-[15.5px] leading-[1.85] text-fg-muted">
        1981.11 학교법인 금성학원 설립 인가
        <br />
        1982.03 제1회 입학식(신입생 480명)
        <br />
        <span className="rounded-[3px] bg-success/10 px-[3px] text-success">
          2026.07 급식 위생 점검 결과 추가
        </span>
      </p>
    </div>
  );
}

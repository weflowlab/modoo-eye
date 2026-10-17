// About 페이지 소개 본문. 리치텍스트(prose-content) 스타일로 h3 + 문단 나열.
// 문구는 홈페이지(modooeye.kr) 핵심 메시지 기준, 사실 위주 (과장 표현 금지).
import { getClinic } from "@/lib/payload";

export async function AboutIntro() {
  const clinic = await getClinic();
  return (
    // 레퍼런스: prose-content 안에 h3(strong) + 빈 줄로 띄운 p 들
    <div className="prose-content">
      <h3>
        <strong>분야별 전문의가 함께 진료하는 {clinic.name}입니다.</strong>
      </h3>
      <p></p>
      <p>
        <br />
        {clinic.name}({clinic.nameEn})는 대전 둔산동에 있는 안과로,
        <br />
        망막·녹내장·백내장·외안부·성형안과 질환의 풍부한 임상경험을 가진 분야별 전문의가 직접 진료합니다.
      </p>
      <p>
        <br />
        <strong>대학병원 교수 출신 의료진</strong>이 각자의 전문 분야를 나누어 맡고,
        <br />
        여러 질환이 함께 있는 경우에도 한곳에서 협진합니다.
      </p>
      <p>
        <br />
        검사부터 진단, 수술, 수술 후 관리까지 이어지는 <strong>원스톱 진료시스템</strong>으로
        <br />
        환자의 눈 상태에 맞는 치료 방향을 안내합니다.
      </p>
      <p>
        <br />
        {clinic.stats.map((s) => `${s.label} ${s.value}`).join(", ")} ({clinic.statsNote})의 수술 경험을 바탕으로
        <br />
        검사 결과를 충분히 설명하고 환자가 이해한 뒤 치료를 결정할 수 있도록 돕습니다.
      </p>
      <p>
        <br />
        <strong>환자의 눈에 필요한 치료를 정확히 선택한다</strong>는 원칙으로 진료하겠습니다.
      </p>
    </div>
  );
}

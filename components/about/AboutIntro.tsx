// About 페이지 소개 본문. 리치텍스트(prose-content) 스타일로 h3 + 문단 나열. 문구는 플레이스홀더.
import { clinic } from "@/lib/mock";

export function AboutIntro() {
  return (
    // 레퍼런스: prose-content 안에 h3(strong) + 빈 줄로 띄운 p 들
    <div className="prose-content">
      <h3>
        <strong>{clinic.name} 소개 제목 플레이스홀더입니다.</strong>
      </h3>
      <p></p>
      <p>
        <br />
        소개 문구 플레이스홀더 1. 진료 철학을 한두 문장으로 설명합니다.
        <br />
        환자의 눈 상태를 정밀하게 분석해 맞춤형 진료 방향을 제안합니다.
      </p>
      <p>
        <br />
        <strong>주요 진료 분야 플레이스홀더</strong>를 전문적으로 진료하며,
        <br />
        일상 속 눈 건강도 함께 살핍니다.
      </p>
      <p>
        <br />
        검사·수술 장비와 진단 데이터 설명 플레이스홀더.
        <br />
        <strong>환자의 눈에 필요한 치료를 선택</strong>한다는 원칙을 강조합니다.
      </p>
      <p>
        <br />
        진료와 수술 이후 관리 프로그램 설명 플레이스홀더.
      </p>
      <p>
        <br />
        마무리 문구 플레이스홀더.
        <br />
        <strong>끊임없는 연구와 전문적인 치료로 신뢰할 수 있는 결과를 만들어가겠습니다.</strong>
      </p>
    </div>
  );
}

// 글 하단 문구(면책 안내, 상담 블록)의 기본값 단일 출처. 쓰임새는 lib/homeDefaults.ts 와 같다.
// - 프론트(components/post): 관리자 '병원 정보 → 글 하단 문구' 가 비어 있을 때 이 문구를 보여 준다.
// - Payload 설정(globals/Clinic.ts): 필드 defaultValue (반드시 함수로, 이유는 globals/HomePage.ts 참고).
// - 시드: 비어 있는 필드를 이 문구로 채운다.
// "|" 는 모바일에서만 줄바꿈(components/ui/MobileBreaks), "\n" 은 모든 화면에서 줄바꿈.

export const DISCLAIMER_TEXT =
  "본 콘텐츠는 질환에 대한 이해를 돕기 위한 정보 제공 목적으로 작성되었으며, 의학적 진단이나 치료를 대신할 수 없습니다. 검사 결과와 치료 방법은 개인의 눈 상태에 따라 차이가 있을 수 있으며, 치료가 필요한 경우 수술·약물 등 모든 치료에는 부작용이 발생할 수 있으므로 반드시 안과 전문의의 정밀검사 및 충분한 상담 후 결정하시기 바랍니다.";

export const CTA_TITLE = "눈의 변화, 미루지 말고 확인하세요";
export const ctaText = (clinicName: string) =>
  `작은 변화도 검사로 확인하면|치료 시기를 놓치지 않을 수 있습니다.\n${clinicName} 분야별 전문의에게|네이버 톡톡으로 상담·예약하세요.`;

// "[의료광고 심의 및 안내사항]" 면책 문구 박스 + 의료기관 주소/전화. 출처 섹션과 CTA 사이에 배치.
// 레퍼런스: 연회색 배경, 1px 테두리, 10px 모서리, 위 여백 34px.
import { clinic } from "@/lib/mock";

type Props = { className?: string };

export function Disclaimer({ className = "" }: Props) {
  return (
    <div
      className={`mt-[34px] rounded-[10px] border border-[#e5ebf0] bg-[#f7f9fb] px-[18px] py-4 text-base leading-[1.7] text-[#4b5563] ${className}`}
    >
      <strong>[의료광고 심의 및 안내사항]</strong>
      <br />
      본 콘텐츠는 질환에 대한 이해를 돕기 위한 정보 제공 목적으로 작성되었으며, 의학적 진단이나 치료를 대신할 수 없습니다. 검사
      결과와 치료 방법은 개인의 눈 상태에 따라 차이가 있을 수 있으며, 치료가 필요한 경우 수술·약물 등 모든 치료에는 부작용이
      발생할 수 있으므로 반드시 안과 전문의의 정밀검사 및 충분한 상담 후 결정하시기 바랍니다.
      <br />
      의료기관: {clinic.name} · {clinic.address} · 대표전화 {clinic.phone}
    </div>
  );
}

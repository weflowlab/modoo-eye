// "[의료광고 심의 및 안내사항]" 면책 문구 박스 + 의료기관 정보. 출처 섹션과 CTA 사이에 배치.
// 문구는 관리자 '병원 정보 → 글 하단 문구' 에서 바꿀 수 있고, 비어 있으면 기본 문구.
import { getClinic } from "@/lib/payload";
import { DISCLAIMER_TEXT as DEFAULT_TEXT } from "@/lib/clinicDefaults";

type Props = { className?: string };

export async function Disclaimer({ className = "" }: Props) {
  const clinic = await getClinic();
  const text = clinic.disclaimerText || DEFAULT_TEXT;
  return (
    <div className={`mt-[34px] rounded-[11px] border border-border bg-neutral-50 px-[18px] py-4 text-base leading-[1.7] text-neutral-600 ${className}`}>
      <strong>[의료광고 심의 및 안내사항]</strong>
      <br />
      <span className="whitespace-pre-line">{text}</span>
      {/* 의료기관 정보 한 줄 (영문명·대표자는 생략) */}
      <p className="m-0! mt-2! text-sm text-neutral-500">
        의료기관: {clinic.name} · {clinic.address} · 대표전화 {clinic.phone}
      </p>
    </div>
  );
}

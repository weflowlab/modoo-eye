// 글 하단 상담 블록. 면책 박스 아래에 배치.
// 자체 디자인: 연한 남색 배경 카드, 가운데 정렬 세로 구성 — 제목 → 안내 문구 → 주소·대표전화 → 버튼 2개(네이버 톡톡 / 홈페이지 바로가기).
// 문구는 관리자 '병원 정보 → 글 하단 문구' 에서 바꿀 수 있고, 비어 있으면 기본 문구.
import { IconArrowUpRight, IconMessageCircle } from "@tabler/icons-react";
import { getClinic } from "@/lib/payload";
import { MobileBreaks } from "@/components/ui/MobileBreaks";
import { CTA_TITLE as DEFAULT_TITLE, ctaText as defaultText } from "@/lib/clinicDefaults";

export const CTA_SECTION_ID = "cta";

type Props = { className?: string };

export async function PostCta({ className = "" }: Props) {
  const clinic = await getClinic();
  const title = clinic.ctaTitle || DEFAULT_TITLE;
  const text = clinic.ctaText || defaultText(clinic.name);

  return (
    <div className={`mt-10 rounded-[11px] border border-[var(--brand-primary-20)] bg-[var(--brand-primary-5)] px-6 py-8 text-center md:px-8 md:py-10 ${className}`}>
      <h2 id={CTA_SECTION_ID} className="m-0! text-xl font-bold leading-snug text-foreground md:text-2xl">
        {title}
      </h2>
      <p className="m-0! mt-3! whitespace-pre-line text-[15px] leading-relaxed text-neutral-600 md:text-base">
        <MobileBreaks text={text} />
      </p>

      {/* 주소 · 대표전화 */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-neutral-600 md:text-[15px]">
        <span>{clinic.address}</span>
        <a href={`tel:${clinic.phone.replace(/[^0-9+]/g, "")}`} className="font-semibold text-foreground no-underline! hover:text-primary">
          대표전화 {clinic.phone}
        </a>
      </div>

      {/* 버튼: 네이버 톡톡(초록) / 홈페이지 바로가기(남색 테두리). 모바일도 가로 배치 (글씨 작게) */}
      <div className="mt-6 flex flex-row justify-center gap-2.5">
        <a
          href={clinic.consultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] bg-[#03c75a] px-3 text-sm font-semibold text-white no-underline! transition-colors hover:bg-[#02b04f] sm:h-12 sm:flex-none sm:px-6 sm:text-base"
        >
          <IconMessageCircle className="size-5" />
          네이버 톡톡
        </a>
        <a
          href={clinic.homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-[11px] border border-primary bg-white px-3 text-sm font-semibold text-primary no-underline! transition-colors hover:bg-primary hover:text-white sm:h-12 sm:flex-none sm:px-6 sm:text-base"
        >
          홈페이지 바로가기
          <IconArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

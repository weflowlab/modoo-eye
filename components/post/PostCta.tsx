// 글 하단 상담 블록. 면책 박스 아래에 배치.
// 자체 디자인: 연한 남색 배경 카드, 가운데 정렬 세로 구성 — 제목 → 안내 문구 → 주소·대표전화 → 버튼 2개(네이버 톡톡 / 홈페이지 바로가기).
// 문구는 관리자 '병원 정보 → 글 하단 문구' 에서 바꿀 수 있고, 비어 있으면 기본 문구.
import { IconArrowUpRight, IconMessageCircle } from "@tabler/icons-react";
import { getClinic } from "@/lib/payload";

export const CTA_SECTION_ID = "cta";

const DEFAULT_TITLE = "눈의 변화, 미루지 말고 확인하세요";
const defaultText = (name: string) =>
  `작은 변화도 검사로 확인하면 치료 시기를 놓치지 않을 수 있습니다.\n${name} 분야별 전문의에게 네이버 톡톡으로 상담·예약하세요.`;

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
      <p className="m-0! mt-3! whitespace-pre-line text-[15px] leading-relaxed text-neutral-600 md:text-base">{text}</p>

      {/* 주소 · 대표전화 */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-neutral-600 md:text-[15px]">
        <span>{clinic.address}</span>
        <a href={`tel:${clinic.phone.replace(/[^0-9+]/g, "")}`} className="font-semibold text-foreground no-underline! hover:text-primary">
          대표전화 {clinic.phone}
        </a>
      </div>

      {/* 버튼: 네이버 톡톡(초록) / 홈페이지 바로가기(남색 테두리). 모바일은 세로로 전체 폭 */}
      <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
        <a
          href={clinic.consultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[11px] bg-[#03c75a] px-6 text-base font-semibold text-white no-underline! transition-colors hover:bg-[#02b04f]"
        >
          <IconMessageCircle className="size-5" />
          네이버 톡톡
        </a>
        <a
          href={clinic.homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-[11px] border border-primary bg-white px-6 text-base font-semibold text-primary no-underline! transition-colors hover:bg-primary hover:text-white"
        >
          홈페이지 바로가기
          <IconArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

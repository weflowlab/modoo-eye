// 글 하단 CTA 다크 배너: 제목 + 안내 문구 + 주소/전화/진료시간 + 버튼 묶음. 면책 박스 아래에 배치.
// 레퍼런스: 어두운 배경, 16px 모서리, 가운데 정렬, 버튼은 모바일에서 전체 폭.
import { Button } from "@/components/ui/Button";
import { clinic } from "@/lib/mock";

export const CTA_SECTION_ID = "cta";

type Props = { className?: string };

export function PostCta({ className = "" }: Props) {
  const firstHours = clinic.hours[0];
  return (
    <div
      className={`mt-10 rounded-[16px] bg-neutral-900 px-5 py-[30px] text-center text-neutral-200 md:px-8 md:py-[38px] ${className}`}
    >
      <h2
        id={CTA_SECTION_ID}
        className="mb-3 text-xl font-extrabold leading-[1.45] tracking-[-0.03em] text-white md:text-2xl"
      >
        중심시력은 기다려 주지 않습니다
      </h2>
      <p className="mb-[22px] text-[15.5px] leading-[1.75] text-neutral-400">
        변화가 느껴졌다면 이미 진행이 시작된 신호일 수 있습니다.
        <br />
        {clinic.name}에서 정밀검사로 정확히 확인해 보세요.
      </p>

      {/* 병원 기본 정보 한 줄 */}
      <div className="mb-6 flex flex-wrap justify-center gap-x-[26px] gap-y-2 text-[14.5px] text-neutral-400">
        <span className="whitespace-nowrap">{clinic.address}</span>
        <span className="whitespace-nowrap">대표전화 {clinic.phone}</span>
        {firstHours && (
          <span className="whitespace-nowrap">
            {firstHours.label} {firstHours.value}
          </span>
        )}
      </div>

      {/* 버튼 묶음: 진료 안내 / 홈페이지 / 대표전화 */}
      <div className="flex flex-wrap justify-center gap-2.5">
        <Button variant="primary" size="lg" href={clinic.consultUrl} external className="w-full sm:w-auto">
          진료 안내 보기
        </Button>
        <Button
          variant="outline"
          size="lg"
          href={clinic.homepageUrl}
          external
          className="w-full border-neutral-600 text-neutral-200 hover:border-neutral-400 hover:text-white sm:w-auto"
        >
          홈페이지 바로가기
        </Button>
        <a
          href={`tel:${clinic.phone.replace(/[^0-9+]/g, "")}`}
          className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-600 px-[26px] py-3.5 text-[15.5px] font-bold text-neutral-200 transition-colors duration-200 hover:border-neutral-400 hover:text-white sm:w-auto"
        >
          대표전화 {clinic.phone}
        </a>
      </div>
    </div>
  );
}

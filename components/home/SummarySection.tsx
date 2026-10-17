// 메인 페이지 병원 소개 (회사 소개 느낌). 흰 배경: 아이브로우 + 제목 + 요약 문단, 그 아래 수술 실적 4개를 한 줄로.
// 글자로 정리된 병원 정보라 AI 검색·검색엔진이 병원 요약을 인용하기 쉽다 (AEO 목적도 겸함).
import { Reveal } from "@/components/ui/Reveal";
import { TypingText } from "@/components/ui/TypingText";
import { CountUp } from "@/components/ui/CountUp";
import { getClinic } from "@/lib/payload";
import type { ClinicInfo } from "@/lib/types";

// 홈페이지(modooeye.kr) 핵심 메시지 기준. 사실 위주로 쓰고 "최고·최상" 같은 과장 표현은 쓰지 않는다 (의료광고법).
// Payload 'home' 글로벌 값이 비어 있을 때의 기본값.
const DEFAULT_TITLE = "대전 둔산동 망막·녹내장·백내장 전문 안과";
const defaultText = (clinic: ClinicInfo) =>
  `${clinic.name}는 ${clinic.address}에 있는 안과로,\n망막·녹내장·백내장·외안부·성형안과 분야별 전문의가 대학병원에서의 임상경험을 바탕으로 검사부터 수술 후 관리까지 한곳에서 진료합니다.`;

type Props = {
  title?: string; // HomeContent.summaryTitle
  text?: string; // HomeContent.summaryText
};

export async function SummarySection({ title, text }: Props) {
  const clinic = await getClinic();
  const summaryTitle = title || DEFAULT_TITLE;
  const summaryText = text || defaultText(clinic);

  return (
    <section aria-labelledby="home-summary-title" className="py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 소개: 가운데 정렬 (아이브로우 → 제목 → 문단) */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary md:text-base">ABOUT {clinic.nameEn || clinic.name}</p>
          {/* 제목은 타이핑되듯 한 글자씩 (커서 없음), 문단은 살짝 늦게 떠오른다 */}
          <h2 id="home-summary-title" className="mt-1 whitespace-pre-line text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            <TypingText text={summaryTitle} />
          </h2>
          <Reveal variant="fade-up" delay={0.15}>
            <p className="mt-5 whitespace-pre-line text-base font-medium leading-relaxed text-neutral-700 md:text-lg">{summaryText}</p>
          </Reveal>
        </div>

        {/* 수술 실적: 카드 4개 (홈페이지 공개 수치, 기준 시점 명시) */}
        {clinic.stats.length > 0 && (
          <div className="mt-10 md:mt-14">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {clinic.stats.map((s, i) => (
                <Reveal key={s.label} variant="fade-up" delay={0.1 * i}>
                  <div className="rounded-[11px] border border-neutral-200 bg-neutral-50 px-5 py-6 text-center transition-shadow hover:shadow-[0_8px_30px_0_var(--brand-primary-10)] md:px-6 md:py-8">
                    <dd className="text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
                      {/* 숫자가 0 부터 올라감 */}
                      <CountUp value={s.value} />
                    </dd>
                    <dt className="mt-2 text-sm text-neutral-600 md:text-base">{s.label}</dt>
                  </div>
                </Reveal>
              ))}
            </dl>
            {clinic.statsNote && <p className="mt-4 text-center text-xs text-neutral-400 md:text-sm">* {clinic.statsNote}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

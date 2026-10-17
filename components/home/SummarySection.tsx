// 메인 페이지 "핵심 요약" 블록. 그라데이션 요약 카드 + 핵심 포인트 불릿 카드.
// 레퍼런스: 마지막 <section> 상단 (요약/FAQ/출처가 한 섹션 안에 있어 래퍼는 page.tsx 가 가진다)
import { getClinic } from "@/lib/payload";
import type { ClinicInfo } from "@/lib/types";

// 홈페이지(modooeye.kr) 핵심 메시지 기준. 사실 위주로 쓰고 "최고·최상" 같은 과장 표현은 쓰지 않는다 (의료광고법).
// Payload 'home' 글로벌 값이 비어 있을 때의 기본값.
const DEFAULT_TITLE = "핵심 요약";
const defaultText = (clinic: ClinicInfo) =>
  `${clinic.name}는 ${clinic.address}에 있는 안과로, 망막·녹내장·백내장·외안부·성형안과 분야별 전문의가 대학병원에서의 임상경험을 바탕으로 검사부터 수술 후 관리까지 한곳에서 진료합니다.`;
const defaultKeyPoints = (clinic: ClinicInfo) => [
  "망막·녹내장·백내장·외안부·성형안과 질환의 풍부한 임상경험을 가진 분야별 전문의",
  "대학병원 교수 출신 의료진이 직접 진료·수술",
  "검사부터 진단, 수술, 수술 후 관리까지 이어지는 원스톱 진료시스템",
  "망막·녹내장·백내장·눈꺼풀 등 여러 질환이 함께 있어도 분야별 전문의가 협진",
  `${clinic.directions}, 인근 주차장 이용 가능`,
];

type Props = {
  title?: string; // HomeContent.summaryTitle
  text?: string; // HomeContent.summaryText
  keyPoints?: string[]; // HomeContent.keyPoints
};

export async function SummarySection({ title, text, keyPoints }: Props) {
  const clinic = await getClinic();
  const summaryTitle = title || DEFAULT_TITLE;
  const summaryText = text || defaultText(clinic);
  const points = keyPoints && keyPoints.length > 0 ? keyPoints : defaultKeyPoints(clinic);

  return (
    <div aria-labelledby="home-summary-title">
      {/* 요약 카드: 브랜드 그라데이션 배경. 레퍼런스의 /90 알파는 밝은 끝에서 흰 글씨 대비가 4.3:1 로 AA 미달이라 불투명으로 */}
      <div className="rounded-lg border border-primary/40 bg-linear-to-br from-brand-primary to-brand-secondary p-4 text-primary-foreground md:p-6">
        <h2 id="home-summary-title" className="text-sm font-semibold">{summaryTitle}</h2>
        <p className="mt-2 whitespace-pre-line text-base md:text-lg">{summaryText}</p>
        {/* 수술 실적 (홈페이지 공개 수치, 기준 시점 명시) */}
        {clinic.stats.length > 0 && (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {clinic.stats.map((s) => (
                <div key={s.label} className="rounded-md bg-black/10 px-3 py-2">
                  <dt className="text-xs md:text-sm">{s.label}</dt>
                  <dd className="text-base font-bold md:text-lg">{s.value}</dd>
                </div>
              ))}
            </dl>
            {clinic.statsNote && <p className="mt-2 text-xs">{clinic.statsNote}</p>}
          </>
        )}
      </div>

      {/* 핵심 포인트 불릿 */}
      <div className="mt-4 rounded-lg border border-neutral-200 p-4 md:p-6">
        <h2 className="text-sm font-semibold text-neutral-700">핵심 포인트</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-neutral-500">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

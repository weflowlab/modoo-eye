// 메인 페이지 "핵심 요약" 블록. 그라데이션 요약 카드 + 핵심 포인트 불릿 카드.
// 레퍼런스: 마지막 <section> 상단 (요약/FAQ/출처가 한 섹션 안에 있어 래퍼는 page.tsx 가 가진다)
import { clinic } from "@/lib/mock";

// 일반화된 플레이스홀더 문구. 추후 CMS 글로벌 설정으로 교체.
const keyPoints = [
  "가장 자신 있는 분야를 중심으로 진료하는 안과",
  "대학병원 전임의 경력 의료진 진료",
  "다양한 안질환의 검사 및 진료",
  "복합 안질환의 검사 및 진료",
  "정밀검사 장비 운용",
  "검사 결과와 환자의 눈 구조를 반영한 치료·수술 방향 안내",
  "검사 및 수술 장비를 활용한 체계적인 진료",
  "수술 후에도 지속적인 관리 프로그램 운영",
];

export function SummarySection() {
  return (
    <div aria-labelledby="home-summary-title">
      {/* 요약 카드: 브랜드 그라데이션 배경 */}
      <div className="rounded-lg border border-primary/40 bg-linear-to-br from-brand-primary/90 to-brand-secondary/90 p-4 text-primary-foreground md:p-6">
        <h2 id="home-summary-title" className="text-sm font-semibold">핵심 요약</h2>
        <p className="mt-2 text-base md:text-lg">
          {clinic.name}은 {clinic.address}에 위치한 안과로, 가장 자신 있는 분야에 집중하여 환자의 눈 상태에 맞는 치료 방향을 안내합니다.
        </p>
      </div>

      {/* 핵심 포인트 불릿 */}
      <div className="mt-4 rounded-lg border border-neutral-200 p-4 md:p-6">
        <h2 className="text-sm font-semibold text-neutral-700">핵심 포인트</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-neutral-500">
          {keyPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

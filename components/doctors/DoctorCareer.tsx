// 의료진 상세 "연혁" 섹션. 분류(경력/학회활동/연수)별 목록을 dl 로 표시.
// 모바일: 분류명 위 + 목록 아래 / md 이상: 분류명 6.25rem 왼쪽 열 + 목록 오른쪽.
import type { Doctor } from "@/lib/types";
import { DoctorSectionTitle } from "./DoctorSectionTitle";

type Props = { doctor: Doctor };

// 목 데이터에 분류별 약력이 없어 경력 외 분류는 플레이스홀더 상수로 채움
const EXTRA_GROUPS: { label: string; items: string[] }[] = [
  { label: "학회활동", items: ["OO학회 정회원 플레이스홀더", "OO학회 정회원 플레이스홀더", "OO학회 정회원 플레이스홀더"] },
  { label: "연수", items: ["OO병원 연수 플레이스홀더", "OO대학병원 연수 플레이스홀더"] },
];

export function DoctorCareer({ doctor }: Props) {
  const groups = [{ label: "경력", items: doctor.career }, ...EXTRA_GROUPS];

  return (
    <section id="career" className="scroll-mt-24">
      <DoctorSectionTitle>
        {doctor.name} {doctor.title}님 연혁
      </DoctorSectionTitle>

      {/* 레퍼런스: 위아래 2px 진한 선, 분류 사이 1px 연한 선, md 이상 max-h 37.5rem 내부 스크롤(얇은 스크롤바) */}
      <dl className="divide-y divide-neutral-200 border-y border-neutral-700 border-t-2 border-b-2 md:max-h-150 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--primary)_transparent] mt-6 md:mt-8">
        {groups.map((g) => (
          <div key={g.label} className="grid grid-cols-1 gap-y-3 py-6 md:grid-cols-[6.25rem_1fr] md:gap-x-8 md:py-8">
            <dt className="text-base font-semibold text-neutral-800 md:text-lg">{g.label}</dt>
            <dd>
              <ul className="flex flex-col gap-2">
                {g.items.map((item, i) => (
                  <li key={`${g.label}-${i}`} className="flex gap-x-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// 메인 페이지 "자주 묻는 질문" 블록. 병원 단위 FAQ 5개를 아코디언으로 표시.
// 레퍼런스: 요약 섹션 안 mt-10 블록 (native <details> 목록)
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { clinic } from "@/lib/mock";
import type { FaqItem } from "@/lib/types";

// 병원 단위 질문이라 글 FAQ 대신 섹션 상수로 둔다. 문구는 플레이스홀더.
const faqItems: FaqItem[] = [
  { question: `${clinic.name}는 어떤 질환을 진료하나요?`, answer: "답변 플레이스홀더. 주요 진료 분야와 질환 목록을 안내합니다." },
  { question: `${clinic.name}에서는 정밀검사를 받을 수 있나요?`, answer: "답변 플레이스홀더. 보유 검사 장비와 검사 항목을 안내합니다." },
  { question: "두 가지 이상 질환이 함께 있어도 진료받을 수 있나요?", answer: "답변 플레이스홀더. 복합 질환 진료 방식을 안내합니다." },
  { question: `${clinic.name}의 진료시간은 어떻게 되나요?`, answer: `답변 플레이스홀더. ${clinic.hours.map((h) => `${h.label} ${h.value}`).join(", ")}.` },
  { question: `${clinic.name}는 어디에 있나요?`, answer: `답변 플레이스홀더. ${clinic.address}. 대표전화 ${clinic.phone}.` },
];

export function FaqSection() {
  return (
    <div className="mt-10">
      <h2 className="mb-3 text-lg font-bold">자주 묻는 질문</h2>
      {/* 레퍼런스: divide-y + rounded-lg border 박스 안에 details 목록 */}
      <FaqAccordion items={faqItems} className="divide-y divide-neutral-200 rounded-lg border border-neutral-200" />
    </div>
  );
}

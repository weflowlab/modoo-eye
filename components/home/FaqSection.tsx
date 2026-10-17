// 메인 페이지 "자주 묻는 질문" 섹션 (푸터 바로 위). 왼쪽 아이브로우 + 제목 + 안내, 오른쪽 아코디언.
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { getClinic } from "@/lib/payload";
import type { ClinicInfo, FaqItem } from "@/lib/types";

// Payload 'home' 글로벌의 FAQ 가 비어 있을 때의 기본값. 병원 정보는 clinic 에서 가져온다.
const defaultFaq = (clinic: ClinicInfo): FaqItem[] => [
  {
    question: `${clinic.name}는 어떤 질환을 진료하나요?`,
    answer:
      "망막질환(당뇨망막병증·황반변성·망막박리 등), 녹내장, 노안·백내장, 외안부·건성안(안구건조증, 각막·결막 질환), 성형안과(눈꺼풀·눈물길 질환)를 분야별 전문의가 나누어 진료합니다.",
  },
  {
    question: "대학병원에서 하던 수술도 가능한가요?",
    answer: `망막 수술과 주사 치료, 녹내장 수술, 노안·백내장 수술, 눈꺼풀·눈물길 수술을 대학병원 교수 출신 의료진이 직접 집도합니다. 검사부터 진단, 수술, 수술 후 관리까지 한곳에서 이어지는 원스톱 진료시스템으로 운영하며, 수술 가능 여부는 정밀검사 후 상담을 통해 결정합니다.`,
  },
  {
    question: "진료시간은 어떻게 되나요?",
    answer: `${clinic.hours.map((h) => `${h.label} ${h.value}`).join(" / ")} 입니다.`,
  },
  {
    question: "주차는 어디에 하나요?",
    answer: `${clinic.parking.join(", ")}을 이용하실 수 있습니다. 대중교통은 ${clinic.directions} 거리입니다.`,
  },
  {
    question: "예약·상담은 어떻게 하나요?",
    answer: `네이버 톡톡 또는 카카오채널로 문의·예약하실 수 있고, 대표전화 ${clinic.phone}로 전화 예약도 가능합니다. 화면 오른쪽 아래 퀵메뉴에서 바로 연결됩니다.`,
  },
];

type Props = { items?: FaqItem[] }; // HomeContent.faq

export async function FaqSection({ items }: Props) {
  const clinic = await getClinic();
  const faqItems = items && items.length > 0 ? items : defaultFaq(clinic);

  return (
    <section aria-labelledby="home-faq-title" className="py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          {/* 왼쪽: 아이브로우 + 제목 + 안내 */}
          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-primary md:text-base">FAQ</p>
            <h2 id="home-faq-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              자주 묻는 질문
            </h2>
            <p className="mt-3 whitespace-pre-line text-base text-neutral-600 md:text-lg">
              {"진료·예약·주차 등 자주 문의하시는 내용을 모았습니다.\n더 궁금한 점은 오른쪽 아래 퀵메뉴로 문의해 주세요."}
            </p>
          </div>
          {/* 오른쪽: 아코디언 */}
          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} className="divide-y divide-neutral-200 border-y border-neutral-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

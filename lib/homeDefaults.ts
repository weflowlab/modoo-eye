// 메인 페이지 기본 문구의 단일 출처.
// - 프론트 컴포넌트: Payload 'home' 글로벌 값이 비어 있을 때 이 문구를 보여 준다.
// - Payload 설정(globals/HomePage.ts): 필드 defaultValue 로 써서 새 DB 에서도 관리자 화면에 미리 채워진다.
// - 시드(/api/dev-seed): 비어 있는 필드를 이 문구로 채워 관리자가 "지금 보이는 글"을 그대로 수정할 수 있게 한다.
// 문구는 홈페이지(modooeye.kr) 핵심 메시지 기준. 사실 위주로 쓰고 "최고·최상" 같은 과장 표현은 쓰지 않는다 (의료광고법).
// "|" 는 모바일에서만 줄바꿈(components/ui/MobileBreaks), "\n" 은 모든 화면에서 줄바꿈.
import type { ClinicInfo, FaqItem } from "./types";

// 히어로
export const heroTitle = (clinic: Pick<ClinicInfo, "name">) => `${clinic.name} 의료진이\n직접 쓰는 안과 지식 가이드`;
export const HERO_TEXT =
  "망막·녹내장·백내장·외안부·성형안과 분야별 전문의가 직접 집필한 안과 정보에서 궁금한 점의 해답을 찾아보세요.";
export const SEARCH_PLACEHOLDER = "증상이나 질환명을 검색해 보세요";

// 배너 슬라이드 (이미지 없이 문구만. 이미지는 관리자에서 올린다)
export const BANNERS: { label: string; text: string }[] = [
  {
    label: "분야별 전문의가 함께 보는 안과",
    text: "망막·녹내장·백내장·외안부·성형안과 질환의|풍부한 임상경험을 가진\n분야별 전문의가 직접 진료합니다.",
  },
  {
    label: "대학병원 교수 출신 의료진의 원스톱 진료",
    text: "검사부터 진단, 수술, 수술 후 관리까지 한곳에서.\n대학병원에서 진료하고 가르쳐 온 의료진이|환자의 눈 상태에 맞는 치료 방향을 안내합니다.",
  },
];

// 핵심 요약 (ABOUT)
export const SUMMARY_TITLE = "대전 둔산동|망막·녹내장·백내장 전문 안과";
export const summaryText = (clinic: Pick<ClinicInfo, "name" | "address">) =>
  `${clinic.name}는 ${clinic.address.replace("238, ", "238,|")}에 있는 안과로,\n망막·녹내장·백내장·외안부·성형안과 분야별 전문의가 대학병원에서의 임상경험을 바탕으로|검사부터 수술 후 관리까지 한곳에서 진료합니다.`;

// 장점 카드 4개 (WHY). 아이콘은 components/home/StrengthsSection 에서 순서대로 붙는다.
export const KEY_POINTS: { title: string; text: string }[] = [
  { title: "분야별 전문의", text: "망막·녹내장·백내장·외안부·성형안과 분야별 전문의가 각자의 전문 분야를 진료합니다." },
  { title: "대학병원 교수 출신", text: "대학병원에서 진료하고 가르쳐 온 의료진이\n직접 진료하고 수술합니다." },
  { title: "원스톱 진료", text: "검사·진단·수술·수술 후 관리까지\n한곳에서 이어집니다." },
  { title: "분야 간 협진", text: "여러 질환이 함께 있어도\n분야별 전문의가 함께 진료 방향을 정합니다." },
];

// 자주 묻는 질문. 병원 정보(진료시간·주차·전화)는 clinic 에서 가져온다.
export const faq = (clinic: Pick<ClinicInfo, "name" | "hours" | "parking" | "directions" | "phone">): FaqItem[] => [
  {
    question: `${clinic.name}는 어떤 질환을 진료하나요?`,
    answer:
      "망막질환(당뇨망막병증·황반변성·망막박리 등), 녹내장, 노안·백내장, 외안부·건성안(안구건조증, 각막·결막 질환), 성형안과(눈꺼풀·눈물길 질환)를 분야별 전문의가 나누어 진료합니다.",
  },
  {
    question: "대학병원에서 하던 수술도 가능한가요?",
    answer:
      "망막 수술과 주사 치료, 녹내장 수술, 노안·백내장 수술, 눈꺼풀·눈물길 수술을 대학병원 교수 출신 의료진이 직접 집도합니다. 검사부터 진단, 수술, 수술 후 관리까지 한곳에서 이어지는 원스톱 진료시스템으로 운영하며, 수술 가능 여부는 정밀검사 후 상담을 통해 결정합니다.",
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

// 모두의안과(대전 둔산동) 목 데이터. 병원·의료진·카테고리는 구글폼 + 홈페이지(modooeye.kr) 확인 정보.
// 글(posts)은 레이아웃 확인용 자리표시 글이며 실제 글은 Payload CMS 에서 작성한다.
import type { Category, ClinicInfo, Doctor, Post } from "./types";

const HOME = "https://modooeye.kr";

export const clinic: ClinicInfo = {
  name: "모두의안과",
  nameEn: "MODOO'S EYE CLINIC",
  homepageUrl: HOME,
  address: "대전광역시 서구 대덕대로 238, 3층 (둔산동)",
  phone: "042-721-2211",
  fax: "042-721-2213",
  businessNumber: "505-96-79534",
  representatives: ["이영훈", "진선영", "백승국"],
  hours: [
    { label: "월~금", value: "09:00 - 18:00" },
    { label: "토요일", value: "09:00 - 13:00" },
    { label: "점심시간", value: "13:00 - 14:00" },
    { label: "휴진", value: "일요일 및 공휴일" },
  ],
  directions: "지하철 1호선 정부청사역 2번 출구 도보 5분",
  parking: ["킴벨빌딩 기계식주차", "서구청 노상주차장", "블랙타워 주차빌딩", "이마트 둔산점"],
  mapLinks: [
    { label: "네이버 지도", href: "https://map.naver.com/p/search/모두의안과%20둔산동" },
    { label: "카카오 지도", href: "https://map.kakao.com/?q=모두의안과%20둔산동" },
    { label: "구글 지도", href: "https://www.google.com/maps/search/모두의안과+둔산동" },
  ],
  sns: [
    { label: "카카오채널", href: "https://pf.kakao.com/_MxfHHb" },
    { label: "네이버 톡톡", href: "https://talk.naver.com/ct/w46qv0" },
  ],
  legalLinks: [
    { label: "개인정보처리방침", href: `${HOME}/base/privacy.php` },
    { label: "환자의 권리와 의무", href: `${HOME}/base/obligations.php` },
    { label: "비급여 진료항목 안내", href: `${HOME}/base/non_payment.php` },
  ],
  homepageMenu: [
    { label: "병원소개", href: `${HOME}/base/comp/comp.php` },
    { label: "의료진소개", href: `${HOME}/base/comp/comp1.php` },
    { label: "망막클리닉", href: `${HOME}/base/retina/retina.php` },
    { label: "녹내장클리닉", href: `${HOME}/base/glau/glau.php` },
    { label: "외안부클리닉", href: `${HOME}/base/wean/wean.php` },
    { label: "성형안과클리닉", href: `${HOME}/base/plastic/plastic.php` },
    { label: "노안/백내장클리닉", href: `${HOME}/base/pres/pres.php` },
    { label: "오시는 길", href: `${HOME}/base/comp/comp3.php` },
    { label: "온라인상담", href: `${HOME}/base/cus/cus2.php` },
  ],
  consultUrl: "https://talk.naver.com/ct/w46qv0",
  kakaoChannelUrl: "https://pf.kakao.com/_MxfHHb",
  stats: [
    { label: "망막수술", value: "7,000례 이상" },
    { label: "망막주사", value: "60,000례 이상" },
    { label: "녹내장 수술", value: "1,100례 이상" },
    { label: "노안/백내장 수술", value: "12,000례 이상" },
  ],
  statsNote: "2024년 12월 기준",
};

// 홈페이지 클리닉 구조 그대로. slug 는 영문.
export const categories: Category[] = [
  { slug: "retina", name: "망막질환", description: "당뇨망막병증·황반변성·망막박리 등 망막 질환의 증상·검사·치료 안내" },
  { slug: "glaucoma", name: "녹내장", description: "녹내장의 조기 발견, 안압 관리, 약물·레이저·수술 치료 안내" },
  { slug: "cornea", name: "외안부·건성안", description: "안구건조증, 각막·결막 질환 등 외안부 질환의 원인과 관리" },
  { slug: "oculoplastic", name: "성형안과", description: "눈꺼풀처짐, 눈물길 질환 등 눈꺼풀·눈물길 질환 안내" },
  { slug: "cataract", name: "노안·백내장", description: "노안과 백내장 수술, 인공수정체 선택과 수술 후 관리" },
];

export const popularKeywords = ["황반변성", "녹내장", "백내장", "안구건조증"];

// 의료진 5명 (홈페이지 의료진소개 원문 기준)
export const doctors: Doctor[] = [
  {
    slug: "lee-younghoon",
    name: "이영훈",
    title: "대표원장",
    specialties: ["망막", "당뇨망막병증", "황반변성", "망막박리"],
    bio: "대학병원에서 망막 질환을 진료하고 가르쳐 온 경험을 바탕으로, 당뇨망막병증·황반변성·망막박리 환자의 눈 상태에 맞는 치료 방향을 안내합니다.",
    career: ["전) 건양의대 김안과병원 망막과 교수", "전) 건양대학교병원 안과 부교수", "전) 건양대학교병원 안센터장 및 안과장"],
  },
  {
    slug: "jin-sunyoung",
    name: "진선영",
    title: "대표원장",
    specialties: ["녹내장", "백내장"],
    bio: "녹내장은 조기 발견과 꾸준한 관리가 중요한 질환입니다. 녹내장과 백내장을 함께 살피며 장기적인 시기능 보존을 목표로 진료합니다.",
    career: ["전) 건양의대 김안과병원 녹내장과 교수", "전) 건양대학교병원 안과 부교수", "전) 건양의대 감각기학 책임교수"],
  },
  {
    slug: "baek-seungkuk",
    name: "백승국",
    title: "대표원장",
    specialties: ["망막", "백내장"],
    bio: "망막 질환과 백내장을 함께 진료하며, 검사 결과를 충분히 설명하고 환자가 이해한 뒤 치료를 결정할 수 있도록 돕습니다.",
    career: ["전) 건양의대 김안과병원 망막과 교수", "전) 건양대학병원 안과 조교수", "전) 밝은누리안과병원 망막센터장"],
  },
  {
    slug: "ha-myungsook",
    name: "하명숙",
    title: "원장",
    specialties: ["성형안과", "눈꺼풀·눈물길"],
    bio: "눈꺼풀처짐, 눈물흘림 등 눈꺼풀·눈물길 질환을 진료합니다. 기능 회복과 자연스러운 모양을 함께 고려해 치료 계획을 세웁니다.",
    career: ["전) 건양대학교병원 안과장 및 주임교수", "전) 서울가톨릭대학교 의과대학 안과 외래교수", "전) 크로바안과 원장"],
  },
  {
    slug: "son-myungseo",
    name: "손명서",
    title: "원장",
    specialties: ["외안부", "각막", "건성안"],
    bio: "안구건조증과 각막·결막 질환을 진료합니다. 증상의 원인을 구분해 환자 생활에 맞는 관리 방법을 함께 찾아갑니다.",
    career: ["전) 대구가톨릭대학교병원 전안부 전임의 및 교수", "전) 이안과병원 원장"],
  },
];

// 글 본문 섹션 샘플 (목차/표/이미지/목록 등 모든 요소를 한 번씩 포함)
const sampleSections: Post["sections"] = [
  {
    id: "intro",
    heading: "01. 질환이란 무엇인가",
    html: `<p><strong>질환 정의</strong>를 설명하는 도입 문단 플레이스홀더입니다. 핵심어는 <strong>굵게</strong> 강조합니다.</p><p>두 번째 문단 플레이스홀더. 증상과 발생 원인을 간단히 설명합니다.</p>`,
  },
  {
    id: "self-check",
    heading: "02. 자가진단 방법",
    html: `<h3>자가검사 4단계</h3><ol><li>1단계 설명 플레이스홀더</li><li>2단계 설명 플레이스홀더</li><li>3단계 설명 플레이스홀더</li><li>4단계 설명 플레이스홀더</li></ol><p><strong>다음에 해당하면 진료를 권합니다.</strong></p><ul><li>체크 항목 1</li><li>체크 항목 2</li><li>체크 항목 3</li></ul>`,
  },
  {
    id: "compare",
    heading: "03. 관리 방식 비교",
    html: `<table><thead><tr><th>구분</th><th>기존 방식</th><th>정밀검사 기반 치료</th></tr></thead><tbody><tr><td>검사</td><td>기본 검사</td><td>정밀 검사</td></tr><tr><td>치료</td><td>경과 관찰</td><td>맞춤 치료</td></tr><tr><td>주기</td><td>6개월</td><td>1~3개월</td></tr></tbody></table>`,
  },
  {
    id: "exam",
    heading: "04. 검사·치료 과정",
    html: `<p>검사 당일 참고하실 내용 플레이스홀더입니다.</p><ol><li>접수 및 문진</li><li>기본 검사</li><li>정밀 검사</li><li>진료 및 치료 계획</li></ol>`,
  },
  {
    id: "after",
    heading: "05. 치료 후 관리",
    html: `<p>치료 후 생활 관리 안내 플레이스홀더.</p><blockquote>인용/강조 문구 플레이스홀더</blockquote>`,
  },
  {
    id: "summary",
    heading: "06. 핵심 요약",
    html: `<ul><li>요약 1</li><li>요약 2</li><li>요약 3</li></ul>`,
  },
];

const sampleFaq = [
  { question: "이 질환은 어떤 증상으로 시작하나요?", answer: "답변 플레이스홀더. 초기 증상을 2~3문장으로 설명합니다." },
  { question: "검사는 얼마나 걸리나요?", answer: "답변 플레이스홀더. 소요 시간과 준비 사항을 안내합니다." },
  { question: "치료 후 바로 일상생활이 가능한가요?", answer: "답변 플레이스홀더. 회복 기간과 주의점을 안내합니다." },
  { question: "비용은 어떻게 되나요?", answer: "답변 플레이스홀더. 비급여 진료항목 안내 페이지로 연결합니다." },
  { question: "재발할 수 있나요?", answer: "답변 플레이스홀더. 재발 가능성과 정기 검진 주기를 안내합니다." },
];

const sampleSources = [
  { label: "질병관리청 국가건강정보포털", href: "#" },
  { label: "미국 국립안연구소(NEI)", href: "#" },
  { label: "대한안과학회", href: "#" },
  { label: "관련 임상연구 논문", href: "#" },
];

// 2026-10-17 기준 n일 전 날짜 문자열. new Date() 를 쓰면 Next 프리렌더가 "불안정한 값"으로 막는다.
function isoDaysBefore(n: number) {
  const day = 17 - n;
  return day >= 1
    ? `2026-10-${String(day).padStart(2, "0")}T00:00:00.000Z`
    : `2026-09-${String(30 + day).padStart(2, "0")}T00:00:00.000Z`;
}

// 자리표시 글 목록: [카테고리 slug, 제목, 작성 의료진 slug]. 카테고리별 3~4개, 작성자는 전문 분야에 맞춰 분산.
const titles = [
  ["retina", "당뇨망막병증, 검사 주기와 치료 시기", "lee-younghoon"],
  ["glaucoma", "녹내장 초기 증상과 조기 발견이 중요한 이유", "jin-sunyoung"],
  ["cataract", "백내장 수술 전 검사와 당일 과정", "baek-seungkuk"],
  ["cornea", "안구건조증 원인별 치료 방법", "son-myungseo"],
  ["oculoplastic", "눈꺼풀처짐(안검하수), 수술이 필요한 경우", "ha-myungsook"],
  ["retina", "황반변성 자가진단과 항체주사 치료", "baek-seungkuk"],
  ["glaucoma", "안압이 정상인데도 녹내장일 수 있나요", "jin-sunyoung"],
  ["cataract", "노안 교정 다초점 인공수정체 선택 기준", "jin-sunyoung"],
  ["cornea", "마이봄샘 기능장애와 눈꺼풀 관리", "son-myungseo"],
  ["oculoplastic", "눈물흘림 원인과 눈물길 검사", "ha-myungsook"],
  ["retina", "망막박리, 통증 없이 진행되는 응급 질환", "lee-younghoon"],
  ["glaucoma", "녹내장 안약, 꾸준히 넣어야 하는 이유", "jin-sunyoung"],
  ["cataract", "백내장 수술 후 관리와 주의사항", "baek-seungkuk"],
  ["cornea", "인공눈물 올바르게 고르는 법", "son-myungseo"],
  ["oculoplastic", "다래끼와 눈꺼풀 혹, 어떻게 구분하나요", "ha-myungsook"],
  ["retina", "비문증·광시증, 눈앞의 날파리와 위험 신호", "baek-seungkuk"],
  ["glaucoma", "녹내장 수술은 언제 필요한가요", "jin-sunyoung"],
  ["cataract", "후발백내장, 재수술 대신 YAG 레이저", "jin-sunyoung"],
  ["cornea", "각막염과 결막염, 어떻게 다른가요", "son-myungseo"],
] as const;

const POST_COUNT = titles.length;

// 카테고리별로 글을 여러 개 생성 (목록/더보기/인기순 확인용)
function makePost(i: number, category: string, title: string, author: string): Post {
  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;
  return {
    slug: `sample-post-${i}`,
    category,
    title,
    summary: `${title}에 대한 카드 요약 플레이스홀더입니다. 핵심 내용을 한두 줄로 소개합니다.`,
    publishedAt: isoDaysBefore(i), // Date 생성자 없이 고정 문자열 (프리렌더 안정성)
    author,
    tags: [categoryName, "증상", "검사", "치료", "예방", "자주 묻는 질문"],
    views: 1000 - i * 37,
    sections: sampleSections,
    faq: sampleFaq,
    sources: sampleSources,
    related: [1, 2, 3, 4].map((k) => `sample-post-${((i - 1 + k) % POST_COUNT) + 1}`),
  };
}

export const posts: Post[] = titles.map(([c, t, a], i) => makePost(i + 1, c, t, a));

// ── 조회 헬퍼 (Payload 로 교체 시 시그니처 유지) ──
export const getPostsByCategory = (slug: string) => posts.filter((p) => p.category === slug);
export const getPost = (category: string, slug: string) =>
  posts.find((p) => p.category === category && p.slug === slug);
export const getPopularPosts = (n = 4) => [...posts].sort((a, b) => b.views - a.views).slice(0, n);
export const getLatestPosts = (n = 6) =>
  [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, n);
export const getDoctor = (slug: string) => doctors.find((d) => d.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const searchPosts = (q: string) =>
  posts.filter((p) => (p.title + p.summary + p.tags.join(" ")).includes(q));

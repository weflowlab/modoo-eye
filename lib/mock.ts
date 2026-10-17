// 레이아웃 작업용 목 데이터. 실제 병원 내용이 아닌 자리표시 문구.
// 다음 단계에서 Payload CMS 조회 함수(lib/payload.ts)로 교체한다.
import type { Category, ClinicInfo, Doctor, Post } from "./types";

export const clinic: ClinicInfo = {
  name: "병원명",
  homepageUrl: "https://example.com",
  address: "주소 플레이스홀더 (시/구/도로명 00, 0층)",
  phone: "000-000-0000",
  hours: [
    { label: "평일", value: "09:00 - 18:00" },
    { label: "토요일", value: "09:00 - 13:00" },
    { label: "점심시간", value: "13:00 - 14:00" },
    { label: "휴진", value: "일요일 및 공휴일" },
  ],
  mapLinks: [
    { label: "네이버 지도", href: "#" },
    { label: "카카오 지도", href: "#" },
    { label: "구글 지도", href: "#" },
  ],
  sns: [
    { label: "유튜브", href: "#" },
    { label: "블로그", href: "#" },
    { label: "인스타그램", href: "#" },
  ],
  legalLinks: [
    { label: "개인정보처리방침", href: "#" },
    { label: "비급여 안내", href: "#" },
    { label: "환자의 권리와 의무", href: "#" },
  ],
  consultUrl: "#",
};

export const categories: Category[] = [
  { slug: "diseases", name: "망막질환", description: "망막 질환 전반의 증상·검사·치료 안내" },
  { slug: "cataract", name: "노안백내장", description: "노안과 백내장 수술 관련 정보" },
  { slug: "child", name: "소아근시억제", description: "소아 근시 진행 억제 치료" },
  { slug: "xerophthalmia", name: "안구건조증", description: "안구건조증 원인과 관리" },
];

export const popularKeywords = ["황반변성", "당뇨망막병증", "노안", "백내장"];

export const doctors: Doctor[] = [
  {
    slug: "dr-one",
    name: "의료진 A",
    title: "대표 원장",
    specialties: ["망막", "백내장", "당뇨망막병증", "황반변성", "망막박리"],
    bio: "망막을 깊이 연구해 온 의료진으로서 환자의 눈높이에 맞춘 진료를 지향합니다.",
    career: ["OO대학교 의과대학 졸업", "OO대학교병원 안과 전문의", "OO학회 정회원", "망막 수술 0,000례"],
  },
  {
    slug: "dr-two",
    name: "의료진 B",
    title: "원장",
    specialties: ["망막", "백내장", "포도막염", "당뇨망막병증", "황반변성"],
    bio: "망막 진료 경험을 바탕으로 환자의 눈 상태를 세심하게 살피는 안과 전문의입니다.",
    career: ["OO대학교 의과대학 졸업", "OO대학교병원 안과 전문의", "OO학회 정회원"],
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
  { question: "비용은 어떻게 되나요?", answer: "답변 플레이스홀더. 비급여 안내 페이지로 연결합니다." },
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

// 카테고리별로 글을 여러 개 생성 (목록/더보기/인기순 확인용)
function makePost(i: number, category: string, title: string): Post {
  return {
    slug: `sample-post-${i}`,
    category,
    title,
    summary: `${title}에 대한 카드 요약 플레이스홀더입니다. 핵심 내용을 한두 줄로 소개합니다.`,
    publishedAt: isoDaysBefore(i), // Date 생성자 없이 고정 문자열 (프리렌더 안정성)
    author: i % 2 === 0 ? "dr-one" : "dr-two",
    tags: ["태그1", "태그2", "태그3", "태그4", "태그5", "태그6"],
    views: 1000 - i * 37,
    sections: sampleSections,
    faq: sampleFaq,
    sources: sampleSources,
    related: [`sample-post-${(i + 1) % 20 + 1}`, `sample-post-${(i + 2) % 20 + 1}`, `sample-post-${(i + 3) % 20 + 1}`, `sample-post-${(i + 4) % 20 + 1}`],
  };
}

const titles = [
  ["diseases", "당뇨망막병증 검사 주기와 치료법"],
  ["diseases", "황반변성 자가진단과 검사 절차"],
  ["diseases", "망막박리, 통증 없이 진행되는 응급 질환 ｜ 증상부터 수술까지"],
  ["diseases", "중심성장액망막병증, 단순 피로가 아닐 수 있습니다"],
  ["diseases", "비문증·광시증, 눈앞의 날파리와 위험 신호"],
  ["diseases", "당뇨황반부종 증상과 항체주사 치료"],
  ["cataract", "후발백내장, 재수술 대신 YAG 레이저"],
  ["diseases", "황반원공 증상과 수술 시기 알아보기"],
  ["diseases", "유리체출혈 원인과 검사·치료 4단계"],
  ["diseases", "망막전막 수술 시기와 경과 관찰 판단 기준"],
  ["diseases", "망막혈관폐쇄증 증상과 정맥·동맥폐쇄 차이 4단계"],
  ["cataract", "노안 교정 다초점 인공수정체 선택 기준"],
  ["cataract", "백내장 수술 전 검사와 당일 과정"],
  ["cataract", "백내장 수술 후 관리와 주의사항"],
  ["child", "소아 근시 진행 억제, 언제 시작해야 할까"],
  ["child", "드림렌즈와 아트로핀 점안 비교"],
  ["child", "아이 시력 검사 주기와 체크포인트"],
  ["xerophthalmia", "안구건조증 원인별 치료 방법"],
  ["xerophthalmia", "마이봄샘 기능장애와 IPL 치료"],
  ["xerophthalmia", "인공눈물 올바르게 고르는 법"],
] as const;

export const posts: Post[] = titles.map(([c, t], i) => makePost(i + 1, c, t));

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

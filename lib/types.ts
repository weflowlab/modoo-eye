// 사이트 전역 데이터 타입. 지금은 lib/mock.ts 의 목 데이터가 채우고,
// 다음 단계에서 Payload CMS 컬렉션 타입으로 교체한다.

export type Category = {
  slug: string; // URL 경로 (예: "diseases")
  name: string; // 메뉴 표시명 (예: "망막질환")
  description?: string;
};

export type Doctor = {
  slug: string; // /doctors/[slug]
  name: string;
  title: string; // 직함 (대표 원장 / 원장)
  specialties: string[]; // 전문 분야 배지
  bio: string; // 한 줄 소개
  career: string[]; // 약력 목록
};

export type FaqItem = { question: string; answer: string };

export type Post = {
  slug: string; // /[category]/[slug]
  category: string; // Category.slug
  title: string;
  summary: string; // 카드 요약 (1~2줄)
  publishedAt: string; // ISO 날짜
  author: string; // Doctor.slug
  tags: string[];
  views: number; // 인기 글 순위용
  // 본문은 섹션 배열. 글 상세에서 목차(TOC)를 heading 으로 자동 생성.
  sections: { id: string; heading: string; html: string }[];
  faq: FaqItem[];
  sources: { label: string; href: string }[];
  related: string[]; // 관련 글 slug 목록
};

export type ClinicInfo = {
  name: string;
  homepageUrl: string;
  address: string;
  phone: string;
  hours: { label: string; value: string }[];
  mapLinks: { label: string; href: string }[];
  sns: { label: string; href: string }[];
  legalLinks: { label: string; href: string }[];
  consultUrl: string; // 글 하단 상담 버튼 연결처 (네이버 톡톡 등)
};

// 프론트 컴포넌트가 쓰는 데이터 타입. lib/payload.ts 가 Payload 문서를 이 모양으로 변환해서 넘긴다.
// (lib/mock.ts 는 시드 데이터와 첫 실행 폴백용으로만 남는다.)

export type Category = {
  slug: string; // URL 경로 (예: "retina")
  name: string; // 메뉴 표시명 (예: "망막질환")
  description?: string;
};

export type ImageRef = { url: string; alt: string; width?: number; height?: number };

export type Doctor = {
  slug: string; // /doctors/[slug]
  name: string;
  title: string; // 직함 (대표원장 / 원장)
  specialties: string[]; // 전문 분야 배지
  bio: string; // 한 줄 소개
  career: string[]; // 약력 목록
  photo?: ImageRef | null; // 프로필 사진 (없으면 Placeholder)
  story?: unknown; // 진료 이야기 (Lexical 리치텍스트 JSON)
};

export type FaqItem = { question: string; answer: string };

export type Post = {
  id?: number; // Payload 문서 id (조회수 증가 등에 사용)
  slug: string; // /[category]/[slug]
  category: string; // Category.slug
  categoryName?: string;
  title: string;
  summary: string; // 카드 요약 (1~2줄)
  publishedAt: string; // ISO 날짜
  author: string; // Doctor.slug
  authorName?: string;
  tags: string[];
  views: number; // 인기 글 순위용
  // 본문. Payload 글은 content(Lexical JSON), 목 데이터는 sections(HTML). 글 상세는 content 를 우선 렌더.
  content?: unknown;
  sections: { id: string; heading: string; html: string }[];
  thumbnail?: ImageRef | null;
  images?: ImageRef[]; // 상단 이미지 슬라이드
  faq: FaqItem[];
  sources: { label: string; href: string }[];
  related: string[]; // 관련 글 slug 목록
};

export type ClinicInfo = {
  name: string;
  nameEn: string; // 영문 표기 (예: MODOO'S EYE CLINIC)
  homepageUrl: string;
  address: string;
  phone: string;
  fax: string;
  businessNumber: string; // 사업자등록번호
  representatives: string[]; // 대표자 이름 목록
  hours: { label: string; value: string }[];
  directions: string; // 대중교통 안내 한 줄 (예: 정부청사역 2번출구 도보 5분)
  parking: string[]; // 이용 가능한 주차장 목록
  mapLinks: { label: string; href: string }[];
  sns: { label: string; href: string }[]; // 채널 (카카오채널, 네이버 톡톡 등)
  legalLinks: { label: string; href: string }[];
  homepageMenu: { label: string; href: string }[]; // 홈페이지 사이트맵 (전체 메뉴 시트의 외부 링크)
  consultUrl: string; // 글 하단 상담·예약 버튼 연결처 (네이버 톡톡)
  kakaoChannelUrl: string; // 카카오채널 (퀵메뉴)
  stats: { label: string; value: string }[]; // 수술 실적 (예: 망막수술 7,000례 이상)
  statsNote: string; // 실적 기준 시점 (예: 2024년 12월 기준)
  disclaimerText: string; // 글 하단 의료광고 안내 문구 (비면 기본 문구)
  ctaTitle: string; // 글 하단 상담 블록 제목 (비면 기본)
  ctaText: string; // 글 하단 상담 블록 안내 문구 (비면 기본)
};

// 메인 페이지 편집 가능 콘텐츠 (Payload 'home' 글로벌)
export type HomeContent = {
  heroImage?: ImageRef | null; // 히어로 배경 사진
  heroTitle: string;
  heroText: string;
  searchPlaceholder: string;
  popularKeywords: string[];
  banners: { image?: ImageRef | null; mobileImage?: ImageRef | null; label: string; text: string }[];
  introLabel: string;
  introText: string;
  summaryTitle: string;
  summaryText: string;
  keyPoints: string[];
  faq: FaqItem[];
  sources: { label: string; href: string }[];
};

// 헤더/푸터/퀵메뉴 등 모든 페이지가 공유하는 사이트 데이터
export type SiteData = {
  clinic: ClinicInfo;
  categories: Category[];
  popularKeywords: string[];
};

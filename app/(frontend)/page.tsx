// 메인 페이지(/). 헤더/푸터는 app/(frontend)/layout.tsx 가 감싸고, 여기서는 본문 섹션만 순서대로 조립한다.
// 구성: 히어로 → 배너 → 가장 많이 본 글 → 최신 글 → 병원 소개 → 장점 카드 → FAQ
// (의료진 섹션은 고객 요청으로 제외. 의료진은 글 하단 작성자 카드에만 표시)
// 데이터: Payload 'home' 글로벌(getHome) + 글 목록. 글로벌 값이 비어 있으면 각 섹션의 기본 문구를 쓴다.
import { getHome, getLatestPosts, getPopularPosts } from "@/lib/payload";
import { HeroSection } from "@/components/home/HeroSection";
import { ClinicIntroSection } from "@/components/home/ClinicIntroSection";
import { PopularPostsSection } from "@/components/home/PopularPostsSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { SummarySection } from "@/components/home/SummarySection";
import { StrengthsSection } from "@/components/home/StrengthsSection";
import { FaqSection } from "@/components/home/FaqSection";

// 조회수 순위(가장 많이 읽는 글)가 갱신되도록 10분마다 다시 생성
export const revalidate = 600;

export default async function HomePage() {
  const [home, popular, latest] = await Promise.all([getHome(), getPopularPosts(4), getLatestPosts(8)]);

  return (
    <>
      <HeroSection title={home.heroTitle} text={home.heroText} placeholder={home.searchPlaceholder} />
      <ClinicIntroSection banners={home.banners} introLabel={home.introLabel} introText={home.introText} />
      <PopularPostsSection posts={popular} />
      <LatestPostsSection posts={latest} />

      {/* 병원 소개(회사 소개형) → 장점 카드 → FAQ(푸터 바로 위). 출처 목록은 글 상세에만 둔다 */}
      <SummarySection title={home.summaryTitle} text={home.summaryText} />
      <StrengthsSection keyPoints={home.keyPoints} />
      <FaqSection items={home.faq} />
    </>
  );
}

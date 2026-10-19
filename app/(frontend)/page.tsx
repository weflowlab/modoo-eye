// 메인 페이지(/). 헤더/푸터는 app/(frontend)/layout.tsx 가 감싸고, 여기서는 본문 섹션만 순서대로 조립한다.
// 구성: 히어로 → 배너 → 가장 많이 본 글 → 최신 글 → 병원 소개 → 장점 카드 → FAQ
// (의료진 섹션은 고객 요청으로 제외. 의료진은 글 하단 작성자 카드에만 표시)
// 데이터: Payload 'home' 글로벌(getHome) + 글 목록. 글로벌 값이 비어 있으면 각 섹션의 기본 문구를 쓴다.
import { Suspense } from "react";
import { getHome, getLatestPosts, getPopularPosts } from "@/lib/payload";
import { HeroSection } from "@/components/home/HeroSection";
import { ClinicIntroSection } from "@/components/home/ClinicIntroSection";
import { PopularPostsSection } from "@/components/home/PopularPostsSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { SummarySection } from "@/components/home/SummarySection";
import { StrengthsSection } from "@/components/home/StrengthsSection";
import { FaqSection } from "@/components/home/FaqSection";

// 최대 1분에 한 번 다시 생성: 예약 발행(발행일이 지난 글)이 1분 안에 나타나고, 조회수 순위도 갱신된다. 방문자는 항상 캐시된 페이지를 받는다.
export const revalidate = 60;

export default async function HomePage() {
  const [home, popular, latest] = await Promise.all([getHome(), getPopularPosts(4), getLatestPosts(8)]);

  return (
    <>
      {/* 무거운 클라이언트 섹션(궤도 애니메이션·스와이퍼·목록)은 Suspense 로 끊어 둔다.
          그래야 헤더(햄버거·검색)가 먼저 상호작용 가능해지고, 그 전에 누른 탭도 React 가 재생해 준다.
          서버에서 HTML 은 이미 다 그려지므로 로딩 표시는 보이지 않는다 */}
      <Suspense>
        <HeroSection title={home.heroTitle} text={home.heroText} placeholder={home.searchPlaceholder} />
      </Suspense>
      <Suspense>
        <ClinicIntroSection banners={home.banners} />
      </Suspense>
      <PopularPostsSection posts={popular} />
      <Suspense>
        <LatestPostsSection posts={latest} />
      </Suspense>

      {/* 병원 소개(회사 소개형) → 장점 카드 → FAQ(푸터 바로 위). 출처 목록은 글 상세에만 둔다 */}
      <SummarySection title={home.summaryTitle} text={home.summaryText} />
      <StrengthsSection keyPoints={home.keyPoints} />
      <FaqSection items={home.faq} />
    </>
  );
}

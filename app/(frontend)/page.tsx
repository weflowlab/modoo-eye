// 메인 페이지(/). 헤더/푸터는 app/(frontend)/layout.tsx 가 감싸고, 여기서는 본문 섹션만 순서대로 조립한다.
// 구성: 히어로 → 배너 → 의료진 소개 → 가장 많이 본 글 → 최신 글 → 병원 소개 → 장점 카드 → FAQ
// 데이터: Payload 'home' 글로벌(getHome) + 의료진 + 글 목록. 관리자에서 비운 문구는 화면에도 나오지 않는다.
import { Suspense } from "react";
import { getDoctors, getHome, getLatestPosts, getPopularPosts } from "@/lib/payload";
import { HeroSection } from "@/components/home/HeroSection";
import { ClinicIntroSection } from "@/components/home/ClinicIntroSection";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { PopularPostsSection } from "@/components/home/PopularPostsSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { SummarySection } from "@/components/home/SummarySection";
import { StrengthsSection } from "@/components/home/StrengthsSection";
import { FaqSection } from "@/components/home/FaqSection";

// 최대 1분에 한 번 다시 생성: 예약 발행(발행일이 지난 글)이 1분 안에 나타나고, 조회수 순위도 갱신된다. 방문자는 항상 캐시된 페이지를 받는다.
export const revalidate = 60;

export default async function HomePage() {
  const [home, popular, latest, doctors] = await Promise.all([getHome(), getPopularPosts(4), getLatestPosts(8), getDoctors()]);

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
      <Suspense>
        <DoctorsSection doctors={doctors} content={home} />
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

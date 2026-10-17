// 메인 페이지(/). 헤더/푸터는 app/layout.tsx 가 감싸고, 여기서는 본문 섹션만 순서대로 조립한다.
// 레퍼런스: blog.kimsretina.com 메인 — 히어로 → 배너(병원 소개) → 의료진 → 인기 글 → 최신 글 → 요약/FAQ/출처
import { HeroSection } from "@/components/home/HeroSection";
import { ClinicIntroSection } from "@/components/home/ClinicIntroSection";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { PopularPostsSection } from "@/components/home/PopularPostsSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { SummarySection } from "@/components/home/SummarySection";
import { FaqSection } from "@/components/home/FaqSection";
import { SourcesSection } from "@/components/home/SourcesSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClinicIntroSection />
      <DoctorsSection />
      <PopularPostsSection />
      <LatestPostsSection />

      {/* 레퍼런스: 요약 + FAQ + 출처는 한 섹션(py-15 md:py-20) 안에 세로로 쌓인다 */}
      <section className="py-15 md:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
          <SummarySection />
          <FaqSection />
          <SourcesSection />
        </div>
      </section>
    </>
  );
}

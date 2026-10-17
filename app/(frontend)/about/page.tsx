// /about — 병원 소개. 브레드크럼 + 제목 + 탭 + 대표 이미지 + 소개 본문.
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageTitle } from "@/components/posts/PageTitle";
import { AboutTabs } from "@/components/about/AboutTabs";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb className="mb-4" items={[{ label: "홈", href: "/" }, { label: "About" }]} />

      {/* 제목: 아래에서 올라오는 등장 애니메이션 */}
      <PageTitle title="About" />

      <AboutTabs />

      {/* 레퍼런스: 이미지와 본문 사이 space-y-8 md:space-y-12 */}
      <div className="mt-10 md:mt-14">
        <div className="space-y-8 md:space-y-12">
          <AboutHero />
          <AboutIntro />
        </div>
      </div>
    </div>
  );
}

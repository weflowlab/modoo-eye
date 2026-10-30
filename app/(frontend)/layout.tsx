import type { Metadata } from "next";
import { Suspense } from "react";
import { draftMode } from "next/headers";
import "../globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { SiteProvider } from "@/components/SiteProvider";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PageTracker } from "@/components/PageTracker";
import { getSiteData } from "@/lib/payload";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

// 사이트 전역 메타. 병원명은 Payload 병원 정보에서 읽는다.
export async function generateMetadata(): Promise<Metadata> {
  const { clinic } = await getSiteData();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${clinic.name} 웹블로그`, template: `%s | ${clinic.name}` },
    description: `${clinic.name} 의료진이 직접 쓰는 안과 질환 정보. 망막·녹내장·백내장·외안부·성형안과 질환의 증상, 검사, 치료 안내.`,
    alternates: { types: { "application/rss+xml": "/rss.xml" } },
    // 공유 이미지는 app/(frontend)/opengraph-image.png (로고) 가 기본. 글 페이지는 썸네일이 있으면 썸네일로 대체된다
    openGraph: { type: "website", siteName: clinic.name, locale: "ko_KR" },
    twitter: { card: "summary_large_image" },
  };
}

// 블로그 프론트 루트 레이아웃: 헤더 + 본문 + 푸터 + 퀵메뉴. (관리자 /admin 은 별도 레이아웃)
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, { isEnabled: isPreview }] = await Promise.all([getSiteData(), draftMode()]);
  const { clinic } = site;

  // 병원 구조화 데이터 (검색엔진·AI 검색이 병원 정보를 읽도록)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: clinic.name,
    alternateName: clinic.nameEn,
    url: clinic.homepageUrl,
    telephone: clinic.phone,
    address: { "@type": "PostalAddress", streetAddress: clinic.address, addressLocality: "대전광역시", addressCountry: "KR" },
    medicalSpecialty: "Ophthalmology",
    sameAs: clinic.sns.map((s) => s.href),
  };

  return (
    <html lang="ko" className="h-full antialiased font-sans">
      <head>
        {/* Pretendard 가변 폰트 (레퍼런스와 동일). 추후 self-host로 교체 가능 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      {/* 모바일은 하단 고정 바(전화/톡톡) 높이만큼 아래 여백을 둬 푸터가 가려지지 않게 */}
      <body className="flex min-h-full flex-col bg-white pb-14 text-slate-800 md:pb-0">
        <SiteProvider value={site}>
          {/* 관리자 미리보기 중이면 저장할 때마다 새로고침 */}
          {isPreview && <LivePreviewListener />}
          {/* 방문 기록 (관리자 "유입 관리"). 미리보기 중에는 세지 않는다 */}
          <Suspense fallback={null}>
            <PageTracker disabled={isPreview} />
          </Suspense>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          {/* 우하단 퀵메뉴 플로팅 버튼 + 드로어 */}
          <FloatingCta />
        </SiteProvider>
      </body>
    </html>
  );
}

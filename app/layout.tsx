import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";

// 사이트 전역 메타. 실제 병원명/설명은 추후 Payload 글로벌 설정에서 가져올 예정.
export const metadata: Metadata = {
  title: {
    default: "병원 웹블로그",
    template: "%s | 병원 웹블로그",
  },
  description: "의료진이 직접 쓰는 안과 지식 가이드",
};

// 루트 레이아웃: 헤더 + 페이지 본문 + 푸터. 모든 페이지에 공통 적용.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased font-sans">
      <head>
        {/* Pretendard 가변 폰트 (레퍼런스와 동일). 추후 self-host로 교체 가능 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white text-slate-800">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* 우하단 퀵메뉴 플로팅 버튼 + 드로어 */}
        <FloatingCta />
      </body>
    </html>
  );
}

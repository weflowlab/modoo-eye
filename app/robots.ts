// robots.txt. 관리자/API/미리보기 경로는 수집 제외. AI 검색 봇 포함 전부 허용.
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/next/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

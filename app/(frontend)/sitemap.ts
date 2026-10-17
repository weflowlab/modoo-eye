// 사이트맵 (/sitemap.xml). 발행된 글·카테고리 페이지를 검색엔진에 알린다.
import type { MetadataRoute } from "next";
import { getAllPosts, getCategories } from "@/lib/payload";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/posts`, changeFrequency: "daily", priority: 0.7 },
    ...categories.map((c) => ({ url: `${SITE_URL}/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/${p.category}/${encodeURIComponent(p.slug)}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

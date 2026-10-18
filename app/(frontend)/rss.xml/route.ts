// RSS 피드 (/rss.xml). 검색엔진·AI 검색·구독기가 새 글을 가져가는 경로.
import { getAllPosts, getClinic } from "@/lib/payload";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

// 최대 1분에 한 번 다시 생성 (예약 발행 글 반영)
export const revalidate = 60;

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(): Promise<Response> {
  const [posts, clinic] = await Promise.all([getAllPosts(), getClinic()]);
  const items = posts
    .slice(0, 50)
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}/${p.category}/${encodeURIComponent(p.slug)}</link>
      <guid>${SITE_URL}/${p.category}/${encodeURIComponent(p.slug)}</guid>
      <description>${escape(p.summary)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.authorName ? `<author>${escape(p.authorName)}</author>` : ""}
      ${p.categoryName ? `<category>${escape(p.categoryName)}</category>` : ""}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(clinic.name)} 웹블로그</title>
    <link>${SITE_URL}</link>
    <description>${escape(clinic.name)} 의료진이 직접 쓰는 안과 질환 정보</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

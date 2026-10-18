// 글 상세 페이지 (/[category]/[slug]). 레퍼런스 blog.kimsretina.com 글 상세 구성을 그대로 옮김.
// 구성: 빵부스러기 → [사이드 관련 글 | 제목·공유 → 목차 → 본문(슬라이드·본문) → 출처 → FAQ → 해시태그 → 상담 CTA → 면책 → 작성자 카드] → 함께 보면 좋은 콘텐츠(인기 글).
// 데이터는 Payload(lib/payload.ts). 관리자 미리보기(draft 모드)면 초안이 보인다.
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getAllPosts, getCategory, getClinic, getDoctor, getPopularPosts, getPost, getPostsByCategory, getPostsBySlugs } from "@/lib/payload";
import { extractHeadings } from "@/lib/lexical";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/post/ShareButtons";
import { TableOfContents } from "@/components/post/TableOfContents";
import { PostBody, PostFaq, FAQ_SECTION_ID } from "@/components/post/PostBody";
import { KeySummary } from "@/components/post/KeySummary";
import { SourceLinks } from "@/components/post/SourceLinks";
import { Disclaimer } from "@/components/post/Disclaimer";
import { PostCta } from "@/components/post/PostCta";
import { HashTags } from "@/components/post/HashTags";
import { AuthorCard } from "@/components/post/AuthorCard";
import { RelatedSidebar } from "@/components/post/RelatedSidebar";
import { MoreContents } from "@/components/post/MoreContents";
import { ViewCounter } from "@/components/post/ViewCounter";

// 발행된 모든 글을 빌드 시 정적 생성 (이후 글은 Payload 저장 훅의 revalidatePath 로 생성)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ category: p.category, slug: p.slug }));
}

// 글 제목/요약으로 메타 생성 (AI 검색·SNS 공유용 OG 포함)
export async function generateMetadata({ params }: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(decodeURIComponent(category), decodeURIComponent(slug));
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/${post.category}/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.thumbnail ? [{ url: post.thumbnail.url, alt: post.thumbnail.alt }] : undefined,
    },
  };
}

// params 를 최상위에서 읽어 없는 글은 진짜 404 상태코드를 돌려준다 (SEO).
export default async function PostPage({ params }: PageProps<"/[category]/[slug]">) {
  const { category: rawCategory, slug: rawSlug } = await params;
  const post = await getPost(decodeURIComponent(rawCategory), decodeURIComponent(rawSlug));
  if (!post) notFound();

  const [cat, doctor, popular, pickedRelated, sameCategory, clinic, { isEnabled: isPreview }] = await Promise.all([
    getCategory(post.category),
    getDoctor(post.author),
    getPopularPosts(6),
    getPostsBySlugs(post.related),
    getPostsByCategory(post.category),
    getClinic(),
    draftMode(),
  ]);

  // 관련 글: 관리자가 고른 글 먼저, 부족하면 같은 주제의 최신 글로 채움 (현재 글 제외, 최대 4개)
  const related = [...pickedRelated, ...sameCategory.filter((p) => p.slug !== post.slug && !pickedRelated.some((r) => r.slug === p.slug))].slice(0, 4);

  // 목차: 본문 h2 (리치텍스트면 추출, 목 데이터면 sections) + FAQ
  const bodyHeadings = post.content
    ? extractHeadings(post.content).map(({ id, heading }) => ({ id, heading }))
    : post.sections.map((s) => ({ id: s.id, heading: s.heading }));
  const tocItems = [...bodyHeadings, ...(post.faq.length ? [{ id: FAQ_SECTION_ID, heading: "자주 묻는 질문" }] : [])];

  // 글 구조화 데이터 (검색엔진·AI 검색이 글/작성자/FAQ 를 읽도록)
  const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/$/, "");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      headline: post.title,
      description: post.summary,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      inLanguage: "ko",
      author: doctor ? { "@type": "Physician", name: doctor.name, jobTitle: doctor.title } : undefined,
      publisher: { "@type": "MedicalClinic", name: clinic.name, url: clinic.homepageUrl },
      keywords: post.tags.join(", "),
    },
    // 빵부스러기 (검색 결과의 경로 표시)
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: cat?.name ?? post.categoryName ?? post.category, item: `${siteUrl}/${post.category}` },
        { "@type": "ListItem", position: 3, name: post.title },
      ],
    },
    post.faq.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null,
  ].filter(Boolean);

  return (
    // 레퍼런스: 글 상세 컨테이너는 max-w-site-3xl, py-12 md:py-20
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-3xl py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {post.id !== undefined && <ViewCounter postId={post.id} disabled={isPreview} />}

      {/* 1. 빵부스러기 */}
      <Breadcrumb
        className="mb-6!"
        items={[
          { label: "홈", href: "/" },
          { label: cat?.name ?? post.categoryName ?? post.category, href: `/${post.category}` },
          { label: post.title },
        ]}
      />

      {/* 레퍼런스: lg 이상 2열 그리드 (사이드바 clamp(220px,20vw,300px) | 본문), 간격 6.25vw. 모바일은 사이드바 숨김 */}
      <div className="lg:grid lg:grid-cols-[clamp(220px,20vw,300px)_minmax(0,1fr)] lg:gap-[6.25vw]">
        <RelatedSidebar posts={related} categorySlug={post.category} categoryName={cat?.name ?? post.categoryName ?? post.category} />

        <article>
          {/* 2. 제목 + 작성자·날짜 + 공유/링크 복사 */}
          <div className="mb-10 border-b border-neutral-200 pb-10">
            <h1 className="text-2xl font-bold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-5 py-2 text-base text-neutral-500">
                {doctor && <span>{doctor.name} {doctor.title}</span>}
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>
              <ShareButtons title={post.title} />
            </div>
          </div>

          {/* 3. 핵심 요약 + 핵심 포인트 */}
          <KeySummary summary={post.summary} points={post.keyPoints} />

          {/* 4. 접이식 목차 */}
          {tocItems.length > 0 && <TableOfContents items={tocItems} />}

          {/* 본문부터 면책까지 목차보다 좁게 가운데 (데스크톱 86%). 레퍼런스 순서: 본문 → 출처 → FAQ → 관련 검색어(해시태그) → 상담 → 면책 */}
          <div className="mx-auto w-full lg:w-[86%]">
            <PostBody post={post} />
            {post.sources.length > 0 && <SourceLinks sources={post.sources} />}
            <PostFaq post={post} number={bodyHeadings.length + 1} />
            {post.tags.length > 0 && <HashTags tags={post.tags} />}
            <PostCta />
            <Disclaimer />
          </div>

          {/* 작성자 프로필 카드는 제목·목차와 같은 넓은 폭 */}
          {doctor && <AuthorCard doctor={doctor} />}
        </article>
      </div>

      {/* 13. 함께 보면 좋은 콘텐츠 (그리드 밖, 전체 폭) */}
      {popular.length > 0 && <MoreContents posts={popular} />}
    </div>
  );
}

// "2026.10.17" 형식
function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 글 상세 페이지 (/[category]/[slug]). 레퍼런스 blog.kimsretina.com 글 상세 구성을 그대로 옮김.
// 구성: 빵부스러기 → [사이드 인기글 | 제목·공유 → 목차 → 본문(슬라이드·본문·FAQ) → 출처 → 면책 → CTA → 관련글 → 해시태그 → 작성자 카드] → 함께 보면 좋은 콘텐츠.
// 데이터는 Payload(lib/payload.ts). 관리자 미리보기(draft 모드)면 초안이 보인다.
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getAllPosts, getCategory, getClinic, getDoctor, getPopularPosts, getPost, getPostsBySlugs } from "@/lib/payload";
import { extractHeadings } from "@/lib/lexical";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/post/ShareButtons";
import { TableOfContents } from "@/components/post/TableOfContents";
import { PostBody, FAQ_SECTION_ID } from "@/components/post/PostBody";
import { SourceLinks } from "@/components/post/SourceLinks";
import { Disclaimer } from "@/components/post/Disclaimer";
import { PostCta } from "@/components/post/PostCta";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { HashTags } from "@/components/post/HashTags";
import { AuthorCard } from "@/components/post/AuthorCard";
import { PopularSidebar } from "@/components/post/PopularSidebar";
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

  const [cat, doctor, popular, related, clinic, { isEnabled: isPreview }] = await Promise.all([
    getCategory(post.category),
    getDoctor(post.author),
    getPopularPosts(6),
    getPostsBySlugs(post.related),
    getClinic(),
    draftMode(),
  ]);

  // 목차: 본문 h2 (리치텍스트면 추출, 목 데이터면 sections) + FAQ
  const bodyHeadings = post.content
    ? extractHeadings(post.content).map(({ id, heading }) => ({ id, heading }))
    : post.sections.map((s) => ({ id: s.id, heading: s.heading }));
  const tocItems = [...bodyHeadings, ...(post.faq.length ? [{ id: FAQ_SECTION_ID, heading: "자주 묻는 질문" }] : [])];

  // 글 구조화 데이터 (검색엔진·AI 검색이 글/작성자/FAQ 를 읽도록)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      headline: post.title,
      description: post.summary,
      datePublished: post.publishedAt,
      inLanguage: "ko",
      author: doctor ? { "@type": "Physician", name: doctor.name, jobTitle: doctor.title } : undefined,
      publisher: { "@type": "MedicalClinic", name: clinic.name, url: clinic.homepageUrl },
      keywords: post.tags.join(", "),
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
        <PopularSidebar posts={popular.slice(0, 4)} />

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

          {/* 4. 접이식 목차 */}
          {tocItems.length > 0 && <TableOfContents items={tocItems} />}

          {/* 3·5·6. 본문: 이미지 슬라이드 → 본문 → FAQ */}
          <PostBody post={post} />

          {/* 7. 출처 */}
          {post.sources.length > 0 && <SourceLinks sources={post.sources} />}

          {/* 12. 면책 문구 (레퍼런스 순서: 출처 다음, CTA 앞) */}
          <Disclaimer />

          {/* 8. CTA 버튼 묶음 */}
          <PostCta />

          {/* 9. 함께 읽으면 좋은 글 */}
          {related.length > 0 && <RelatedPosts posts={related} />}

          {/* 10. 해시태그 */}
          {post.tags.length > 0 && <HashTags tags={post.tags} />}

          {/* 11. 작성자 프로필 카드 */}
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

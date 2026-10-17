// 글 상세 페이지 (/[category]/[slug]). 레퍼런스 blog.kimsretina.com 글 상세 구성을 그대로 옮김.
// 구성: 빵부스러기 → [사이드 인기글 | 제목·공유 → 목차 → 본문(슬라이드·섹션·FAQ) → 출처 → 면책 → CTA → 관련글 → 해시태그 → 작성자 카드] → 함께 보면 좋은 콘텐츠.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getDoctor, getPopularPosts, getPost, posts } from "@/lib/mock";
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

// 모든 글을 빌드 시 정적 생성
export function generateStaticParams() {
  return posts.map((p) => ({ category: p.category, slug: p.slug }));
}

// 글 제목/요약으로 메타 생성
export async function generateMetadata({ params }: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article" },
  };
}

// params 를 최상위에서 읽어 없는 글은 진짜 404 상태코드를 돌려준다 (SEO). instant 검증(개발 경고)만 끔.
export const instant = false;

export default async function PostPage({ params }: PageProps<"/[category]/[slug]">) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) notFound();

  const cat = getCategory(post.category);
  const doctor = getDoctor(post.author);
  const popular = getPopularPosts(6);

  // 목차: 본문 섹션 + FAQ (레퍼런스 목차도 본문의 모든 h2 를 포함)
  const tocItems = [
    ...post.sections.map((s) => ({ id: s.id, heading: s.heading })),
    { id: FAQ_SECTION_ID, heading: "자주 묻는 질문" },
  ];

  return (
    // 레퍼런스: 글 상세 컨테이너는 max-w-site-3xl, py-12 md:py-20
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-3xl py-12 md:py-20">
      {/* 1. 빵부스러기 */}
      <Breadcrumb
        className="mb-6!"
        items={[
          { label: "홈", href: "/" },
          { label: cat?.name ?? post.category, href: `/${post.category}` },
          { label: post.title },
        ]}
      />

      {/* 레퍼런스: lg 이상 2열 그리드 (사이드바 clamp(220px,20vw,300px) | 본문), 간격 6.25vw. 모바일은 사이드바 숨김 */}
      <div className="lg:grid lg:grid-cols-[clamp(220px,20vw,300px)_minmax(0,1fr)] lg:gap-[6.25vw]">
        <PopularSidebar posts={popular.slice(0, 4)} />

        <article>
          {/* 2. 제목 + 공유/링크 복사 (레퍼런스의 작성자·날짜 자리는 비어 있어 생략) */}
          <div className="mb-10 border-b border-neutral-200 pb-10">
            <h1 className="text-2xl font-bold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-5 py-2 text-base text-neutral-500" />
              <ShareButtons title={post.title} />
            </div>
          </div>

          {/* 4. 접이식 목차 */}
          <TableOfContents items={tocItems} />

          {/* 3·5·6. 본문: 이미지 슬라이드 → 섹션 → FAQ */}
          <PostBody post={post} />

          {/* 7. 출처 */}
          <SourceLinks sources={post.sources} />

          {/* 12. 면책 문구 (레퍼런스 순서: 출처 다음, CTA 앞) */}
          <Disclaimer />

          {/* 8. CTA 버튼 묶음 */}
          <PostCta />

          {/* 9. 함께 읽으면 좋은 글 */}
          <RelatedPosts related={post.related} />

          {/* 10. 해시태그 */}
          <HashTags tags={post.tags} />

          {/* 11. 작성자 프로필 카드 */}
          {doctor && <AuthorCard doctor={doctor} />}
        </article>
      </div>

      {/* 13. 함께 보면 좋은 콘텐츠 (그리드 밖, 전체 폭) */}
      <MoreContents posts={popular} />
    </div>
  );
}

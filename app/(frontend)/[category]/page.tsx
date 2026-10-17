// 카테고리 글 목록 페이지 (/retina, /glaucoma, ...). Payload categories 컬렉션의 slug 가 경로.
// 구성: 빵부스러기 > 제목 > 탭(전체/카테고리) > 카드 그리드 + View more
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategory, getPostsByCategory } from "@/lib/payload";
import type { Category, Post } from "@/lib/types";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageTitle } from "@/components/posts/PageTitle";
import { CategoryTabs } from "@/components/posts/CategoryTabs";
import { PostListWithMore } from "@/components/posts/PostListWithMore";
import { EmptyPosts } from "@/components/posts/EmptyPosts";

// 모든 카테고리를 빌드 시 정적 생성
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  return cat ? { title: cat.name, description: cat.description } : {};
}

// params 를 최상위에서 읽어 없는 카테고리는 진짜 404 상태코드를 돌려준다 (SEO).
export default async function CategoryPage({ params, searchParams }: PageProps<"/[category]">) {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  if (!cat) notFound();

  const posts = await getPostsByCategory(cat.slug);

  return (
    // 레퍼런스: 컨테이너 py-12 md:py-16
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: cat.name }]} />
      <PageTitle title={cat.name} />

      {/* searchParams(탭 필터) 를 읽는 부분은 Suspense 로 분리 */}
      <Suspense
        fallback={
          <>
            <CategoryTabs basePath={`/${cat.slug}`} categories={[cat]} />
            <div className="mt-10 md:mt-14">
              <PostList posts={posts} />
            </div>
          </>
        }
      >
        <CategoryContent basePath={`/${cat.slug}`} category={cat} posts={posts} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// 탭 + 목록. ?category= 로 필터 (카테고리 페이지에는 해당 카테고리 탭 하나뿐이라 결과는 동일)
async function CategoryContent({
  basePath,
  category,
  posts,
  searchParams,
}: {
  basePath: string;
  category: Category;
  posts: Post[];
  searchParams: PageProps<"/[category]">["searchParams"];
}) {
  const { category: filter } = await searchParams;
  const current = typeof filter === "string" ? filter : undefined;

  return (
    <>
      <CategoryTabs basePath={basePath} categories={[category]} current={current} />
      {/* 레퍼런스: 목록 상단 여백 mt-10 md:mt-14, 처음 6개 표시 */}
      <div className="mt-10 md:mt-14">
        <PostList key={current ?? "all"} posts={posts} />
      </div>
    </>
  );
}

// 글이 없으면 빈 상태 문구
function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <EmptyPosts />;
  return <PostListWithMore posts={posts} initialCount={6} step={6} />;
}

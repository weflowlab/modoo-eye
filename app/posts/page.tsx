// 전체글보기 페이지 (/posts). 빵부스러기 > "전체 콘텐츠" 제목 > 카테고리 탭 > 최신순 카드 그리드 + View more
// ?category=<slug> 로 카테고리 필터.
import { Suspense } from "react";
import type { Metadata } from "next";
import { categories, posts as allPosts } from "@/lib/mock";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageTitle } from "@/components/posts/PageTitle";
import { CategoryTabs } from "@/components/posts/CategoryTabs";
import { PostListWithMore } from "@/components/posts/PostListWithMore";

export const metadata: Metadata = {
  title: "전체 콘텐츠",
  description: "모든 카테고리의 글을 최신순으로 모았습니다.",
};

// 최신순 정렬
const sorted = [...allPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export default function PostsPage({ searchParams }: PageProps<"/posts">) {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "전체 콘텐츠" }]} />
      <PageTitle title="전체 콘텐츠" />

      {/* searchParams.category 를 읽는 부분은 Suspense 로 분리 */}
      <Suspense
        fallback={
          <>
            <CategoryTabs basePath="/posts" categories={categories} />
            <div className="mt-10 md:mt-14">
              <PostListWithMore posts={sorted} initialCount={9} step={9} />
            </div>
          </>
        }
      >
        <PostsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PostsContent({ searchParams }: Pick<PageProps<"/posts">, "searchParams">) {
  const { category } = await searchParams;
  const current = typeof category === "string" ? category : undefined;
  const filtered = current ? sorted.filter((p) => p.category === current) : sorted;

  return (
    <>
      <CategoryTabs basePath="/posts" categories={categories} current={current} />
      {/* 레퍼런스 /posts: 처음 9개 표시 후 View more */}
      <div className="mt-10 md:mt-14">
        <PostListWithMore key={current ?? "all"} posts={filtered} initialCount={9} step={9} />
      </div>
    </>
  );
}

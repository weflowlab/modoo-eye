// 전체글보기 페이지 (/posts). 빵부스러기 > "전체 콘텐츠" 제목 > 카테고리 탭 > 최신순 카드 그리드 + View more
// 탭은 각 주제 페이지(/slug)로 이동한다 (카테고리 페이지와 동일).
import type { Metadata } from "next";
import { getAllPosts, getCategories } from "@/lib/payload";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageTitle } from "@/components/posts/PageTitle";
import { CategoryTabs } from "@/components/posts/CategoryTabs";
import { PostBrowser } from "@/components/posts/PostBrowser";

// 최대 1분에 한 번 다시 생성 (예약 발행 글 반영)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "전체 콘텐츠",
  description: "모든 카테고리의 글을 최신순으로 모았습니다.",
};

export default async function PostsPage() {
  // getAllPosts 는 발행일 내림차순(최신순)으로 돌려준다
  const [categories, posts] = await Promise.all([getCategories(), getAllPosts()]);

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "전체 콘텐츠" }]} />
      <PageTitle title="전체 콘텐츠" />

      {/* 탭: 전체(현재) + 각 주제 페이지로 이동 (카테고리 페이지와 같은 동작) */}
      {/* 탭(왼쪽) + 정렬 드롭박스(오른쪽) + 목록 */}
      <PostBrowser posts={posts} tabs={<CategoryTabs basePath="/posts" categories={categories} mode="path" />} />
    </div>
  );
}


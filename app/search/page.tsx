// 검색 결과 페이지 (/search?q=검색어). 상단 그라데이션 검색 영역 + 가로형 결과 목록(2열) + View more.
// 검색어가 없으면 전체 글을 최신순으로, 결과가 없으면 "검색 결과가 없습니다" 상태를 보여준다 (레퍼런스 동작).
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { IconArrowRight } from "@tabler/icons-react";
import { popularKeywords, posts as allPosts, searchPosts } from "@/lib/mock";
import { SearchHero } from "@/components/posts/SearchHero";
import { PostListWithMore } from "@/components/posts/PostListWithMore";

export const metadata: Metadata = { title: "검색" };

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<SearchHero query="" keywords={popularKeywords} />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim();

  // 검색어 없으면 전체 글(최신순), 있으면 검색 결과
  const results = query
    ? searchPosts(query)
    : [...allPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <SearchHero query={query} keywords={popularKeywords} resultCount={query ? results.length : undefined} />

      {/* 레퍼런스: 결과 영역 py-12 md:py-20 */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-20">
        {results.length > 0 ? (
          <PostListWithMore key={query} posts={results} variant="list" highlight={query} initialCount={9} step={9} />
        ) : (
          // 결과 없음 상태
          <div className="flex flex-col items-center gap-7.5 py-12 text-center md:py-20">
            <div className="flex flex-col gap-1 text-xl font-semibold leading-snug text-neutral-800 md:text-3xl">
              <p>
                <span className="text-brand-primary">{query}</span>
                <span>에 대한 검색 결과가 없습니다.</span>
              </p>
              <p>다른 이야기도 살펴볼까요?</p>
            </div>
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-7 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-primary hover:text-primary-foreground md:text-lg"
            >
              다른 이야기 보러가기
              <IconArrowRight className="size-5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

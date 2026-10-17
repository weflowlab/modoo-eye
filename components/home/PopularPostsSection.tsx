// 메인 페이지 "가장 많이 본 글". 실제 조회수(views) 상위 4개를 가로로, 사진 + 제목만 단순하게.
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Reveal } from "@/components/ui/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Post } from "@/lib/types";

type Props = { posts: Post[] }; // 조회수순 상위 글 (서버 페이지가 getPopularPosts(3) 로 넘김)

// 사진 (없으면 자리표시)
function Photo({ post, sizes }: { post: Post; sizes: string }) {
  return post.thumbnail ? (
    <MediaImage image={post.thumbnail} sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
  ) : (
    <Placeholder label={`썸네일 · ${post.title}`} className="size-full" />
  );
}

// 순위 배지: 남색 원 안의 숫자
function Rank({ n, large = false }: { n: number; large?: boolean }) {
  return (
    <span
      className={`absolute left-4 top-4 z-10 flex items-center justify-center rounded-full bg-primary font-bold text-white shadow-md ${large ? "size-10 text-base md:size-12 md:text-lg" : "size-8 text-sm"}`}
    >
      {n}
    </span>
  );
}

export function PopularPostsSection({ posts }: Props) {
  // 글이 없으면 섹션 자체를 숨긴다
  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 제목 행 */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary md:text-base">BEST 4</p>
            <Reveal variant="up">
              <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">가장 많이 본 글</h2>
            </Reveal>
          </div>
          <Link
            href="/posts"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-neutral-600 transition-colors hover:text-primary md:flex md:text-base"
          >
            전체 글 보기 <IconArrowRight className="size-4" />
          </Link>
        </div>

        {/* 가로 4개 (태블릿 2×2, 모바일 세로). 사진 + 제목만 */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-10 lg:grid-cols-4 lg:gap-6">
          {posts.slice(0, 4).map((post, i) => (
            <Reveal key={post.slug} variant="fade-up" delay={0.1 * i}>
              <Link href={`/${post.category}/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                  <Rank n={i + 1} />
                  <Photo post={post} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* 모바일용 전체 글 보기 */}
        <Link href="/posts" className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-neutral-600 md:hidden">
          전체 글 보기 <IconArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

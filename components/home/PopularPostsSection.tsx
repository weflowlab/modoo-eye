"use client";
// 메인 페이지 인기 글 섹션. 제목 + "전체글보기" 버튼 + 순위 1~4 카드 슬라이더.
// 레퍼런스: "이 블로그에서 가장 많이 읽은 글" (py-15 md:py-30, swiper)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/posts/PostCard";
import type { Post } from "@/lib/types";

type Props = { posts: Post[] }; // 조회수순 상위 글 (서버 페이지가 getPopularPosts(4) 로 넘김)

export function PopularPostsSection({ posts }: Props) {
  // 글이 없으면 섹션 자체를 숨긴다
  if (posts.length === 0) return null;

  return (
    <section className="py-15 md:py-30 overflow-hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 제목 행: 왼쪽 제목, 오른쪽 전체글보기(md 이상에서만) */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Reveal variant="up">
              <h2 className="text-xl font-bold md:text-3xl lg:text-4xl leading-tight">
                이 블로그에서 <span className="text-brand-primary">가장 많이 읽은 글</span>
              </h2>
            </Reveal>
          </div>
          <div className="shrink-0">
            <div className="hidden items-center gap-2 md:flex">
              <Button
                href="/posts"
                variant="ghost"
                size="lg"
                className="rounded-full px-7 py-2 bg-neutral-100 text-sm md:text-base lg:text-lg h-auto font-medium flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
              >
                전체글보기
                <IconArrowRight className="size-4 md:size-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 카드 슬라이더. 레퍼런스: 모바일은 오른쪽 패딩을 상쇄해 다음 카드가 살짝 보임 */}
        <div className="mt-10 -mr-4 sm:-mr-6 md:mr-0 lg:mr-0">
          <Reveal variant="fade-left" delay={0.15}>
            {/* 레퍼런스 이미지 sizes: 모바일 100vw / 태블릿 50vw / 데스크톱 300px(카드의 46%) → 데스크톱 2장 */}
            <Swiper
              slidesPerView={1.15}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 2, spaceBetween: 40 },
              }}
              className="w-full"
            >
              {posts.map((post, i) => (
                <SwiperSlide key={post.slug}>
                  <PostCard post={post} rank={i + 1} showSummary />
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

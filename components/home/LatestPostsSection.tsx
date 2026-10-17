"use client";
// 메인 페이지 최신 글 섹션. 제목 + 이전/다음 버튼 + 최신 글 6개 카드 슬라이더(제목만).
// 레퍼런스: "이 블로그에서 가장 최신 글" (py-15 md:py-30, swiper + 원형 네비 버튼)
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/posts/PostCard";
import { getLatestPosts } from "@/lib/mock";

// 레퍼런스: size-12 원형 회색 버튼, 끝에 도달하면 disabled
const navButtonClass =
  "inline-flex shrink-0 items-center justify-center size-12 rounded-full bg-neutral-100 text-foreground transition-all outline-none select-none hover:bg-muted active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

export function LatestPostsSection() {
  const posts = getLatestPosts(6);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // 슬라이드 위치에 따라 이전/다음 버튼 활성화 갱신
  const syncNav = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <section className="py-15 md:py-30 overflow-hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 제목 행: 왼쪽 제목, 오른쪽 이전/다음 버튼(md 이상에서만) */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Reveal variant="up">
              <h2 className="text-xl font-bold md:text-3xl lg:text-4xl leading-tight">
                이 블로그에서 가장 <span className="text-brand-primary">최신 글</span>
              </h2>
            </Reveal>
          </div>
          <div className="shrink-0">
            <div className="hidden gap-2 md:flex">
              <button type="button" aria-label="이전" className={navButtonClass} disabled={isBeginning} onClick={() => swiper?.slidePrev()}>
                <IconChevronLeft className="size-5" />
              </button>
              <button type="button" aria-label="다음" className={navButtonClass} disabled={isEnd} onClick={() => swiper?.slideNext()}>
                <IconChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 카드 슬라이더. 레퍼런스 이미지 sizes: 모바일 100vw / 태블릿 50vw / 데스크톱 33vw → 1 / 2 / 3장 */}
        <div className="mt-10 -mr-4 sm:-mr-6 md:mr-0 lg:mr-0">
          <Reveal variant="fade-left" delay={0.15}>
            <Swiper
              slidesPerView={1.15}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 32 },
              }}
              onSwiper={(s) => {
                setSwiper(s);
                syncNav(s);
              }}
              onSlideChange={syncNav}
              onResize={syncNav}
              className="w-full"
            >
              {posts.map((post) => (
                <SwiperSlide key={post.slug}>
                  <PostCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

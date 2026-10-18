"use client";
// 메인 페이지 "최신 글". 아이브로우 + 제목 + 오른쪽 이전/다음 화살표, 카드(사진 + 제목 + 날짜) 슬라이더.
// 데스크톱 4장 / 태블릿 2장 / 모바일 1.15장 (다음 카드가 살짝 보임).
import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Reveal } from "@/components/ui/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";

type Props = { posts: Post[] }; // 최신순 글 (서버 페이지가 getLatestPosts(8) 로 넘김)

// 원형 회색 화살표 버튼, 끝에 도달하면 흐리게
const navButtonClass =
  "inline-flex shrink-0 items-center justify-center size-11 rounded-full bg-neutral-100 text-foreground transition-all outline-none select-none hover:bg-primary hover:text-white active:translate-y-px disabled:pointer-events-none disabled:opacity-40";

// 사진 (없으면 자리표시)
function Photo({ post }: { post: Post }) {
  return post.thumbnail ? (
    <MediaImage
      image={post.thumbnail}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
  ) : (
    <Placeholder label={`썸네일 · ${post.title}`} className="size-full" />
  );
}

export function LatestPostsSection({ posts }: Props) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // 슬라이드 위치에 따라 이전/다음 버튼 활성화 갱신
  const syncNav = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  // 글이 없으면 섹션 자체를 숨긴다
  if (posts.length === 0) return null;

  return (
    <section className="overflow-hidden bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 제목 행: 아이브로우 + 제목, 오른쪽 이전/다음 화살표 */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary md:text-base">NEW</p>
            <Reveal variant="up">
              <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">최신 글</h2>
            </Reveal>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" aria-label="이전" className={navButtonClass} disabled={isBeginning} onClick={() => swiper?.slidePrev()}>
              <IconChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="다음" className={navButtonClass} disabled={isEnd} onClick={() => swiper?.slideNext()}>
              <IconChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* 카드 슬라이더. 모바일은 오른쪽 패딩을 상쇄해 다음 카드가 살짝 보임 */}
        <div className="mt-8 -mr-4 sm:-mr-6 md:mt-10 lg:mr-0">
          <Reveal variant="fade-up" delay={0.1}>
            <Swiper
              slidesPerView={1.15}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
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
                  <Link href={`/${post.category}/${post.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                      <Photo post={post} />
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug transition-colors group-hover:text-primary">{post.title}</h3>
                    <time dateTime={post.publishedAt} className="mt-1.5 block text-sm text-neutral-500">
                      {formatDate(post.publishedAt)}
                    </time>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

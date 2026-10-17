"use client";
// 글 상세 맨 아래 "함께 보면 좋은 콘텐츠" — 인기글 카드 슬라이드(swiper). 본문/사이드바 그리드 밖, 컨테이너 전체 폭.
// 레퍼런스: 제목은 아래에서 올라오는 reveal, 오른쪽에 ‹ › 원형 버튼(md 이상), 모바일은 오른쪽으로 카드가 살짝 잘려 보임.
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { Post } from "@/lib/types";
import { PostCard } from "@/components/posts/PostCard";
import { Reveal } from "@/components/ui/Reveal";

type Props = { posts: Post[]; className?: string };

// 레퍼런스: size-12 원형 연회색 버튼, 비활성 시 흐림
const navButtonClass =
  "inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-100 transition-all hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50";

export function MoreContents({ posts, className = "" }: Props) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  // 양 끝 도달 여부 → 버튼 비활성 (레퍼런스: 첫 화면에서 '이전' disabled)
  const [edge, setEdge] = useState({ begin: true, end: false });

  const syncEdge = (s: SwiperType) => setEdge({ begin: s.isBeginning, end: s.isEnd });

  return (
    <section className={`mt-24 md:mt-32 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Reveal variant="up">
            <h2 className="text-xl font-bold leading-tight md:text-3xl lg:text-4xl">함께 보면 좋은 콘텐츠</h2>
          </Reveal>
        </div>
        <div className="shrink-0">
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="이전"
              disabled={edge.begin}
              onClick={() => swiper?.slidePrev()}
              className={navButtonClass}
            >
              <IconChevronLeft className="size-5" stroke={1.75} />
            </button>
            <button
              type="button"
              aria-label="다음"
              disabled={edge.end}
              onClick={() => swiper?.slideNext()}
              className={navButtonClass}
            >
              <IconChevronRight className="size-5" stroke={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* 레퍼런스: 모바일에서 오른쪽 패딩만큼 밖으로 확장(-mr-4 sm:-mr-6), md 부터 원래 폭 */}
      <div className="mt-6 -mr-4 sm:-mr-6 md:mr-0">
        <Swiper
          // 레퍼런스 sizes 기준: 모바일 1장(+살짝) / md 3장 / lg 4장
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          onSwiper={(s) => {
            setSwiper(s);
            syncEdge(s);
          }}
          onSlideChange={syncEdge}
          onBreakpoint={syncEdge}
          className="w-full"
        >
          {posts.map((p) => (
            <SwiperSlide key={p.slug} className="h-auto">
              <PostCard post={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

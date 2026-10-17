"use client";
// 제목 + 이전/다음 버튼 + swiper 카드 슬라이더. 의료진 상세의 "관련 콘텐츠", "의료진 더보기" 섹션에 사용.
// items 에는 카드 엘리먼트(PostCard, DoctorMiniCard 등)를 넘긴다.
import { useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Reveal } from "@/components/ui/Reveal";
import { CarouselNavButton } from "./CarouselNavButton";

type Props = {
  title: string;
  items: ReactNode[];
  emptyText?: string;
};

export function CardCarousel({ title, items, emptyText = "등록된 콘텐츠가 없습니다." }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const showNav = items.length > 3; // 레퍼런스: 3개 초과일 때만 버튼 표시

  // 양 끝 도달 여부로 버튼 비활성화
  const sync = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* 레퍼런스: 제목이 아래에서 올라오는 등장 애니메이션 */}
        <Reveal variant="up">
          <h2 className="text-xl font-bold md:text-3xl lg:text-4xl leading-tight">{title}</h2>
        </Reveal>
        {showNav && (
          <div className="shrink-0">
            <div className="hidden gap-2 md:flex">
              <CarouselNavButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} disabled={isBeginning} />
              <CarouselNavButton direction="next" onClick={() => swiperRef.current?.slideNext()} disabled={isEnd} />
            </div>
          </div>
        )}
      </div>

      {/* 모바일에서는 오른쪽 여백을 뚫고 나가 다음 카드가 살짝 보임 (-mr-4) */}
      <div className="mt-6 -mr-4 sm:-mr-6 md:mr-0">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          // 레퍼런스: 모바일 1.3장/16px, md 이상 3장씩/24px
          <Swiper
            onSwiper={(s) => {
              swiperRef.current = s;
              sync(s);
            }}
            onSlideChange={sync}
            onResize={sync}
            slidesPerView={1.3}
            spaceBetween={16}
            breakpoints={{ 768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 } }}
            className="w-full"
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>{item}</SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

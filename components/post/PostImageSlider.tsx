"use client";
// 글 본문 상단 가로형 이미지 슬라이드. 글 상세(prose-content) 맨 위에 배치.
// 레퍼런스: 자체 구현 슬라이더(1/2/3장 보기, 4.2초 자동재생, ◀ ▶ 화살표, 점 인디케이터, 끝에서 처음으로 되감기)
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Placeholder } from "@/components/ui/Placeholder";
import { useMounted } from "@/components/ui/useMounted";

// 레퍼런스: 슬라이드 5장 (alt 문구를 자리표시 라벨로 사용)
const SLIDES = [
  "본문 이미지 1 (진단과 치료 안내)",
  "본문 이미지 2 (유형 구분)",
  "본문 이미지 3 (정밀검사 안내)",
  "본문 이미지 4 (치료 과정)",
  "본문 이미지 5 (정기검진·생활관리)",
];

export function PostImageSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const mounted = useMounted();

  // 서버 프리렌더 중엔 자동재생 swiper 대신 첫 장만 정적으로 표시 (레이아웃 유지)
  if (!mounted) {
    return (
      <div className="relative mb-[30px]">
        <div className="overflow-hidden rounded-[14px]">
          <Placeholder label={SLIDES[0]} className="aspect-square w-full rounded-[12px]" />
        </div>
      </div>
    );
  }

  // 레퍼런스: 점 개수 = 전체 - 한 화면 장수 + 1
  const dots = Math.max(1, SLIDES.length - perView + 1);

  const syncPerView = (s: SwiperType) => {
    const v = s.params.slidesPerView;
    setPerView(typeof v === "number" ? Math.floor(v) : 1);
  };

  return (
    // 레퍼런스: .kmac-slider (relative, 아래 여백 30px)
    <div className="relative mb-[30px]">
      <div className="overflow-hidden rounded-[14px]">
        <Swiper
          modules={[Autoplay]}
          rewind // 레퍼런스: 마지막 다음은 처음으로
          speed={550}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          // 레퍼런스: ≤640px 1장 / ≤900px 2장 / 이상 3장, 슬라이드 좌우 3~5px 여백
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 6 },
            641: { slidesPerView: 2, spaceBetween: 6 },
            901: { slidesPerView: 3, spaceBetween: 10 },
          }}
          onSwiper={(s) => {
            setSwiper(s);
            syncPerView(s);
          }}
          onBreakpoint={syncPerView}
          onSlideChange={(s) => setIndex(s.activeIndex)}
          className="w-full"
        >
          {SLIDES.map((label) => (
            <SwiperSlide key={label}>
              <Placeholder label={label} className="aspect-square w-full rounded-[12px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 레퍼런스: 38px 원형 화살표 버튼, 흰 배경 + 그림자, hover 시 강조색 */}
      <button
        type="button"
        aria-label="이전 이미지"
        onClick={() => swiper?.slidePrev()}
        className="absolute left-1 top-1/2 z-[2] flex size-[38px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white/95 text-[15px] leading-none text-primary shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-colors hover:border-primary hover:bg-primary hover:text-white"
      >
        ◀
      </button>
      <button
        type="button"
        aria-label="다음 이미지"
        onClick={() => swiper?.slideNext()}
        className="absolute right-1 top-1/2 z-[2] flex size-[38px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white/95 text-[15px] leading-none text-primary shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-colors hover:border-primary hover:bg-primary hover:text-white"
      >
        ▶
      </button>

      {/* 레퍼런스: 7px 점, 현재 점은 22px 막대 */}
      <div className="mt-[14px] flex justify-center gap-[7px]">
        {Array.from({ length: dots }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번째 이미지 보기`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => swiper?.slideTo(i)}
            className={`h-[7px] cursor-pointer transition-all duration-250 ${
              i === index ? "w-[22px] rounded-[4px] bg-primary" : "w-[7px] rounded-full bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

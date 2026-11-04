"use client";
// 글 본문 상단 가로형 이미지 슬라이드. 글 상세(prose-content) 맨 위에 배치.
// 관리자에서 올린 사진만 올린 장수만큼 보여 준다. 사진이 없으면 아무것도 그리지 않고, 한 장이면 화살표·점 없이 한 장만.
// 두 장 이상이면 정방형 사진을 한 장씩, 4.2초 자동재생, ◀ ▶ 화살표, 점 인디케이터, 끝에서 처음으로 되감기.
// 본문 폭에 꽉 차게(글의 시작·끝선과 사진 가장자리가 일치).
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
import { useMounted } from "@/components/ui/useMounted";
import type { ImageRef } from "@/lib/types";

type Props = { images?: ImageRef[] };

function Slide({ image, label }: { image: ImageRef; label: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-muted">
      {/* prose-content 의 img 여백 규칙이 적용되면 위에 회색 띠가 생기므로 m-0! 로 막는다 */}
      <Image src={image.url} alt={image.alt || label} fill sizes="(min-width: 1024px) 700px, 100vw" className="m-0! rounded-none! object-cover" />
    </div>
  );
}

export function PostImageSlider({ images = [] }: Props) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const mounted = useMounted();

  // 사진이 없으면 영역 자체를 두지 않는다 (예전엔 자리표시 5장이 나와 글이 지저분해 보였다)
  if (images.length === 0) return null;

  const SLIDES = images.map((img, i) => ({ key: `${img.url}-${i}`, image: img, label: img.alt || `본문 이미지 ${i + 1}` }));

  // 한 장뿐이거나 서버 프리렌더 중이면 첫 장만 정적으로 (한 장일 땐 화살표·점이 필요 없다)
  if (SLIDES.length === 1 || !mounted) {
    return (
      <div className="relative mb-[30px]">
        <div className="overflow-hidden rounded-[14px]">
          <Slide image={SLIDES[0].image} label={SLIDES[0].label} />
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
    <div className="relative mb-[30px] w-full">
      <div className="overflow-hidden rounded-[14px]">
        <Swiper
          modules={[Autoplay]}
          rewind // 레퍼런스: 마지막 다음은 처음으로
          speed={550}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          // 정방형 한 장씩
          slidesPerView={1}
          spaceBetween={10}
          onSwiper={(s) => {
            setSwiper(s);
            syncPerView(s);
          }}
          onBreakpoint={syncPerView}
          onSlideChange={(s) => setIndex(s.activeIndex)}
          className="w-full"
        >
          {SLIDES.map((s) => (
            <SwiperSlide key={s.key}>
              <Slide image={s.image} label={s.label} />
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

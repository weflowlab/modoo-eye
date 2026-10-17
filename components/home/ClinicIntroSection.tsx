"use client";
// 메인 페이지 배너 슬라이드 + 병원 소개 오버레이 (영문 라벨 + 문구 + About 버튼).
// 레퍼런스: 히어로 아래 swiper 배너 섹션. 배너 이미지 위에 텍스트가 absolute 로 올라간다.
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IconArrowRight } from "@tabler/icons-react";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { clinic } from "@/lib/mock";
import { useMounted } from "@/components/ui/useMounted";

// 배너 2장. 문구는 일반화된 플레이스홀더.
const banners = [
  {
    label: "CLINIC BANNER 1",
    text: "가장 자신 있는 분야에 집중합니다.\n저희는 끊임없이 연구하며 환자가 신뢰할 수 있는 전문적인 치료를 제공합니다.",
  },
  {
    label: "CLINIC BANNER 2",
    text: "정밀검사와 의료진의 직접 진단을 바탕으로\n환자의 눈 상태에 맞는 치료 방향을 안내합니다.",
  },
];

export function ClinicIntroSection() {
  const mounted = useMounted();

  // 배너 한 장 (서버 프리렌더 시 첫 장만, 마운트 후 swiper 슬라이드로)
  const renderBanner = (b: (typeof banners)[number], i: number) => (
              <div className="relative w-full">
                {/* 레퍼런스: 데스크톱 배너 1920/920, 모바일 배너 750/1624 */}
                <Placeholder label={`배너 ${i + 1} (데스크톱)`} className="w-full hidden md:flex aspect-[1920/920] bg-neutral-700 text-neutral-300" />
                <Placeholder label={`배너 ${i + 1} (모바일)`} className="w-full flex md:hidden aspect-[750/1624] bg-neutral-700 text-neutral-300" />

                {/* 오버레이 문구 */}
                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl absolute inset-0 flex flex-col justify-start py-15 md:py-30">
                  <h2 className="max-w-2xl text-xl font-bold leading-tight whitespace-pre-line md:text-5xl">{b.label}</h2>
                  <p className="mt-4 max-w-xl text-base text-background/85 whitespace-pre-line md:text-xl">{b.text}</p>
                  <div className="mt-4 md:mt-6">
                    {/* 레퍼런스: 흰 알약 버튼, hover 시 primary 배경 */}
                    <Button
                      href="/about"
                      variant="ghost"
                      size="lg"
                      className="inline-flex items-center justify-center bg-white rounded-full text-foreground h-11 md:h-12 px-6 md:px-7 text-base md:text-lg font-medium gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      About {clinic.name}
                      <IconArrowRight className="size-4 md:size-5" />
                    </Button>
                  </div>
                </div>
              </div>
  );

  return (
    <section className="relative overflow-hidden text-background">
      <div className="relative">
        {mounted ? (
          /* 자동 재생 슬라이드 (loop). swiper 자동재생은 현재 시각을 읽어 클라이언트에서만 렌더 */
          <Swiper modules={[Autoplay]} loop autoplay={{ delay: 5000, disableOnInteraction: false }} className="w-full">
            {banners.map((b, i) => (
              <SwiperSlide key={i}>{renderBanner(b, i)}</SwiperSlide>
            ))}
          </Swiper>
        ) : (
          renderBanner(banners[0], 0)
        )}
      </div>
    </section>
  );
}

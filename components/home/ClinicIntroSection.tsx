"use client";
// 메인 페이지 배너 슬라이드 + 병원 소개 오버레이 (영문 라벨 + 문구 + About 버튼).
// 레퍼런스: 히어로 아래 swiper 배너 섹션. 배너 이미지 위에 텍스트가 absolute 로 올라간다.
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IconArrowRight } from "@tabler/icons-react";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { useSite } from "@/components/SiteProvider";
import { useMounted } from "@/components/ui/useMounted";
import { MobileBreaks } from "@/components/ui/MobileBreaks";
import type { HomeContent } from "@/lib/types";

type Banner = HomeContent["banners"][number];

// 기본 배너 2장 (Payload 'home' 글로벌에 배너가 없을 때). 문구는 홈페이지(modooeye.kr) 핵심 메시지 기준. 이미지는 Placeholder.
const DEFAULT_BANNERS: Banner[] = [
  {
    label: "분야별 전문의가 함께 보는 안과",
    text: "망막·녹내장·백내장·외안부·성형안과 질환의|풍부한 임상경험을 가진\n분야별 전문의가 직접 진료합니다.",
  },
  {
    label: "대학병원 교수 출신 의료진의 원스톱 진료",
    text: "검사부터 진단, 수술, 수술 후 관리까지 한곳에서.\n대학병원에서 진료하고 가르쳐 온 의료진이|환자의 눈 상태에 맞는 치료 방향을 안내합니다.",
  },
];

type Props = {
  banners?: Banner[]; // HomeContent.banners
  introLabel?: string; // HomeContent.introLabel — 배너에 문구가 없을 때 공통 라벨
  introText?: string; // HomeContent.introText — 배너에 문구가 없을 때 공통 소개 문구
};

export function ClinicIntroSection({ banners: bannersProp, introLabel, introText }: Props) {
  const { clinic } = useSite();
  const mounted = useMounted();
  // 배너 문구 우선순위: 배너 자체 문구 → 공통 소개 문구(introLabel/introText) → 기본 문구
  const banners = (bannersProp && bannersProp.length > 0 ? bannersProp : DEFAULT_BANNERS).map((b, i) => ({
    ...b,
    label: b.label || introLabel || DEFAULT_BANNERS[i % DEFAULT_BANNERS.length].label,
    text: b.text || introText || DEFAULT_BANNERS[i % DEFAULT_BANNERS.length].text,
  }));

  // 배너 한 장 (서버 프리렌더 시 첫 장만, 마운트 후 swiper 슬라이드로)
  const renderBanner = (b: Banner, i: number) => {
    // 모바일 전용 이미지가 없으면 데스크톱 이미지를 모바일 비율로 잘라 쓴다
    const desktop = b.image ?? null;
    const mobile = b.mobileImage ?? desktop;
    return (
      <div className="relative w-full">
        {/* 레퍼런스: 데스크톱 배너 1920/920, 모바일 배너 750/1624 */}
        {desktop ? (
          <div className="relative hidden w-full aspect-[1920/920] bg-neutral-700 md:block">
            {/* 데스크톱(md+)에서만 보임. 모바일에선 숨겨지므로 최소 크기로 선언 */}
            <MediaImage image={desktop} sizes="(min-width: 768px) 100vw, 1px" priority={i === 0} />
          </div>
        ) : (
          <Placeholder label={`배너 ${i + 1} (데스크톱)`} className="w-full hidden md:flex aspect-[1920/920] bg-neutral-700 text-neutral-300" />
        )}
        {mobile ? (
          <div className="relative block w-full aspect-[750/1624] bg-neutral-700 md:hidden">
            {/* 모바일에서만 보임. 데스크톱에선 숨겨지므로 최소 크기로 선언 */}
            <MediaImage image={mobile} sizes="(min-width: 768px) 1px, 100vw" priority={i === 0} />
          </div>
        ) : (
          <Placeholder label={`배너 ${i + 1} (모바일)`} className="w-full flex md:hidden aspect-[750/1624] bg-neutral-700 text-neutral-300" />
        )}

        {/* 오버레이 문구 */}
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl absolute inset-0 flex flex-col justify-start py-15 md:py-30">
          <h2 className="max-w-2xl text-xl font-bold leading-tight whitespace-pre-line md:text-5xl">{b.label}</h2>
          <p className="mt-4 max-w-xl text-base text-background/85 whitespace-pre-line md:text-xl">
            {/* "|" 는 모바일에서만 줄바꿈 */}
            <MobileBreaks text={b.text} />
          </p>
          <div className="mt-4 md:mt-6">
            {/* 레퍼런스: 흰 알약 버튼, hover 시 primary 배경. 병원 소개는 기존 홈페이지로 연결 */}
            <Button
              href={clinic.homepageUrl}
              external
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
  };

  return (
    <section className="relative overflow-hidden text-background">
      <div className="relative">
        {mounted && banners.length > 1 ? (
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

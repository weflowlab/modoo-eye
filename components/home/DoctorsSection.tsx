"use client";
// 메인 페이지 의료진 소개 섹션. 왼쪽 제목/문구/버튼 + 오른쪽 의료진 카드 슬라이더.
// 레퍼런스: 세 번째 <section> (py-15 md:py-30, 슬라이더가 오른쪽 화면 끝까지 넘침)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { useSite } from "@/components/SiteProvider";
import type { Doctor } from "@/lib/types";

type Props = { doctors: Doctor[] };

export function DoctorsSection({ doctors }: Props) {
  const { clinic } = useSite();
  // 등록된 의료진이 없으면 섹션 자체를 숨긴다
  if (doctors.length === 0) return null;

  return (
    <section className="py-15 md:py-30 overflow-hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="flex flex-col gap-y-10 lg:flex-row lg:justify-between lg:gap-x-[5%]">
          {/* 왼쪽: 제목 + 문구 + 버튼. 레퍼런스: lg:w-60 xl:w-100 고정폭 */}
          <div className="flex flex-col w-full lg:w-60 lg:shrink-0 lg:justify-between xl:w-100">
            <div>
              <Reveal variant="up">
                <h2 className="text-xl font-bold md:text-3xl lg:text-4xl">
                  {clinic.name} <span className="text-brand-primary">의료진 소개</span>
                </h2>
              </Reveal>
              <Reveal variant="up" delay={0.1}>
                <p className="mt-4 text-sm text-neutral-600 md:text-xl">
                  대학병원 교수 출신 의료진이 망막·녹내장·백내장·외안부·성형안과를 분야별로 나누어 직접 진료합니다.
                </p>
              </Reveal>
              <div className="mt-6">
                <Reveal variant="fade-up" delay={0.2}>
                  <Button
                    href="/doctors"
                    variant="ghost"
                    size="lg"
                    className="inline-flex items-center justify-center h-11 gap-2 rounded-full bg-neutral-100 px-6 text-sm font-medium text-foreground hover:bg-primary hover:text-white md:h-12 md:px-7 md:text-lg transition-all"
                  >
                    의료진소개
                    <IconArrowRight className="size-4 md:size-5" />
                  </Button>
                </Reveal>
              </div>
            </div>
          </div>

          {/* 오른쪽: 의료진 카드 슬라이더. 레퍼런스: 컨테이너 패딩을 음수 마진으로 상쇄해 화면 오른쪽 끝까지 */}
          <div className="-mr-4 w-[calc(100%+1rem)] sm:-mr-6 sm:w-[calc(100%+1.5rem)] lg:mr-[calc(50%-50vw)] lg:w-[calc(100%-240px)] xl:w-[calc(100%-400px)]">
            <Reveal variant="fade-left" delay={0.2}>
              {/* 레퍼런스 이미지 sizes: 모바일 50vw, 데스크톱 320px → 슬라이드 폭 고정 */}
              <Swiper slidesPerView="auto" spaceBetween={16} breakpoints={{ 768: { spaceBetween: 24 } }} className="w-full">
                {doctors.map((doctor) => (
                  <SwiperSlide key={doctor.slug} className="w-[calc(50vw-1.5rem)] md:w-80">
                    <DoctorCard doctor={doctor} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

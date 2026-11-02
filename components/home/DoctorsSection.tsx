"use client";
// 메인 페이지 "의료진 소개" 섹션 (레퍼런스: blog.kimsretina.com 메인의 의료진 소개).
// - 왼쪽 문구: 관리자 "메인 페이지 > 의료진 소개" (제목·문구·버튼). 비운 요소는 나오지 않는다.
// - 오른쪽 카드: 관리자 "의료진" 컬렉션을 표시 순서대로 (사진·이름·직함·전문 분야·한 줄 소개). 글 하단 작성자 카드와 같은 데이터.
// - 의료진이 한 줄(PC 3장)보다 많으면 4초마다 한 장씩 자동으로 넘어가는 슬라이드(아래 점). 서버에서는 첫 줄만 그리고 마운트 후 슬라이드로 바꾼다.
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { MobileBreaks } from "@/components/ui/MobileBreaks";
import { useSite } from "@/components/SiteProvider";
import { useMounted } from "@/components/ui/useMounted";
import type { Doctor, HomeContent } from "@/lib/types";

type Props = {
  doctors: Doctor[];
  content: Pick<HomeContent, "doctorsShow" | "doctorsTitle" | "doctorsText" | "doctorsButton" | "doctorsLink">;
};

// 제목에서 "의료진 소개" 부분만 남색으로 (레퍼런스: "김이태안과 의료진 소개"에서 뒷부분 강조)
function Title({ text }: { text: string }) {
  const key = "의료진 소개";
  const i = text.indexOf(key);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-primary">{key}</span>
      {text.slice(i + key.length)}
    </>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="h-full">
      {/* 사진: 세로 4:5, 얼굴이 위에 있으니 위쪽 기준으로 자른다 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-200">
        {doctor.photo ? (
          <MediaImage image={doctor.photo} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw" className="object-cover object-top" />
        ) : (
          <Placeholder label={`${doctor.name} 프로필`} className="size-full bg-neutral-200" />
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold leading-tight">
        {doctor.name} <span className="ml-1 text-base font-medium text-neutral-500">{doctor.title}</span>
      </h3>
      {doctor.specialties.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {doctor.specialties.map((s) => (
            <li key={s} className="rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-white">
              {s}
            </li>
          ))}
        </ul>
      )}
      {doctor.bio && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">{doctor.bio}</p>}
    </article>
  );
}

export function DoctorsSection({ doctors, content }: Props) {
  const { clinic } = useSite();
  const mounted = useMounted();
  // 관리자에서 끄거나 의료진이 없으면 섹션 자체를 숨긴다
  if (content.doctorsShow === false || doctors.length === 0) return null;

  const link = content.doctorsLink || clinic.homepageUrl; // 비우면 병원 홈페이지
  const PER_VIEW = 3; // PC 한 줄 카드 수. 이보다 많으면 슬라이드
  const slider = mounted && doctors.length > PER_VIEW;

  return (
    <section id="doctors" className="bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* 왼쪽: 문구 */}
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold text-primary md:text-base">DOCTORS</p>
            {content.doctorsTitle && (
              <Reveal variant="up">
                <h2 className="mt-1 whitespace-pre-line text-2xl font-bold leading-tight md:text-3xl">
                  <Title text={content.doctorsTitle} />
                </h2>
              </Reveal>
            )}
            {content.doctorsText && (
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-neutral-600">
                <MobileBreaks text={content.doctorsText} />
              </p>
            )}
            {content.doctorsButton && (
              <div className="mt-6 md:mt-8">
                <Button href={link} variant="outline" size="lg" className="gap-2">
                  {content.doctorsButton}
                  <IconArrowRight className="size-4 md:size-5" />
                </Button>
              </div>
            )}
          </div>

          {/* 오른쪽: 의료진 카드 */}
          <div className="min-w-0 lg:col-span-9">
            {slider ? (
              <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                loop
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }} // 4초마다 한 장씩, 마우스 올리면 멈춤
                spaceBetween={16}
                breakpoints={{ 0: { slidesPerView: 1.3 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: PER_VIEW } }}
                className="!pb-9"
                style={{ "--swiper-pagination-color": "var(--brand-primary)", "--swiper-pagination-bullet-inactive-color": "#9ca3af" } as CSSProperties}
              >
                {doctors.map((d) => (
                  <SwiperSlide key={d.slug} className="!h-auto">
                    <DoctorCard doctor={d} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(mounted ? doctors : doctors.slice(0, PER_VIEW)).map((d, i) => (
                  <Reveal key={d.slug} variant="fade-up" delay={0.1 * i}>
                    <DoctorCard doctor={d} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
// 메인 페이지 히어로. 그라데이션 배경 + 펄스 링 + 떠다니는 아이콘 + 제목/문구 + 검색창 + 인기 키워드.
// 레퍼런스 블로그의 첫 번째 <section> 구조를 따른다.
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  IconEye,
  IconEyeglass,
  IconMicroscope,
  IconSearch,
  IconStethoscope,
} from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";

// 기본 문구 (Payload 'home' 글로벌이 비어 있을 때)
const DEFAULT_TEXT =
  "망막·녹내장·백내장·외안부·성형안과 분야별 전문의가 직접 집필한 안과 정보에서 궁금한 점의 해답을 찾아보세요.";

type Props = {
  title?: string; // HomeContent.heroTitle
  text?: string; // HomeContent.heroText
  placeholder?: string; // HomeContent.searchPlaceholder
};

// 떠다니는 아이콘 4개의 위치/지연. 레퍼런스: animate-icon-enter + animate-float-y
const floatingIcons = [
  { Icon: IconEye, pos: "top-[10%] left-[0%] md:top-[10%] md:left-[10%]", enter: "0.4s", float: "0s" },
  { Icon: IconEyeglass, pos: "top-[2%] right-[3%] md:top-[6%] md:right-[8%]", enter: "0s", float: "-0.7s" },
  { Icon: IconMicroscope, pos: "bottom-[10%] left-[20%] md:bottom-[18%] md:left-[18%]", enter: "0.8s", float: "-1.4s" },
  { Icon: IconStethoscope, pos: "bottom-[18%] right-[10%] md:bottom-[28%] md:right-[14%]", enter: "0.6s", float: "-2.1s" },
];

export function HeroSection({ title, text, placeholder }: Props) {
  const { clinic, popularKeywords } = useSite();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const heroTitle = title || `${clinic.name} 맞춤형 안과 지식 가이드`;
  const heroText = text || DEFAULT_TEXT;
  const searchPlaceholder = placeholder || `${clinic.name} 의료진에게 물어보세요`;

  // 검색: /search?q= 로 이동. 키워드 칩 클릭도 같은 경로.
  const goSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    goSearch(query);
  };

  return (
    <section className="bg-linear-to-br from-brand-secondary/20 to-brand-primary/20 relative overflow-hidden lg:min-h-[calc(100dvh-160px)]">
      {/* 배경 장식: 펄스 링 2개 + 떠다니는 아이콘 4개 */}
      <div className="absolute inset-0 z-0">
        {/* 레퍼런스: 가운데 원 w-full md:w-1/2, 바깥 원 w-4/3 md:w-4/5 */}
        <div className="absolute top-1/2 left-1/2 -translate-1/2 aspect-square z-1 w-full md:w-1/2">
          <div
            className="size-full rounded-full bg-white/10 shadow-[0_4px_80px_0_var(--brand-primary-5)] animate-pulse-ring"
            style={{ animationDelay: "0s" }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-1/2 aspect-square z-1 w-4/3 md:w-4/5">
          <div
            className="size-full rounded-full bg-white/10 shadow-[0_4px_80px_0_var(--brand-primary-5)] animate-pulse-ring"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-2">
          {floatingIcons.map(({ Icon, pos, enter, float }, i) => (
            <div key={i} className={`absolute animate-icon-enter ${pos}`} style={{ animationDelay: enter }}>
              <div className="animate-float-y" style={{ animationDelay: float }}>
                {/* 레퍼런스: 흰 원 + before/after 로 반투명 링 2겹 */}
                <div className="size-12 md:size-16 lg:size-20 bg-white rounded-full flex items-center justify-center relative before:content-[''] before:absolute before:size-16 md:before:size-23 lg:before:size-29 before:bg-white/20 before:rounded-full after:content-[''] after:absolute after:size-25 md:after:size-37 lg:after:size-46 after:border after:border-white after:bg-white/5 after:rounded-full z-1">
                  <div className="relative z-2 [&_svg]:size-7 md:[&_svg]:size-10 lg:[&_svg]:size-12 text-brand-primary">
                    <Icon stroke={1.5} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 본문: 제목 + 문구 + 검색 + 인기 키워드 */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl text-center relative z-5 h-full py-[15vh] md:py-40">
        <div className="flex flex-col items-center justify-center">
          <div className="w-4/5 md:w-full">
            {/* 레퍼런스: overflow-hidden + animate-reveal-up, 제목 0s / 문구 0.25s */}
            <div className="overflow-hidden">
              <div className="animate-reveal-up" style={{ animationDelay: "0s", animationDuration: "0.6s" }}>
                <h1 className="font-bold text-neutral-900 text-2xl md:text-3xl lg:text-5xl xl:text-6xl">{heroTitle}</h1>
              </div>
            </div>
            <div className="overflow-hidden mt-6">
              <div className="animate-reveal-up" style={{ animationDelay: "0.25s", animationDuration: "0.6s" }}>
                <p className="text-base text-neutral-700 lg:text-xl">{heroText}</p>
              </div>
            </div>
          </div>

          {/* 검색창: 그라데이션 테두리 + 흰 입력창 + 오른쪽 돋보기 버튼 */}
          <div className="mx-auto mt-10 w-full max-w-[1000px] overflow-hidden">
            <form className="w-full flex items-center gap-2" onSubmit={onSubmit} role="search">
              <div className="relative w-full">
                <div className="relative p-0.75 lg:p-1 rounded-full bg-linear-to-r from-brand-secondary to-brand-primary shadow-[0_4px_80px_0_var(--brand-primary-10)]">
                  <div className="relative rounded-full bg-white overflow-hidden">
                    <input
                      type="text"
                      name="q"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      aria-label="콘텐츠 검색"
                      className="h-14 lg:h-20 w-full rounded-full bg-white pl-8 pr-18 lg:pr-26 lg:pl-10 text-lg lg:text-xl text-center outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 placeholder:text-neutral-300"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="absolute right-6 lg:right-12.5 top-1/2 -translate-y-1/2 size-8 lg:size-10 inline-flex shrink-0 items-center justify-center rounded-md text-neutral-700 transition-all outline-none hover:text-foreground hover:bg-transparent active:translate-y-px"
                >
                  <IconSearch className="size-5 lg:size-7" />
                  <span className="sr-only">검색</span>
                </button>
              </div>
            </form>
          </div>

          {/* 인기 키워드 박스. 레퍼런스: animate-fade-slide-up 1s 지연. 키워드가 없으면 숨김 */}
          {popularKeywords.length > 0 && (
          <div
            className="animate-fade-slide-up mx-auto mt-5 flex flex-col md:flex-row flex-wrap justify-center items-start md:items-center gap-y-4 gap-x-15 bg-white/30 w-full md:w-fit max-w-800 shadow-[0_4px_20px_0_var(--brand-primary-20)] pl-10 pr-6 py-5 rounded-[16px] border-2 border-white"
            style={{ animationDelay: "1s", animationDuration: "0.6s" }}
          >
            <div className="text-lg text-neutral-800 font-semibold">인기 키워드 : </div>
            <div className="flex flex-wrap gap-1 flex-1 w-full">
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => goSearch(kw)}
                  className="w-full md:w-45 rounded-[4px] px-3 py-2 text-base font-medium truncate bg-white text-neutral-600 hover:bg-linear-to-r from-brand-secondary to-brand-primary hover:text-white"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

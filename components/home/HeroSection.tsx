"use client";
// 메인 페이지 히어로: 흰 배경 + 은은한 장식(연한 남색 번짐 2개 + 점 패턴), 가운데 정렬로 제목·소개·검색창·인기 키워드.
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconEye,
  IconEyeglass,
  IconEyeCheck,
  IconDroplet,
  IconMicroscope,
  IconStethoscope,
} from "@tabler/icons-react";

// 궤도 위를 도는 안과 아이콘. 궤도가 돌면 같이 돌고, 아이콘 자체는 반대로 돌려 항상 똑바로 선다.
// spin: 궤도 회전 클래스, counter: 같은 시간·반대 방향 (아이콘 세우기)
const ORBITS = [
  {
    size: "min(560px,78vw)",
    ring: "border border-[#c5d1e4]",
    spin: "animate-[spin_40s_linear_infinite]",
    counter: "animate-[spin_40s_linear_infinite_reverse]",
    icons: [
      { Icon: IconEye, pos: "left-1/2 top-0" },
      { Icon: IconDroplet, pos: "left-1/2 top-full" },
    ],
  },
  {
    size: "min(860px,120vw)",
    ring: "border border-dashed border-[#a9bfe0]",
    spin: "animate-[spin_70s_linear_infinite_reverse]",
    counter: "animate-[spin_70s_linear_infinite]",
    icons: [
      { Icon: IconEyeglass, pos: "left-1/2 top-0" },
      { Icon: IconEyeCheck, pos: "left-1/2 top-full" },
    ],
  },
  {
    size: "min(1180px,165vw)",
    ring: "border border-[#d2dbe9]",
    spin: "animate-[spin_110s_linear_infinite]",
    counter: "animate-[spin_110s_linear_infinite_reverse]",
    icons: [
      { Icon: IconMicroscope, pos: "left-0 top-1/2" },
      { Icon: IconStethoscope, pos: "left-full top-1/2" },
    ],
  },
];
import { useSite } from "@/components/SiteProvider";
import * as defaults from "@/lib/homeDefaults"; // 기본 문구 (Payload 'home' 글로벌이 비어 있을 때)

// 궤도 원 하나: 가운데 기준으로 놓고(translate -50%) 원이 돌며, 원 위의 아이콘 카드는 반대로 돌아 똑바로 선다. motion-reduce 면 정지
function Orbit({ orbit }: { orbit: (typeof ORBITS)[number] }) {
  return (
    <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2" style={{ width: orbit.size, height: orbit.size }}>
      <div className={`relative size-full rounded-full motion-reduce:animate-none ${orbit.ring} ${orbit.spin}`}>
        {orbit.icons.map(({ Icon, pos }, i) => (
          <div key={i} className={`absolute size-0 ${pos}`}>
            {/* 1) 카드 중심을 궤도 선 위에 맞춤 (translate) → 2) 그 안에서 반대 회전 (spin 은 transform 을 덮어쓰므로 단계를 나눈다) */}
            <div className="w-fit -translate-x-1/2 -translate-y-1/2">
              <div className={`motion-reduce:animate-none ${orbit.counter}`}>
                {/* 흰 둥근 카드 + 남색 아이콘. 모바일은 작게 */}
                <div className="flex size-11 items-center justify-center rounded-2xl border border-[#e3e9f2] bg-white text-primary shadow-[0_8px_24px_0_var(--brand-primary-10)] md:size-14 lg:size-16">
                  <Icon className="size-6 md:size-7 lg:size-8" stroke={1.5} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  title?: string; // HomeContent.heroTitle
  text?: string; // HomeContent.heroText
  placeholder?: string; // HomeContent.searchPlaceholder
};

export function HeroSection({ title, text, placeholder }: Props) {
  const { clinic, popularKeywords } = useSite();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const heroTitle = title || defaults.heroTitle(clinic);
  const heroText = text || defaults.HERO_TEXT;
  const searchPlaceholder = placeholder || defaults.SEARCH_PLACEHOLDER;

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
    // 첫 화면을 꽉 채움: 헤더(모바일 4rem / lg 5rem)와 모바일 하단 바(3.5rem)를 뺀 높이, 내용은 세로 가운데
    <section className="relative isolate flex min-h-[calc(100svh-7.5rem)] items-center overflow-hidden bg-background md:min-h-[calc(100svh-4rem)] lg:min-h-[calc(100svh-5rem)]">
      {/* 배경 장식 (weflowlab.kr/clinic-blog 히어로 방식): 가운데만 보이는 격자 + 천천히 도는 동심원 궤도 3개와 궤도 위의 점 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* 격자: 88px 간격, 가운데에서 바깥으로 사라짐 */}
        <div className="absolute inset-0 bg-[linear-gradient(#cfd8e6_1px,transparent_1px),linear-gradient(90deg,#cfd8e6_1px,transparent_1px)] bg-[size:88px_88px] bg-center [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_0%,transparent_75%)]" />
        {/* 맨 아래 층: 좌상/우하 연한 남색 번짐 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-[480px] rounded-full bg-[var(--brand-primary-10)] blur-3xl" />
          <div className="absolute -bottom-40 -right-24 size-[520px] rounded-full bg-[var(--brand-primary-10)] blur-3xl" />
        </div>
        {/* 그 위 층: 궤도 3개 — 바깥일수록 크고 느리게 (40s / 70s 역방향·점선 / 110s). 궤도마다 안과 아이콘 2개가 함께 돈다 */}
        <div className="absolute left-1/2 top-1/2 z-10 size-0 md:top-[calc(50%-20px)]">
          {ORBITS.map((orbit, i) => (
            <Orbit key={i} orbit={orbit} />
          ))}
        </div>
      </div>

      {/* 세로 가운데보다 살짝 위로: 아래 여백을 위보다 크게 */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-16 text-center md:pt-16 md:pb-26">
        <div className="mx-auto max-w-3xl">
          <p className="animate-fade-slide-up text-base font-bold text-primary md:text-lg" style={{ animationDuration: "0.6s" }}>
            {clinic.name} 웹블로그
          </p>
          <div className="mt-3 overflow-hidden">
            <h1
              className="animate-reveal-up whitespace-pre-line text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl"
              style={{ animationDuration: "0.6s" }}
            >
              {heroTitle}
            </h1>
          </div>
          <div className="mt-5 overflow-hidden">
            <p className="animate-reveal-up text-base leading-relaxed text-neutral-600 md:text-lg" style={{ animationDelay: "0.2s", animationDuration: "0.6s" }}>
              {heroText}
            </p>
          </div>

          {/* 검색창: 연한 회색 테두리 알약 + 남색 버튼 */}
          {/* 검색창: 폭 최대 480px, 높이 64px(모바일 56px), 로고 남색 2px 테두리 */}
          <form className="animate-fade-slide-up mx-auto mt-8 max-w-md" style={{ animationDelay: "0.35s", animationDuration: "0.6s" }} onSubmit={onSubmit} role="search">
            <div className="flex items-center rounded-full border-[3px] border-primary bg-white p-1.5 shadow-[0_4px_16px_0_var(--brand-primary-10)] transition-shadow focus-within:shadow-[0_6px_24px_0_var(--brand-primary-20)]">
              <input
                type="text"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="콘텐츠 검색"
                className="h-11 w-full min-w-0 bg-transparent pl-5 text-base text-foreground outline-none placeholder:text-neutral-400 md:h-13 md:text-lg"
              />
              <button
                type="submit"
                aria-label="검색"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-brand-secondary md:size-13"
              >
                <IconSearch className="size-5 md:size-6" />
              </button>
            </div>
          </form>

          {/* 인기 키워드 칩. 키워드가 없으면 숨김 */}
          {popularKeywords.length > 0 && (
            <div className="animate-fade-slide-up mt-5 flex flex-wrap items-center justify-center gap-2" style={{ animationDelay: "0.5s", animationDuration: "0.6s" }}>
              <span className="mr-1 text-sm font-semibold text-neutral-800 md:text-base">인기 검색어</span>
              {popularKeywords.map((kw, i) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => goSearch(kw)}
                  // 모바일은 한 줄에 맞게 3개까지만, md 이상은 전부
                  className={`rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-primary hover:bg-primary hover:text-white md:text-base ${i >= 3 ? "hidden md:inline-flex" : ""}`}
                >
                  #{kw}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

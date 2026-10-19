"use client";
// 검색 페이지 상단. 메인 히어로와 같은 톤: 흰 배경, 가운데 정렬, 남색 테두리 검색창, 흰 알약 키워드 칩.
// 제출 시 /search?q=<검색어> 로 이동 (헤더 검색 폼과 동일한 URL 패턴).
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";

type Props = {
  query: string; // URL 의 q
  keywords: string[]; // 인기 키워드
  resultCount?: number; // 검색어가 있을 때 결과 건수
};

export function SearchHero({ query, keywords, resultCount }: Props) {
  const router = useRouter();
  // 입력값 상태 (URL 의 q 로 초기화)
  const [value, setValue] = useState(query);

  // 검색 실행: /search?q=
  const go = (q: string) => {
    const trimmed = q.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary md:text-base">SEARCH</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            {query ? (
              <>
                <span className="text-primary">&lsquo;{query}&rsquo;</span> 검색 결과
              </>
            ) : (
              "증상·질환 검색"
            )}
          </h1>
          {query && resultCount !== undefined && (
            <p className="mt-2 text-sm text-neutral-500 md:text-base">{resultCount}건이 검색되었습니다.</p>
          )}

          {/* 검색 폼 (JS 없을 때도 GET /search?q= 로 동작). 메인 히어로와 같은 모양 */}
          <form
            action="/search"
            method="get"
            className="mx-auto mt-6 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              go(value);
            }}
            role="search"
          >
            <div className="flex items-center rounded-full border-[3px] border-primary bg-white p-1.5 shadow-[0_4px_16px_0_var(--brand-primary-10)] transition-shadow focus-within:shadow-[0_6px_24px_0_var(--brand-primary-20)]">
              <input
                type="text"
                name="q"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="증상이나 질환명을 검색해 보세요"
                aria-label="콘텐츠 검색"
                className="h-11 w-full min-w-0 bg-transparent pl-5 text-base text-foreground outline-none placeholder:text-neutral-400 md:h-13 md:text-lg"
              />
              {/* 입력값 있으면 지우기(X), 없으면 검색(돋보기) */}
              {value && (
                <button type="button" aria-label="검색어 지우기" onClick={() => setValue("")} className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                  <IconX className="size-5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="검색"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-brand-secondary md:size-13"
              >
                <IconSearch className="size-5 md:size-6" />
              </button>
            </div>
          </form>

          {/* 인기 검색어 칩: 메인 히어로와 동일 */}
          {keywords.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-sm font-semibold text-neutral-800 md:text-base">인기 검색어</span>
              {keywords.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setValue(k);
                    go(k);
                  }}
                  className={`rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-primary hover:bg-primary hover:text-white md:text-base ${i >= 3 ? "hidden md:inline-flex" : ""}`}
                >
                  #{k}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

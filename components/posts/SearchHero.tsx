"use client";
// 검색 페이지 상단 그라데이션 검색 영역. 검색 입력 폼 + 인기 키워드 + 검색 건수. /search 에서 사용.
// 제출 시 /search?q=<검색어> 로 이동 (헤더 검색 폼과 동일한 URL 패턴).
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";

type Props = {
  query: string; // URL 의 q
  keywords: string[]; // 인기 키워드
  resultCount?: number; // 검색어가 있을 때 결과 건수
};

export function SearchHero({ query, keywords, resultCount }: Props) {
  const { clinic } = useSite();
  const router = useRouter();
  // 입력값 상태 (URL 의 q 로 초기화)
  const [value, setValue] = useState(query);

  // 검색 실행: /search?q=
  const go = (q: string) => {
    const trimmed = q.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    // 레퍼런스: 브랜드 그라데이션 배경, py-8 md:py-12 lg:py-15
    <section className="relative overflow-hidden bg-linear-to-r from-brand-secondary to-brand-primary py-8 md:py-12 lg:py-15">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center">
          {/* 검색 폼 (JS 없을 때도 GET /search?q= 로 동작) */}
          <form
            action="/search"
            method="get"
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              go(value);
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-[0px_4px_20px_0px_var(--brand-primary-20)] backdrop-blur-[25px] md:gap-3 md:px-8 md:py-4 lg:gap-4 lg:px-15 lg:py-5">
              <input
                type="text"
                name="q"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`${clinic.name} 의료진에게 물어보세요`}
                aria-label="콘텐츠 검색"
                className="h-8 w-full flex-1 bg-transparent text-center text-base font-semibold text-neutral-800 outline-none placeholder:font-normal placeholder:text-neutral-300 md:h-10 md:text-lg lg:text-2xl"
              />
              {/* 레퍼런스: 입력값 있으면 지우기(X) 버튼, 없으면 검색(돋보기) 제출 버튼 */}
              {value ? (
                <button
                  type="button"
                  aria-label="검색어 지우기"
                  onClick={() => setValue("")}
                  className="flex size-6 shrink-0 items-center justify-center transition-opacity hover:opacity-70 md:size-8 lg:size-10"
                >
                  <IconX className="size-6 text-neutral-400 md:size-8 lg:size-10" stroke={1.5} />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="검색"
                  className="flex size-6 shrink-0 items-center justify-center hover:bg-transparent md:size-8 lg:size-10"
                >
                  <IconSearch className="size-6 text-brand-primary md:size-8 lg:size-10" stroke={1.5} />
                </button>
              )}
            </div>
          </form>

          {/* 인기 키워드: 클릭 시 해당 키워드로 검색. 칩은 흰 바탕 + 남색 글씨 (반투명 흰 칩은 밝은 쪽 그라데이션에서 AA 미달) */}
          <div className="mt-5 flex flex-col items-center justify-center gap-y-2 md:mt-6 md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-2 lg:mt-8">
            <p className="text-sm font-semibold text-white md:text-base lg:text-lg">인기 키워드 :</p>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {keywords.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => {
                      setValue(k);
                      go(k);
                    }}
                    className="rounded-[4px] bg-white px-3 py-1 text-sm font-medium text-brand-primary shadow-[0px_4px_10px_0px_var(--brand-primary-5)] transition-colors hover:bg-white/85 md:px-5 md:py-1.5 md:text-base"
                  >
                    {k}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 검색 건수 (검색어가 있을 때만) */}
          {query && resultCount !== undefined && (
            <p className="mt-5 text-xs font-medium text-white md:mt-6 md:text-sm lg:mt-8 lg:text-base">
              {resultCount}건이 검색되었습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

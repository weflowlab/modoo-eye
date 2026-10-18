"use client";
// 헤더 돋보기를 눌렀을 때 헤더 아래로 펼쳐지는 검색 패널 (메인 히어로와 같은 스타일).
// 페이지를 밀어내지 않고 위에 덮는다(absolute). 제출·키워드 클릭 시 /search?q= 로 이동.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";

type Props = {
  variant?: "hero" | "header"; // 호환용 (현재는 header 패널만 사용)
  showKeywords?: boolean;
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
};

export function SearchBox({ showKeywords = true, onClose, autoFocus, className = "" }: Props) {
  const { popularKeywords } = useSite();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 열릴 때 입력창에 포커스 (슬라이드 전환 뒤)
  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const goSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    onClose?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    goSearch(query);
  };

  return (
    <section
      aria-label="글 검색"
      className={`absolute inset-x-0 top-full border-b border-neutral-200 bg-white shadow-[0_12px_32px_0_rgba(0,0,0,0.08)] ${className}`}
    >
      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl pt-[10px] pb-6 md:pb-8">
        {/* 닫기: 패널 우상단 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="검색 닫기"
          className="absolute right-4 top-[10px] flex size-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:right-6 lg:right-8"
        >
          <IconX className="size-5" />
        </button>
        <div className="mx-auto max-w-2xl pt-[46px]">
          {/* 검색창: 메인 히어로와 같은 남색 테두리 알약 */}
          <form onSubmit={onSubmit} role="search">
            <div className="flex flex-1 items-center rounded-full border-[3px] border-primary bg-white p-1.5 shadow-[0_4px_16px_0_var(--brand-primary-10)] transition-shadow focus-within:shadow-[0_6px_24px_0_var(--brand-primary-20)]">
              <input
                ref={inputRef}
                type="text"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="증상이나 질환명을 검색해 보세요"
                aria-label="콘텐츠 검색"
                className="h-10 w-full min-w-0 bg-transparent pl-4 text-base text-foreground outline-none placeholder:text-neutral-400 md:h-11 md:text-lg"
              />
              {query && (
                <button type="button" aria-label="검색어 지우기" onClick={() => setQuery("")} className="mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                  <IconX className="size-4" />
                </button>
              )}
              <button
                type="submit"
                aria-label="검색"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-brand-secondary md:size-11"
              >
                <IconSearch className="size-5" />
              </button>
            </div>
          </form>

          {/* 인기 검색어 칩 */}
          {showKeywords && popularKeywords.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-sm font-semibold text-neutral-800">인기 검색어</span>
              {popularKeywords.map((kw, i) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => goSearch(kw)}
                  className={`rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-sm font-semibold text-neutral-900 transition-colors hover:border-primary hover:bg-primary hover:text-white ${i >= 3 ? "hidden md:inline-flex" : ""}`}
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

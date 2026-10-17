"use client";
// 검색 폼. hero = 홈 상단의 큰 둥근 검색창, header = 헤더 검색 아이콘을 눌렀을 때 펼쳐지는 그라데이션 패널.
// 제출/키워드 클릭 시 /search?q= 로 이동.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";

type Props = {
  variant?: "hero" | "header";
  showKeywords?: boolean;
  onClose?: () => void; // header 변형에서 "닫기" 버튼
  autoFocus?: boolean;
  className?: string;
};

export function SearchBox({ variant = "hero", showKeywords = false, onClose, autoFocus, className = "" }: Props) {
  const { clinic, popularKeywords } = useSite();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  // 검색 이동: 공백 제거 후 /search?q=
  const go = (keyword: string) => {
    const t = keyword.trim();
    if (t) router.push(`/search?q=${encodeURIComponent(t)}`);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  // 레퍼런스: 패널이 열리면 입력창에 포커스
  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const placeholder = `${clinic.name} 의료진에게 물어보세요`;

  // ── header 변형: 그라데이션 섹션 + 흰 알약 입력 + 키워드 칩 + 닫기 ──
  if (variant === "header") {
    return (
      // 레퍼런스: bg-linear-to-r from-brand-secondary to-brand-primary py-8 md:py-12 lg:py-15
      <section
        aria-label="검색"
        className={`relative overflow-hidden bg-linear-to-r from-brand-secondary to-brand-primary py-8 md:py-12 lg:py-15 ${className}`}
      >
        <Container size="4xl">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center">
            <form className="relative w-full" onSubmit={onSubmit}>
              {/* 레퍼런스: rounded-full bg-white px-4 py-3 md:px-8 md:py-4 lg:px-15 lg:py-5 + 그림자 */}
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-[0px_4px_20px_0px_var(--brand-primary-20)] backdrop-blur-[25px] md:gap-3 md:px-8 md:py-4 lg:gap-4 lg:px-15 lg:py-5">
                <input
                  ref={inputRef}
                  type="text"
                  name="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={placeholder}
                  aria-label="콘텐츠 검색"
                  className="h-8 w-full flex-1 bg-transparent text-center text-base font-semibold text-neutral-800 outline-none placeholder:font-normal placeholder:text-neutral-300 md:h-10 md:text-lg lg:text-2xl"
                />
                {/* 입력값 있으면 지우기, 없으면 검색 아이콘 */}
                {q ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQ("");
                      inputRef.current?.focus();
                    }}
                    aria-label="검색어 지우기"
                    className="flex size-6 shrink-0 items-center justify-center text-brand-primary transition-opacity hover:opacity-70 md:size-8 lg:size-10"
                  >
                    <IconX className="size-6 md:size-8 lg:size-10" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label="검색"
                    className="flex size-6 shrink-0 items-center justify-center text-brand-primary md:size-8 lg:size-10"
                  >
                    <IconSearch className="size-6 md:size-8 lg:size-10" />
                  </button>
                )}
              </div>
            </form>
            {/* 인기 키워드 칩. 레퍼런스는 흰색 20% 반투명 + 흰 글씨였지만 밝은 쪽 그라데이션 위에서 대비 3.6:1 로 AA 미달 → 흰 바탕 + 남색 글씨 */}
            {showKeywords && popularKeywords.length > 0 && (
              <div className="mt-5 flex flex-col items-center justify-center gap-y-2 md:mt-6 md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-2 lg:mt-8">
                <p className="text-sm font-semibold text-white md:text-base lg:text-lg">인기 키워드 :</p>
                <ul className="flex flex-wrap items-center justify-center gap-2">
                  {popularKeywords.map((k) => (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => go(k)}
                        className="rounded-[4px] bg-white px-3 py-1 text-sm font-medium text-brand-primary shadow-[0px_4px_10px_0px_var(--brand-primary-5)] transition-colors hover:bg-white/85 md:px-5 md:py-1.5 md:text-base"
                      >
                        {k}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* 닫기 */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="검색 닫기"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-white underline-offset-4 transition-all hover:underline md:mt-6 md:text-sm lg:mt-8"
              >
                닫기
                <IconX className="size-3.5 md:size-4" stroke={2} />
              </button>
            )}
          </div>
        </Container>
      </section>
    );
  }

  // ── hero 변형: 홈 상단 큰 검색창 ──
  return (
    <div className={className}>
      {/* 레퍼런스: mx-auto mt-10 w-full max-w-[1000px] overflow-hidden */}
      <div className="mx-auto w-full max-w-[1000px] overflow-hidden">
        <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
          <div className="relative w-full">
            {/* 그라데이션 테두리 */}
            <div className="relative rounded-full bg-linear-to-r from-brand-secondary to-brand-primary p-0.75 shadow-[0_4px_80px_0_var(--brand-primary-10)] lg:p-1">
              <div className="relative overflow-hidden rounded-full bg-white">
                {/* 레퍼런스: h-14 lg:h-20 rounded-full text-center focus ring */}
                <input
                  ref={inputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={placeholder}
                  aria-label="콘텐츠 검색"
                  className="h-14 w-full rounded-full bg-white pl-8 pr-18 text-center text-lg outline-none transition placeholder:text-neutral-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 lg:h-20 lg:pl-10 lg:pr-26 lg:text-xl"
                />
              </div>
            </div>
            {/* 검색 아이콘 버튼 (오른쪽 안쪽) */}
            <button
              type="submit"
              className="absolute right-6 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-brand-primary transition-all hover:bg-transparent lg:right-12.5 lg:size-10"
            >
              <IconSearch className="size-6 lg:size-8" stroke={2} />
              <span className="sr-only">검색</span>
            </button>
          </div>
        </form>
      </div>
      {/* 인기 키워드 박스 (레퍼런스: 흰 반투명 카드 + fade-slide-up) */}
      {showKeywords && popularKeywords.length > 0 && (
        <div
          className="animate-fade-slide-up mx-auto mt-5 flex w-full max-w-800 flex-col flex-wrap items-start justify-center gap-x-15 gap-y-4 rounded-[16px] border-2 border-white bg-white/30 py-5 pl-10 pr-6 shadow-[0_4px_20px_0_var(--brand-primary-20)] md:w-fit md:flex-row md:items-center"
          style={{ animationDelay: "1s", animationDuration: "0.6s" }}
        >
          <div className="text-lg font-semibold text-neutral-800">인기 키워드 : </div>
          <div className="flex w-full flex-1 flex-wrap gap-1">
            {popularKeywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => go(k)}
                className="w-full truncate rounded-[4px] bg-white px-3 py-2 text-base font-medium text-neutral-600 from-brand-secondary to-brand-primary hover:bg-linear-to-r hover:text-white md:w-45"
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

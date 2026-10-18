"use client";
// 글 상세 목차. 제목 아래, 본문 위에 배치. 자체 디자인: 연한 회색 카드, "목차" 라벨 + 항목 수 칩, 번호(01·02…) 목록.
// 현재 보고 있는 섹션은 남색 번호 + 진한 글자. 클릭 시 부드러운 스크롤. 접기/펼치기 가능(기본 접힘).
import { useEffect, useState, type MouseEvent } from "react";
import { IconChevronDown } from "@tabler/icons-react";

export type TocItem = { id: string; heading: string };

type Props = { items: TocItem[]; className?: string };

export function TableOfContents({ items, className = "" }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false); // 기본은 접힘

  // 스크롤 스파이: 헤딩이 상단(헤더 높이 아래) 영역에 들어오면 활성화
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // 항목 클릭: 부드럽게 스크롤 (scroll-margin-top 은 globals.css prose-content 에 정의됨)
  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <nav aria-label="목차" className={`mt-6 rounded-[11px] border border-neutral-200 bg-neutral-50 ${className}`}>
      {/* 머리: 라벨 + 항목 수 칩 + 접기 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">목차</span>
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">{items.length}</span>
        </span>
        <IconChevronDown className={`size-5 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* 번호 목록 */}
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <ol className="space-y-1 px-3 pb-4">
            {items.map((it, i) => {
              const isActive = it.id === active;
              return (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    onClick={(e) => onClick(e, it.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-baseline gap-3 rounded-lg px-2 py-2 text-[15px] transition-colors hover:bg-white hover:text-primary ${
                      isActive ? "bg-white font-semibold text-primary shadow-xs" : "text-neutral-700"
                    }`}
                  >
                    <span className={`w-6 shrink-0 text-xs font-bold tabular-nums ${isActive ? "text-primary" : "text-neutral-400"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{it.heading}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}

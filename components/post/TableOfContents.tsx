"use client";
// 글 상세의 접이식 목차 "목차 (N) ▾". 제목 아래, 본문 위에 배치.
// 레퍼런스: 네이티브 <details> (기본 닫힘) + 현재 보고 있는 섹션 항목 강조 + 클릭 시 부드러운 스크롤.
import { useEffect, useState, type MouseEvent } from "react";

export type TocItem = { id: string; heading: string };

type Props = { items: TocItem[]; className?: string };

export function TableOfContents({ items, className = "" }: Props) {
  // 현재 활성 섹션 id (초기값: 첫 항목)
  const [active, setActive] = useState(items[0]?.id ?? "");

  // 스크롤 스파이: 헤딩이 상단(헤더 높이 아래) 영역에 들어오면 활성화
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // 항목 클릭: 기본 점프 대신 부드럽게 스크롤 (scroll-margin-top 은 globals.css prose-content 에 정의됨)
  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    // 레퍼런스: details.group mt-4 rounded-lg border p-4
    <details className={`group mt-4 rounded-lg border border-neutral-200 p-4 ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-neutral-700 [&::-webkit-details-marker]:hidden">
        <span>목차 ({items.length})</span>
        {/* 레퍼런스: 열리면 ▾ 180도 회전 */}
        <span aria-hidden="true" className="text-neutral-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <nav aria-label="목차" className="mt-3">
        <ol className="space-y-1.5 text-sm">
          {items.map((it) => {
            const isActive = it.id === active;
            return (
              <li key={it.id}>
                {/* 레퍼런스: 왼쪽 2px 선, 활성 항목은 강조색 선 + 진한 글자 */}
                <a
                  href={`#${it.id}`}
                  onClick={(e) => onClick(e, it.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`block border-l-2 py-0.5 pl-3 transition-colors ${
                    isActive
                      ? "border-primary font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {it.heading}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </details>
  );
}

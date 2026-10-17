"use client";
// 의료진 상세 왼쪽 사이드의 섹션 이동 목차. 스크롤 위치에 따라 현재 섹션을 강조(스크롤스파이). lg 이상에서만 표시.
import { useEffect, useState } from "react";

export type SectionNavItem = { id: string; label: string };

type Props = { items: SectionNavItem[] };

export function DoctorSectionNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  // 레퍼런스: IntersectionObserver rootMargin "-96px 0px -60% 0px", 가장 위에 보이는 섹션을 활성화
  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="섹션 이동" className="mt-10 hidden lg:block">
      <ul className="flex flex-col">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              {/* 활성 항목: 왼쪽에 세로 막대(before) + 굵은 글씨 */}
              <a
                href={`#${item.id}`}
                className={`block py-1 pl-2 text-lg transition-colors hover:text-foreground relative ${
                  active
                    ? "pl-2.5 font-semibold before:content-[''] before:block before:w-0.5 before:h-1/2 before:rounded-full before:bg-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2"
                    : "text-neutral-600"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

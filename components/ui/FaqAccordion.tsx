"use client";
// FAQ 아코디언 공통 컴포넌트. 글 상세의 "자주 묻는 질문" 과 메인 페이지에서 사용.
// 레퍼런스: 네이티브 <details> 여러 개 → 동시에 여러 항목 열림, 첫 항목은 기본 열림.
import { useId, useState } from "react";
import type { FaqItem } from "@/lib/types";

type Props = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className = "" }: Props) {
  const baseId = useId();
  // 열린 항목 인덱스 집합 (레퍼런스처럼 복수 열림 허용, 첫 항목 기본 열림)
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    // 레퍼런스: 상단 2px 진한 선, 항목마다 하단 1px 선
    <div className={`border-t-2 border-neutral-900 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i} className="border-b border-border">
            {/* 질문 버튼: 왼쪽 Q 마커 + 오른쪽 꺾쇠(열리면 회전) */}
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              className="relative block w-full cursor-pointer py-[18px] pl-[30px] pr-10 text-left text-[17px] font-bold leading-[1.6] text-foreground"
            >
              <span aria-hidden="true" className="absolute left-0 top-[18px] text-[15px] font-extrabold text-primary">
                Q
              </span>
              {item.question}
              {/* 레퍼런스: 8px 꺾쇠, 닫힘 45deg → 열림 -135deg, 0.25s */}
              <span
                aria-hidden="true"
                className={`absolute right-3 top-[26px] size-2 border-b-2 border-r-2 border-primary transition-transform duration-250 ${
                  isOpen ? "-rotate-135" : "rotate-45"
                }`}
              />
            </button>
            {/* 답변 패널: grid-rows 0fr → 1fr 트랜지션으로 열림/닫힘 애니메이션 */}
            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="relative pb-5 pl-[30px] pr-3 text-base leading-[1.8] text-neutral-600">
                  <span aria-hidden="true" className="absolute left-0 top-0 text-[15px] font-extrabold text-neutral-400">
                    A
                  </span>
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

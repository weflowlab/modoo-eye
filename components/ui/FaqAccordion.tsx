"use client";
// FAQ 아코디언 공통 컴포넌트. 글 상세의 "자주 묻는 질문" 과 메인 페이지에서 사용.
// 한 번에 하나만 열림(첫 항목 기본 열림). 오른쪽 둥근 칩 안의 + 가 열리면 × 로 회전, 질문에 올리면 남색.
import { useId, useState } from "react";
import type { FaqItem } from "@/lib/types";

type Props = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className = "" }: Props) {
  const baseId = useId();
  // 열린 항목 인덱스 (하나만). 같은 항목을 다시 누르면 닫힘
  const [open, setOpen] = useState<number | null>(0);
  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    // 레퍼런스: 상단 2px 진한 선, 항목마다 하단 1px 선
    <div className={`border-t-2 border-neutral-900 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i} className="border-b border-border">
            {/* 질문 버튼: 왼쪽 Q 마커 + 오른쪽 +/× 칩. hover 또는 열림 시 질문 글자 남색 */}
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              className={`group relative block w-full cursor-pointer py-[18px] pl-[40px] pr-12 text-left text-[17px] font-bold leading-[1.6] transition-colors hover:text-primary ${
                isOpen ? "text-primary" : "text-foreground"
              }`}
            >
              <span aria-hidden="true" className="absolute left-[10px] top-[18px] text-[15px] font-extrabold text-primary">
                Q
              </span>
              {item.question}
              {/* +/× 칩: 연한 남색 원, 열리면 45도 회전해 × 모양. hover/열림 시 남색 채움 */}
              <span
                aria-hidden="true"
                className={`absolute right-[10px] top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-250 group-hover:bg-primary group-hover:text-white ${
                  isOpen ? "rotate-45 bg-primary text-white" : "bg-[var(--brand-primary-10)] text-primary"
                }`}
              >
                <span className="absolute h-[2px] w-3 rounded-full bg-current" />
                <span className="absolute h-3 w-[2px] rounded-full bg-current" />
              </span>
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
                <div className="relative pb-5 pl-[40px] pr-12 text-base leading-[1.8] text-neutral-600">
                  <span aria-hidden="true" className="absolute left-[10px] top-0 text-[15px] font-extrabold text-neutral-400">
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

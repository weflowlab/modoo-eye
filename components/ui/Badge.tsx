// 배지(전문 분야 태그 등). 레퍼런스 data-slot="badge" 의 클래스를 그대로 옮김.
import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export function Badge({ children, className = "" }: Props) {
  return (
    // 레퍼런스: 의료진 카드 전문분야 배지 (rounded-[2px] bg-neutral-800 text-white py-1 px-3 text-xs md:text-sm)
    <span
      data-slot="badge"
      className={`group/badge inline-flex h-auto w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[2px] border border-transparent bg-neutral-800 px-3 py-1 text-xs font-medium whitespace-nowrap text-white transition-all md:text-sm [&>svg]:pointer-events-none [&>svg]:size-3! ${className}`}
    >
      {children}
    </span>
  );
}

"use client";
// 카드 슬라이더의 이전/다음 둥근 버튼. 데스크톱(md 이상)에서만 보임.
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = { direction: "prev" | "next"; onClick: () => void; disabled?: boolean };

export function CarouselNavButton({ direction, onClick, disabled }: Props) {
  const Icon = direction === "prev" ? IconChevronLeft : IconChevronRight;
  return (
    // 레퍼런스: size-12 rounded-full bg-neutral-100, hover:bg-muted, disabled 시 50% 투명
    <button
      type="button"
      aria-label={direction === "prev" ? "이전" : "다음"}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium transition-all hover:bg-muted hover:text-foreground active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
    >
      <Icon size={16} stroke={2} />
    </button>
  );
}

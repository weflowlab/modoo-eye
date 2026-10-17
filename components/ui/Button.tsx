// 공통 버튼. href 가 있으면 Link(내부)/a(외부) 로, 없으면 button 으로 렌더.
// 레퍼런스 shadcn Button 의 base 클래스 + 사이트에서 실제 쓰는 rounded-full 변형을 그대로 옮김.
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  "aria-label"?: string;
};

// 레퍼런스: data-slot="button" 공통 base 클래스 (포커스 링, svg 크기, disabled 처리)
const base =
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

// 레퍼런스 변형: primary = 홈페이지 바로가기 hover 패턴, outline = "View more", ghost = 의료진소개/전체글보기 버튼
const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-brand-secondary hover:text-white",
  outline: "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground",
  ghost: "bg-neutral-100 text-foreground hover:bg-primary hover:text-white",
};

// 레퍼런스 치수: sm = 헤더 칩, md = View more(h-10 px-10), lg = 의료진소개(h-11 md:h-12 px-6 md:px-7 text-base md:text-lg)
const sizes = {
  sm: "h-9 px-4 text-xs lg:text-sm",
  md: "h-10 px-7 text-sm md:text-base",
  lg: "h-11 px-6 text-base md:h-12 md:px-7 md:text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className = "",
  children,
  onClick,
  type = "button",
  disabled,
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  // 외부 링크: 새 창 + noopener
  if (href && (external || /^https?:\/\//i.test(href))) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  // 내부 링크: next/link
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

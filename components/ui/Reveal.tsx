"use client";
// 스크롤 등장 애니메이션 래퍼. 뷰포트에 들어오면 숨김 상태 → 원위치로 전환.
// 레퍼런스(framer-motion whileInView)의 세 가지 초기 상태를 variant 로 재현한다.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Variant =
  | "up" // 레퍼런스: overflow-hidden 안에서 translateY(100%) → 0 (제목용)
  | "fade-up" // 레퍼런스: opacity 0 + translateY(40px) → 보임 (버튼/문단용)
  | "fade-left"; // 레퍼런스: opacity 0 + translateX(40px) → 보임 (슬라이더용)

type Props = {
  children: ReactNode;
  variant?: Variant;
  delay?: number; // 초 단위 지연
  duration?: number; // 초 단위
  className?: string;
  as?: "div" | "span";
};

const hiddenStyle: Record<Variant, CSSProperties> = {
  up: { transform: "translateY(100%)" },
  "fade-up": { opacity: 0, transform: "translateY(40px)" },
  "fade-left": { opacity: 0, transform: "translateX(40px)" },
};

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  className = "",
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // 뷰포트 진입 감지 (한 번만 재생)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 구형 브라우저(IntersectionObserver 없음)는 다음 프레임에 바로 표시
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  const style: CSSProperties = {
    ...(visible ? { opacity: 1, transform: "none" } : hiddenStyle[variant]),
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}s`,
    transitionTimingFunction: "ease-out",
    transitionDelay: `${delay}s`,
  };

  const inner = (
    <Tag ref={ref} className={`motion-reduce:transition-none ${className}`} style={style}>
      {children}
    </Tag>
  );

  // "up" 은 레퍼런스처럼 overflow-hidden 래퍼로 감싸 아래에서 올라오는 효과를 만든다
  return variant === "up" ? <div className="overflow-hidden">{inner}</div> : inner;
}

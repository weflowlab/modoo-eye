"use client";
// 화면에 들어오면 글자가 한 자씩 타이핑되듯 나타나는 텍스트 (커서 없음, 한 번만 재생).
// 전체 문장을 보이지 않게 깔아 두어 타이핑 중에도 높이·폭이 흔들리지 않는다.
import { useEffect, useRef, useState } from "react";
import { MobileBreaks, stripMobileBreaks } from "./MobileBreaks";

type Props = {
  text: string;
  speed?: number; // 글자당 ms
  startDelay?: number; // 시작 지연 ms
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function TypingText({ text, speed = 55, startDelay = 150, className = "", as = "span" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0); // 지금까지 보여줄 글자 수
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    let started = false;

    // 뷰포트 진입 시 한 번만 시작
    const start = () => {
      if (started) return;
      started = true;
      let i = 0;
      const tick = () => {
        i += 1;
        setCount(i);
        if (i < text.length) timer = window.setTimeout(tick, speed);
      };
      timer = window.setTimeout(tick, startDelay);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => window.clearTimeout(timer);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  return (
    <Tag ref={ref as never} className={`relative inline-block ${className}`} aria-label={stripMobileBreaks(text)}>
      {/* 자리 확보용 전체 문장 (안 보임). "|" 는 모바일에서만 줄바꿈 */}
      <span aria-hidden className="invisible">
        <MobileBreaks text={text} />
      </span>
      {/* 실제로 보이는 타이핑 중인 글자. 데스크톱은 문장 시작점부터, 모바일(두 줄)은 각 줄 가운데 */}
      <span aria-hidden className="absolute inset-0 text-center md:text-left">
        <MobileBreaks text={text.slice(0, count)} />
      </span>
    </Tag>
  );
}

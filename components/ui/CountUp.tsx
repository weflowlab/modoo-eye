"use client";
// "7,000례 이상" 같은 문자열에서 숫자를 찾아, 화면에 들어오면 0부터 그 숫자까지 올라가는 카운터.
// 숫자 앞뒤 글자("례 이상" 등)는 그대로 두고 숫자만 바뀐다. 한 번만 재생.
import { useEffect, useRef, useState } from "react";

type Props = { value: string; duration?: number; className?: string };

// 첫 번째 숫자(쉼표 포함)를 찾아 앞/숫자/뒤로 나눈다
function split(value: string) {
  const m = value.match(/(\d[\d,]*)/);
  if (!m || m.index === undefined) return null;
  return { before: value.slice(0, m.index), num: Number(m[1].replace(/,/g, "")), after: value.slice(m.index + m[1].length) };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({ value, duration = 1600, className = "" }: Props) {
  const parts = split(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parts) return;
    let raf = 0;
    let started = false;
    const target = parts.num;

    const start = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const frame = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setCurrent(Math.round(target * easeOut(p)));
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // parts 는 value 에서 파생되므로 value 만 의존
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!parts) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={value}>
      {parts.before}
      {current.toLocaleString("ko-KR")}
      {parts.after}
    </span>
  );
}

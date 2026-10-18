// 글 맨 위 "핵심 요약" 상자 + "핵심 포인트" 불릿 (제목 아래, 목차 위). 레퍼런스 상단 요약 박스.
// 요약은 글의 summary(필수), 포인트는 keyPoints(선택). AI 검색·검색엔진이 글 요지를 바로 읽도록 글자로 둔다.
import { IconPointFilled } from "@tabler/icons-react";

type Props = { summary: string; points?: string[]; className?: string };

export function KeySummary({ summary, points = [], className = "" }: Props) {
  return (
    <section
      aria-label="핵심 요약"
      className={`rounded-[11px] border border-[var(--brand-primary-20)] bg-[var(--brand-primary-5)] px-5 py-5 md:px-7 md:py-6 ${className}`}
    >
      <p className="text-[13px] font-bold tracking-[0.12em] text-primary">핵심 요약</p>
      <p className="mt-2 text-[16.5px] font-semibold leading-[1.7] text-foreground md:text-[18px]">{summary}</p>
      {points.length > 0 && (
        <>
          <p className="mt-5 text-[13px] font-bold tracking-[0.12em] text-primary">핵심 포인트</p>
          <ul className="mt-2 space-y-1.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-[15.5px] leading-[1.7] text-neutral-700">
                <IconPointFilled className="mt-[5px] size-4 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

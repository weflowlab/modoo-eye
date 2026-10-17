// 출처 섹션 "참고한 공신력 있는 자료". 글 본문(FAQ) 아래에 배치. 외부 링크 카드 그리드.
// 레퍼런스: 왼쪽 강조선 h3 + 2열 카드(기관명 / 제목 / 설명), hover 시 테두리 강조 + 살짝 떠오름.
import type { Post } from "@/lib/types";

type Props = { sources: Post["sources"]; className?: string };

// 링크 주소에서 기관 표기용 호스트명 추출 (목 데이터엔 기관 필드가 없음)
function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "참고 자료";
  }
}

export function SourceLinks({ sources, className = "" }: Props) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className={`mt-[42px] md:mt-[52px] ${className}`}>
      <h3
        id="sources-heading"
        className="border-l-4 border-primary pl-[13px] text-[17.5px] font-bold leading-[1.5] text-foreground md:text-[19px]"
      >
        참고한 공신력 있는 자료
      </h3>
      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {sources.map((s) => (
          <a
            key={s.label + s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[12px] border border-border bg-white p-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-neutral-50 sm:hover:-translate-y-0.5"
          >
            <span className="mb-1.5 block text-xs font-bold tracking-wider text-primary">{hostOf(s.href)}</span>
            <span className="mb-1 block text-[15.5px] font-bold leading-[1.55] text-foreground">{s.label}</span>
            <span className="block break-all text-[13.5px] leading-[1.6] text-neutral-500">{s.href}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

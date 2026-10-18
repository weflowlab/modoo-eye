// 글 본문 섹션 제목(h2). 레퍼런스처럼 "01. DEFINITION" 작은 라벨 줄 + 한글 제목 두 줄 구성.
// 본문 리치텍스트의 h2(RichTextContent) 와 FAQ 섹션(PostFaq) 이 같이 쓴다. id 는 목차 이동용.
type Props = { id?: string; number: number; label?: string; title: React.ReactNode; className?: string };

export function PostSectionHeading({ id, number, label, title, className = "" }: Props) {
  return (
    <h2 id={id} className={`mt-[42px]! mb-4! md:mt-[52px]! ${className}`}>
      <span className="flex items-center gap-2.5 text-[13px] font-bold tracking-[0.18em] text-primary md:text-sm">
        <span className="tabular-nums">{String(number).padStart(2, "0")}.</span>
        {label && <span className="uppercase">{label}</span>}
        <span aria-hidden className="h-px flex-1 bg-[var(--brand-primary-20)]" />
      </span>
      <span className="mt-2 block text-[22px] font-bold leading-snug text-foreground md:text-[26px]">{title}</span>
    </h2>
  );
}

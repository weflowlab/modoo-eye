// "관련 검색어" 블록. FAQ 아래, 상담 블록 위에 배치. 각 태그는 검색 페이지(/search?q=태그)로 연결.
// 자체 디자인: 연한 회색 카드 안에 "# 관련 검색어" 제목, 흰 알약 칩(남색 테두리·글자), 올리면 남색으로 채움.
import Link from "next/link";
import { IconHash } from "@tabler/icons-react";

type Props = { tags: string[]; className?: string };

export function HashTags({ tags, className = "" }: Props) {
  if (tags.length === 0) return null;
  return (
    <section className={`mt-10 rounded-[11px] border border-neutral-200 bg-neutral-50 p-5 md:p-6 ${className}`}>
      <h2 className="m-0! flex items-center gap-1 text-base font-bold text-foreground">
        <IconHash className="size-4 text-primary" stroke={2.5} />
        관련 검색어
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-[var(--brand-primary-20)] bg-white px-3.5 py-1.5 text-sm font-medium text-primary no-underline! transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            {tag}
          </Link>
        ))}
      </div>
    </section>
  );
}

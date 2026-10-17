// 해시태그 칩 목록. "함께 읽으면 좋은 글" 아래에 배치. 각 태그는 검색 페이지(/search?q=태그)로 연결.
// 레퍼런스: 검정 배경 흰 글자 칩, 2px 모서리, hover 시 강조색.
import Link from "next/link";

type Props = { tags: string[]; className?: string };

export function HashTags({ tags, className = "" }: Props) {
  if (tags.length === 0) return null;
  return (
    <section className={`mt-16 ${className}`}>
      <h2 className="sr-only">해시태그</h2>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="rounded-[2px] bg-neutral-900 px-3 py-1 text-sm text-white transition-all duration-300 hover:bg-primary"
          >
            {tag}
          </Link>
        ))}
      </div>
    </section>
  );
}

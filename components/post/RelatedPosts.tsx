// "함께 읽으면 좋은 글" 링크 목록 박스. CTA 아래에 배치. post.related slug 로 posts 에서 찾아 최대 4개.
// 레퍼런스: rounded-lg 테두리 박스, 제목 h2 + 밑줄 hover 링크 목록.
import Link from "next/link";
import { posts } from "@/lib/mock";
import type { Post } from "@/lib/types";

type Props = { related: Post["related"]; className?: string };

export function RelatedPosts({ related, className = "" }: Props) {
  // slug 목록 → 글 객체 (없는 slug 는 건너뜀), 최대 4개
  const items = related
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is Post => Boolean(p))
    .slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="read-also-heading"
      className={`mt-12 rounded-lg border border-neutral-200 p-5 md:p-6 ${className}`}
    >
      <h2 id="read-also-heading" className="text-lg font-bold">
        함께 읽으면 좋은 글
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${p.category}/${p.slug}`}
              className="text-base text-neutral-700 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

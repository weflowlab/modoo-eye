// "함께 읽으면 좋은 글" 링크 목록 박스. CTA 아래에 배치. 글 상세 페이지가 post.related slug 로 조회한 글 목록을 넘긴다 (최대 4개 표시).
// 레퍼런스: rounded-lg 테두리 박스, 제목 h2 + 밑줄 hover 링크 목록.
import Link from "next/link";
import type { Post } from "@/lib/types";

type Props = { posts: Post[]; className?: string };

export function RelatedPosts({ posts, className = "" }: Props) {
  const items = posts.slice(0, 4);
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

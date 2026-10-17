// 검색 결과용 가로형 글 카드 (썸네일 왼쪽 + 제목/요약 오른쪽). /search 에서 사용.
// highlight 가 있으면 제목·요약에서 일치 문자열을 브랜드 색으로 강조 (레퍼런스 동작).
import Link from "next/link";
import type { Post } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = {
  post: Post;
  highlight?: string;
  className?: string;
};

export function PostListItem({ post, highlight, className = "" }: Props) {
  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className={`group flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10 ${className}`}
    >
      {/* 썸네일: 모바일 전체폭 / sm 200px / md 300px (레퍼런스) */}
      <div className="w-full shrink-0 sm:w-[200px] md:w-[300px]">
        <div className="relative w-full pb-[100%]">
          <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-neutral-200">
            {post.thumbnail ? (
              <MediaImage
                image={post.thumbnail}
                sizes="(min-width: 768px) 300px, (min-width: 640px) 200px, 100vw"
                className="transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <Placeholder
                label={`썸네일 · ${post.title}`}
                className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-neutral-800 transition-colors group-hover:text-brand-primary md:text-2xl">
          <Highlight text={post.title} query={highlight} />
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600 md:text-lg">
          <Highlight text={post.summary} query={highlight} />
        </p>
      </div>
    </Link>
  );
}

// 검색어 일치 부분을 <span class="text-brand-primary"> 로 감싸서 출력
function Highlight({ text, query }: { text: string; query?: string }) {
  const q = query?.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(q);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-brand-primary">{q}</span>}
        </span>
      ))}
    </>
  );
}

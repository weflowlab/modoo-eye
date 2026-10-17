// 글 카드 그리드. 카테고리 페이지·전체글보기에서 사용.
// 레퍼런스: 모바일 1열 / md 3열 / lg 4열, gap-x-6 gap-y-10
import type { Post } from "@/lib/types";
import { PostCard } from "./PostCard";

type Props = {
  posts: Post[];
  showSummary?: boolean;
  className?: string;
};

export function PostGrid({ posts, showSummary = false, className = "" }: Props) {
  return (
    <div className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {posts.map((post) => (
        <PostCard key={`${post.category}/${post.slug}`} post={post} showSummary={showSummary} />
      ))}
    </div>
  );
}

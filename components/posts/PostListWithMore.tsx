"use client";
// 글 목록 + "View more" 더보기. 처음 initialCount 개만 보여주고 버튼을 누를 때마다 step 개씩 추가.
// variant "grid" = 카테고리/전체글 카드 그리드, "list" = 검색 결과 가로형 2열 목록.
import { useState } from "react";
import type { Post } from "@/lib/types";
import { PostGrid } from "./PostGrid";
import { PostListItem } from "./PostListItem";

type Props = {
  posts: Post[];
  initialCount?: number; // 레퍼런스: 카테고리 6개, 전체글/검색 9개
  step?: number;
  variant?: "grid" | "list";
  highlight?: string; // list 변형에서 검색어 강조
  className?: string;
};

export function PostListWithMore({
  posts,
  initialCount = 6,
  step = 6,
  variant = "grid",
  highlight,
  className = "",
}: Props) {
  // 현재 보여주는 개수 상태
  const [visible, setVisible] = useState(initialCount);
  const shown = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  return (
    <div className={className}>
      {variant === "grid" ? (
        <PostGrid posts={shown} />
      ) : (
        // 레퍼런스 검색 결과: 모바일 1열 / lg 2열, gap-x-20
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 lg:grid-cols-2 lg:gap-y-20">
          {shown.map((post) => (
            <PostListItem key={`${post.category}/${post.slug}`} post={post} highlight={highlight} />
          ))}
        </div>
      )}

      {/* 더보기 버튼: 다 보여주면 숨김. 한 줄(4개) 단위로 추가되도록 호출부에서 8개씩 */}
      {hasMore && (
        <div className="mt-12 flex justify-center md:mt-16">
          <button
            type="button"
            onClick={() => setVisible((v) => v + step)}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-background bg-clip-padding px-10 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
          >
            View more
          </button>
        </div>
      )}
    </div>
  );
}

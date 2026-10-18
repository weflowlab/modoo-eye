"use client";
// 글 목록 브라우저: 왼쪽 탭(서버에서 넘겨받음) + 오른쪽 정렬 드롭박스(최신순 / 조회수순 / 오래된순) 한 줄, 그 아래 정렬된 목록.
// 정렬은 이 컴포넌트 안의 상태라 페이지를 옮기면 최신순으로 돌아간다.
import { useState, type ReactNode } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import type { Post } from "@/lib/types";
import { PostListWithMore } from "./PostListWithMore";
import { EmptyPosts } from "./EmptyPosts";

type SortKey = "latest" | "views" | "oldest";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "views", label: "조회수순" },
  { key: "oldest", label: "오래된순" },
];

function sortPosts(posts: Post[], key: SortKey): Post[] {
  const arr = [...posts];
  if (key === "views") return arr.sort((a, b) => b.views - a.views);
  if (key === "oldest") return arr.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  return arr.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

type Props = {
  posts: Post[];
  tabs: ReactNode; // CategoryTabs (서버 컴포넌트) 를 그대로 넘긴다
  initialCount?: number;
  step?: number;
};

export function PostBrowser({ posts, tabs, initialCount = 8, step = 8 }: Props) {
  const [sort, setSort] = useState<SortKey>("latest");
  const sorted = sortPosts(posts, sort);

  return (
    <>
      {/* 탭 + 정렬: 같은 줄, 아래 선으로 정렬 */}
      <div className="mt-5 flex items-center justify-between gap-4 border-b border-neutral-200">
        {/* 모바일: 탭 줄 오른쪽 끝을 흰색으로 흐리게 → 옆으로 더 있다는 힌트 */}
        <div className="relative min-w-0 flex-1 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-12 after:bg-linear-to-l after:from-white after:to-transparent md:after:hidden [&>div]:mt-0 [&>div]:-mb-px [&>div]:pr-10 md:[&>div]:pr-0">
          {tabs}
        </div>
        {/* 정렬 드롭박스: 연한 회색 알약, 오른쪽 꺾쇠 */}
        <label className="relative mb-2 shrink-0">
          <span className="sr-only">정렬</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-8 cursor-pointer appearance-none rounded-full border border-neutral-200 bg-neutral-50 pl-3.5 pr-8 text-[13px] font-semibold text-neutral-700 outline-none transition-colors hover:border-primary hover:bg-white hover:text-primary focus:border-primary md:text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-500" stroke={2.5} />
        </label>
      </div>

      {/* 레퍼런스: 목록 상단 여백 mt-10 md:mt-14 */}
      <div className="mt-10 md:mt-14">
        {sorted.length === 0 ? <EmptyPosts /> : <PostListWithMore key={sort} posts={sorted} initialCount={initialCount} step={step} />}
      </div>
    </>
  );
}

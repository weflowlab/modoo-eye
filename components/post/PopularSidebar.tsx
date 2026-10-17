// 글 상세 왼쪽 사이드바 "블로그 인기글" (4개). 데스크톱(lg 이상)에서만 보이고 sticky 로 따라온다.
// 레퍼런스: hidden lg:block, sticky top-24, 원형 썸네일 70px + 2줄 제목, 항목 hover 시 연회색 배경. 모바일에선 렌더되지 않음.
import Link from "next/link";
import type { Post } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";

type Props = { posts: Post[]; className?: string };

export function PopularSidebar({ posts, className = "" }: Props) {
  return (
    <aside className={`hidden lg:block ${className}`}>
      <div className="sticky top-24">
        <aside aria-label="블로그 인기글" className="rounded-xs bg-background">
          <p className="border-b border-neutral-900 px-1 py-4 text-lg font-semibold text-foreground">블로그 인기글</p>
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.category}/${p.slug}`}
                  className="flex gap-4 px-1 py-5 transition-colors hover:bg-neutral-50"
                >
                  {/* 레퍼런스: w-17.5(70px) 원형 썸네일 */}
                  <div className="w-17.5 shrink-0">
                    <Placeholder label="썸네일" className="aspect-square w-full rounded-full text-[10px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-base font-medium leading-snug text-neutral-700">{p.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </aside>
  );
}

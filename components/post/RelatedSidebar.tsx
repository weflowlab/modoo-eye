// 글 상세 왼쪽 사이드바 "관련 글". 같은 주제(카테고리)의 글을 보여준다. 데스크톱(lg 이상)에서만 보이고 sticky 로 따라온다.
// 자체 디자인: 연한 회색 카드 안에 아이브로우 + 제목, 항목은 둥근 네모 썸네일 + 카테고리명 + 2줄 제목. 맨 아래 "이 주제 전체 보기".
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import type { Post } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = {
  posts: Post[];
  categorySlug: string;
  categoryName: string;
  className?: string;
};

export function RelatedSidebar({ posts, categorySlug, categoryName, className = "" }: Props) {
  if (posts.length === 0) return null;
  return (
    <aside className={`hidden lg:block ${className}`} aria-label="관련 글">
      <div className="sticky top-24 rounded-[11px] border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-xs font-semibold text-primary">RELATED</p>
        <p className="mt-0.5 text-lg font-bold text-foreground">관련 글</p>

        <ul className="mt-4 space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.category}/${p.slug}`} className="group flex gap-3">
                {/* 둥근 네모 썸네일 64px */}
                <div className="w-16 shrink-0">
                  {p.thumbnail ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                      <MediaImage image={p.thumbnail} sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                    </div>
                  ) : (
                    <Placeholder label="썸네일" className="aspect-square w-full rounded-lg text-[10px]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-500">{p.categoryName ?? categoryName}</p>
                  <p className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-800 transition-colors group-hover:text-primary">{p.title}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={`/${categorySlug}`}
          className="mt-5 flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary hover:text-primary"
        >
          {categoryName} 글 전체 보기
          <IconArrowRight className="size-4" />
        </Link>
      </div>
    </aside>
  );
}

// "전체" + 카테고리 탭. 카테고리 페이지·전체글보기 제목 아래에 표시.
// mode="query": 전체 = basePath, 카테고리 = `${basePath}?category=<slug>` (전체 글 페이지의 필터)
// mode="path": 전체 = /posts, 카테고리 = /<slug> (카테고리 페이지에서 다른 주제로 바로 이동)
import Link from "next/link";
import type { Category } from "@/lib/types";

type Props = {
  basePath: string; // 예: "/diseases", "/posts"
  categories: Category[];
  current?: string; // 활성 카테고리 slug. 없으면 "전체" 활성
  mode?: "query" | "path";
  className?: string;
};

// 레퍼런스: 활성 = border-foreground font-semibold text-foreground / 비활성 = border-transparent text-muted-foreground
const base = "border-b-2 pb-1 transition-colors";
const active = "border-foreground font-semibold text-foreground";
const inactive = "border-transparent text-muted-foreground hover:text-foreground";

export function CategoryTabs({ basePath, categories, current, mode = "query", className = "" }: Props) {
  const isAll = !current || !categories.some((c) => c.slug === current);
  const hrefOf = (slug: string) => (mode === "path" ? `/${slug}` : `${basePath}?category=${slug}`);
  const allHref = mode === "path" ? "/posts" : basePath;
  return (
    <div className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base ${className}`}>
      <Link href={allHref} className={`${base} ${isAll ? active : inactive}`}>
        전체
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={hrefOf(c.slug)}
          className={`${base} ${!isAll && current === c.slug ? active : inactive}`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}

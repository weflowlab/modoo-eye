// 빵부스러기 경로 (홈 > 카테고리 > 글 제목). 목록 페이지와 글 상세 상단에서 사용.
// 마지막 항목(또는 href 없는 항목)은 현재 페이지로 표시.
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

type Props = {
  items: { label: string; href?: string }[];
  className?: string;
};

export function Breadcrumb({ items, className = "" }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-4 ${className}`}>
      {/* 레퍼런스: text-sm text-muted-foreground, 구분자 chevron size-3.5 */}
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="font-medium text-foreground">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-muted-foreground/60">
                  <IconChevronRight className="size-3.5" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

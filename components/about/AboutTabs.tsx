// About 페이지 제목 아래 탭 줄. 레퍼런스는 "소개" 탭 하나만 있고 밑줄로 활성 표시.
import Link from "next/link";

const TABS = [{ label: "소개", href: "/about" }];

export function AboutTabs() {
  return (
    // 레퍼런스: border-b-2 pb-1, 활성 탭은 border-foreground font-semibold
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base mt-5">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="border-b-2 pb-1 transition-colors border-foreground font-semibold text-foreground"
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

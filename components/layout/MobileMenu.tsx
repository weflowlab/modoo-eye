"use client";
// 헤더 햄버거로 여는 전체 메뉴 (모바일·PC 동일): 오른쪽에서 밀려 나오는 드로어, 뒤는 어둡게.
// 로고 + 닫기 → 블로그 메뉴 목록(전체 글 · 주제별 · 검색) → 맨 아래 홈페이지·전화·톡톡 버튼. 홈페이지 세부 메뉴는 나열하지 않는다.
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowRight, IconArrowUpRight, IconMessageCircle, IconPhone, IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";
import { Sheet } from "@/components/ui/Sheet";

export type NavItem = { id: string; href: string; label: string; active: boolean };

type FullProps = { open: boolean; onClose: () => void };

export function FullMenuSheet({ open, onClose }: FullProps) {
  const { clinic, categories } = useSite();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;

  // 블로그 메뉴: 전체 글 + 주제별 + 검색
  const blogLinks = [
    { href: "/posts", label: "전체 글", Icon: null },
    ...categories.map((c) => ({ href: `/${c.slug}`, label: c.name, Icon: null })),
    { href: "/search", label: "증상·질환 검색", Icon: IconSearch },
  ];

  const itemCls = (active: boolean) =>
    `group flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold transition-colors md:text-lg ${
      active ? "bg-[var(--brand-primary-10)] text-primary" : "text-neutral-800 hover:bg-neutral-50 hover:text-primary"
    }`;

  const menuList = (
    <ul className="divide-y divide-neutral-100">
      {blogLinks.map(({ href, label, Icon }) => (
        <li key={href}>
          <Link href={href} onClick={onClose} className={itemCls(isActive(href))}>
            <span className="flex items-center gap-2">
              {Icon && <Icon className="size-5" />}
              {label}
            </span>
            <IconArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );

  // 오른쪽 드로어 (모바일·PC 동일)
  return (
      <Sheet open={open} onClose={onClose} side="right" modal title="전체 메뉴" className="h-full w-[80vw] max-w-[380px] p-0">
        {/* 상단: 로고 + 닫기 */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5">
          <Link href="/" onClick={onClose} aria-label="웹블로그 홈으로 이동">
            <Image src="/logo.webp" alt={clinic.name} width={181} height={56} className="h-7 w-auto" />
          </Link>
          <button type="button" onClick={onClose} aria-label="메뉴 닫기" className="-mr-2 rounded-full p-2 text-neutral-700 hover:bg-neutral-100">
            <IconX className="size-6" />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 text-xs font-semibold text-primary">BLOG</p>
          <div className="mt-1">{menuList}</div>
        </div>

        {/* 하단: 홈페이지 · 전화 · 톡톡 */}
        <div className="shrink-0 space-y-2 border-t border-neutral-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <a
            href={clinic.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-1.5 rounded-[11px] border border-primary bg-white text-base font-semibold text-primary"
          >
            홈페이지 바로가기
            <IconArrowUpRight className="size-4" />
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a href={tel} className="flex h-12 items-center justify-center gap-2 rounded-[11px] bg-primary text-base font-semibold text-white">
              <IconPhone className="size-5" />
              바로 전화
            </a>
            <a
              href={clinic.consultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-[11px] bg-[#03c75a] text-base font-semibold text-white"
            >
              <IconMessageCircle className="size-5" />
              네이버 톡톡
            </a>
          </div>
        </div>
      </Sheet>
  );
}

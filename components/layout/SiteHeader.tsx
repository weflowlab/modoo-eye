"use client";
// 사이트 헤더. 레퍼런스 2단 구조: (1) 상단 브랜드 띠(로고 + 전체 메뉴 햄버거), (2) sticky 흰 띠(로고, 홈페이지 바로가기, 메뉴, 검색).
// 검색 열림 상태가 두 띠에 걸쳐 공유되므로 전체를 client 로 둔다.
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { IconArrowRight, IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { SearchBox } from "@/components/layout/SearchBox";
import { FullMenuSheet, MobileMenu, type NavItem } from "@/components/layout/MobileMenu";

export function SiteHeader() {
  const { clinic, categories } = useSite();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 흰 띠 햄버거 (모바일 내비)
  const [fullOpen, setFullOpen] = useState(false); // 상단 띠 햄버거 (전체 메뉴)
  // 클라이언트 마운트 여부 (포털용). 서버 스냅샷은 false
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // 메뉴 목록: 카테고리(진료 분야). 병원 소개·의료진은 기존 홈페이지가 담당하므로 메뉴에 두지 않는다
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const nav: NavItem[] = categories
    .map((c) => ({ id: c.slug, href: `/${c.slug}`, label: c.name }))
    .map((n) => ({ ...n, active: isActive(n.href) }));

  // 경로가 바뀌면 열려 있던 패널 모두 닫기 (렌더 중 파생 상태 갱신)
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setSearchOpen(false);
    setMenuOpen(false);
    setFullOpen(false);
  }

  // 레퍼런스: 전체 메뉴가 열리면 body 를 position:fixed 로 고정(스크롤 잠금), 닫히면 원래 위치로 복귀
  useEffect(() => {
    if (!fullOpen) return;
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [fullOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeFull = useCallback(() => setFullOpen(false), []);

  // 레퍼런스: 검색 패널 열림 또는 /search 경로면 상단 띠가 그라데이션으로 바뀜
  const topGradient = searchOpen || isActive("/search");

  return (
    <>
      {/* ── (1) 상단 브랜드 띠 ── 레퍼런스: h-12 lg:h-20, bg-primary */}
      <div className={`relative z-30 text-primary-foreground ${topGradient ? "bg-linear-to-r from-brand-secondary to-brand-primary" : "bg-primary"}`}>
        <Container size="4xl" className="flex h-12 items-center justify-between lg:h-20">
          {/* 남색 띠 위에는 남색 로고가 안 보이므로 흰 알약(pill) 안에 넣는다. 레퍼런스 로고 높이(h-7 / lg:h-11)를 알약 높이로 유지 */}
          <a
            href={clinic.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${clinic.name} 홈페이지`}
            className="flex h-7 items-center rounded-full bg-white px-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90 lg:h-11 lg:px-5"
          >
            <Image src="/logo.png" alt={clinic.name} width={181} height={56} loading="eager" className="h-4 w-auto lg:h-7" />
          </a>
          <button
            type="button"
            data-sheet-toggle
            onClick={() => setFullOpen((v) => !v)}
            className="p-1"
            aria-label={fullOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
            aria-expanded={fullOpen}
          >
            {fullOpen ? <IconX className="size-7 lg:size-9" /> : <IconMenu2 className="size-7 lg:size-9" />}
          </button>
        </Container>
      </div>
      <FullMenuSheet open={fullOpen} onClose={closeFull} />

      {/* ── (2) sticky 흰 띠 ── 레퍼런스: sticky top-0 z-30, h-16 lg:h-20, border-b */}
      <header className="sticky top-0 z-30">
        <div className="border-b border-border bg-background text-foreground">
          <Container size="4xl" className="flex h-16 items-center justify-between gap-3 md:gap-8 lg:h-20">
            {/* 왼쪽: 블로그 로고 + 홈페이지 바로가기 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-6">
              <Link href="/" aria-label="웹블로그 홈으로 이동" className="relative flex shrink-0 items-center text-current">
                {/* 레퍼런스 로고 박스 w-28 h-9 / lg:w-44 lg:h-14 안에 들어가는 높이로 (181×56 비율) */}
                <Image src="/logo.png" alt={`${clinic.name} 블로그`} width={181} height={56} loading="eager" className="h-8 w-auto lg:h-12" />
              </Link>
              <a
                href={clinic.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="홈페이지 바로가기"
                className="flex min-w-0 items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-800 transition-colors hover:bg-brand-secondary hover:text-white lg:gap-2 lg:px-7 lg:py-3 lg:text-lg lg:tracking-[-0.18px]"
              >
                <span className="min-w-0 truncate">홈페이지 바로가기</span>
                <IconArrowRight className="size-2.5 shrink-0 lg:size-[15px]" stroke={2.5} />
              </a>
            </div>

            {/* 데스크톱 내비 + 검색 버튼 (md 이상) */}
            <div className="hidden h-full min-w-0 flex-1 items-center justify-end gap-6 md:flex lg:gap-8 xl:gap-[clamp(1rem,5%,5rem)]">
              <nav className="flex h-full min-w-0 flex-1 items-center justify-end gap-6 lg:gap-8 xl:gap-[clamp(1rem,5%,5rem)]">
                {nav.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative flex h-full min-w-0 max-w-30 shrink items-center py-2 text-sm font-medium transition-colors lg:max-w-40 lg:text-base ${item.active ? "text-primary" : "text-foreground"}`}
                  >
                    <span className="block min-w-0 truncate">{item.label}</span>
                    {/* hover 시 가운데서 퍼지는 밑줄 */}
                    <div className="absolute -bottom-px left-1/2 right-0 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-full" />
                    {/* 활성 밑줄 */}
                    {item.active && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
                aria-expanded={searchOpen}
                className="shrink-0 rounded-full p-1 text-foreground hover:bg-muted"
              >
                <IconSearch className="size-5 lg:size-7" />
              </button>
            </div>

            {/* 모바일: 검색 + 햄버거 (md 미만) */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
                aria-expanded={searchOpen}
                className="rounded-full p-2 text-foreground hover:bg-muted"
              >
                <IconSearch className="size-6 lg:size-7" />
              </button>
              <button
                type="button"
                data-sheet-toggle
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 text-foreground"
                aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={menuOpen}
              >
                <IconMenu2 className="size-7 lg:size-9" />
              </button>
            </div>
          </Container>
        </div>

        {/* 검색 패널: 헤더 아래로 펼쳐짐 + 뒤쪽 어두운 배경(바깥 클릭 닫기) */}
        {searchOpen && (
          <>
            {mounted &&
              createPortal(
                <div onClick={closeSearch} aria-hidden className="fixed inset-0 z-20 bg-black/40" />,
                document.body,
              )}
            <SearchBox variant="header" showKeywords autoFocus onClose={closeSearch} />
          </>
        )}
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} items={nav} />
    </>
  );
}

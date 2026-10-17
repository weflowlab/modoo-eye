"use client";
// 사이트 헤더. sticky 흰 띠 하나: 로고, 홈페이지 바로가기, 카테고리 메뉴(md 이상), 검색, 전체 메뉴 햄버거.
// (레퍼런스는 위에 남색 브랜드 띠가 하나 더 있었지만 단순화를 위해 제거)
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { IconArrowRight, IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { SearchBox } from "@/components/layout/SearchBox";
import { FullMenuSheet, type NavItem } from "@/components/layout/MobileMenu";

export function SiteHeader() {
  const { clinic, categories } = useSite();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 전체 메뉴 (햄버거)
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
  }

  // 전체 메뉴가 열리면 body 를 고정(스크롤 잠금), 닫히면 원래 위치로 복귀
  useEffect(() => {
    if (!menuOpen) return;
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
  }, [menuOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 검색과 메뉴는 동시에 열리지 않는다
  const toggleSearch = () => {
    setMenuOpen(false);
    setSearchOpen((v) => !v);
  };
  const toggleMenu = () => {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  };

  return (
    <>
      {/* sticky 흰 띠. 레퍼런스: sticky top-0 z-30, h-16 lg:h-20, border-b */}
      <header className="sticky top-0 z-30">
        {/* 남색 띠 + 흰 글씨 */}
        <div className="bg-primary text-white">
          <Container size="4xl" className="flex h-16 items-center justify-between gap-3 md:gap-8 lg:h-20">
            {/* 왼쪽: 블로그 로고 + 홈페이지 바로가기 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-6">
              <Link href="/" aria-label="웹블로그 홈으로 이동" className="flex h-8 shrink-0 items-center rounded-full bg-white px-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] lg:h-11 lg:px-5">
                {/* 남색 띠 위에서는 남색 로고가 안 보이므로 흰 알약 안에 넣는다 */}
                <Image src="/logo.png" alt={`${clinic.name} 블로그`} width={181} height={56} loading="eager" className="h-5 w-auto lg:h-7" />
              </Link>
              <a
                href={clinic.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="홈페이지 바로가기"
                className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-primary lg:gap-2 lg:px-6 lg:py-2.5 lg:text-base lg:tracking-[-0.18px]"
              >
                <span className="min-w-0 truncate">홈페이지 바로가기</span>
                <IconArrowRight className="size-2.5 shrink-0 lg:size-[15px]" stroke={2.5} />
              </a>
            </div>

            {/* 오른쪽: 카테고리 메뉴(md 이상) + 검색 + 전체 메뉴 햄버거 */}
            <div className="flex h-full min-w-0 flex-1 items-center justify-end gap-2 md:gap-6 lg:gap-8">
              <nav className="hidden h-full min-w-0 flex-1 items-center justify-end gap-6 md:flex lg:gap-8 xl:gap-[clamp(1rem,5%,5rem)]">
                {nav.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative flex min-w-0 max-w-30 shrink items-center py-1 text-sm font-semibold transition-colors lg:max-w-40 lg:text-base ${item.active ? "text-white" : "text-white/90 hover:text-white"}`}
                  >
                    <span className="block min-w-0 truncate">{item.label}</span>
                    {/* hover 시 가운데서 퍼지는 밑줄 */}
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-full" />
                    {/* 활성 밑줄 */}
                    {item.active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-white" />}
                  </Link>
                ))}
              </nav>
              <div className="flex shrink-0 items-center gap-1 md:gap-2">
                <button
                  type="button"
                  onClick={toggleSearch}
                  aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
                  aria-expanded={searchOpen}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/15"
                >
                  <IconSearch className="size-6 lg:size-7" />
                </button>
                <button
                  type="button"
                  data-sheet-toggle
                  onClick={toggleMenu}
                  aria-label={menuOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
                  aria-expanded={menuOpen}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/15"
                >
                  {menuOpen ? <IconX className="size-7 lg:size-8" /> : <IconMenu2 className="size-7 lg:size-8" />}
                </button>
              </div>
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

      {/* 전체 메뉴 (헤더 아래 전체 화면): 블로그 카테고리 + 홈페이지 사이트맵 + 상담 채널 + 안내 */}
      <FullMenuSheet open={menuOpen} onClose={closeMenu} />
    </>
  );
}

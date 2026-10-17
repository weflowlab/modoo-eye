"use client";
// 헤더 햄버거로 여는 전체 메뉴 시트. 블로그 카테고리 + 홈페이지 사이트맵 + 상담 채널 + 안내 링크를 열 그리드로 보여준다.
import Link from "next/link";
import { useSite } from "@/components/SiteProvider";
import type { SiteData } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Sheet } from "@/components/ui/Sheet";

export type NavItem = { id: string; href: string; label: string; active: boolean };

// 전체 메뉴 열 데이터. 홈페이지(modooeye.kr) 사이트맵(clinic.homepageMenu) + 상담 채널 + 블로그 카테고리 + 법적 안내.
type MenuLink = { id: string; label: string; href: string; external: boolean };
type MenuColumn = { id: string; label: string; items: MenuLink[] };

const ext = (id: string, label: string, href: string): MenuLink => ({ id, label, href, external: true });

// 사이트 데이터(병원 정보 + 카테고리)로 전체 메뉴 열을 만든다
function buildFullMenuColumns({ clinic, categories }: SiteData): MenuColumn[] {
  const menuOf = (label: string) => clinic.homepageMenu.find((m) => m.label === label);
  const homeLinks = (labels: string[]) =>
    labels.flatMap((l) => {
      const m = menuOf(l);
      return m ? [ext(`home-${l}`, m.label, m.href)] : [];
    });

  return [
    { id: "c1", label: "병원소개", items: homeLinks(["병원소개", "의료진소개", "오시는 길"]) },
    { id: "c2", label: "클리닉", items: homeLinks(["망막클리닉", "녹내장클리닉", "외안부클리닉", "성형안과클리닉", "노안/백내장클리닉"]) },
    {
      id: "c3",
      label: "상담·예약",
      items: [
        ...homeLinks(["온라인상담"]),
        ...clinic.sns.map((s) => ext(`sns-${s.label}`, s.label, s.href)),
        { id: "tel", label: `대표전화 ${clinic.phone}`, href: `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`, external: false },
      ],
    },
    {
      id: "c4",
      label: "블로그",
      items: [
        { id: "blog-all", label: "전체 글", href: "/posts", external: false },
        ...categories.map((c) => ({ id: `blog-${c.slug}`, label: c.name, href: `/${c.slug}`, external: false })),
      ],
    },
    { id: "c5", label: "안내", items: clinic.legalLinks.map((l) => ext(`legal-${l.label}`, l.label, l.href)) },
  ];
}

type FullProps = { open: boolean; onClose: () => void };

// 전체 메뉴 시트. 헤더(h-16 / lg:h-20) 바로 아래부터 화면 끝까지. 2/3/5열 그리드, 항목 hover 시 점 + 들여쓰기
export function FullMenuSheet({ open, onClose }: FullProps) {
  const FULL_MENU_COLUMNS = buildFullMenuColumns(useSite());
  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="bottom"
      modal={false}
      title="전체 메뉴"
      className="h-[calc(100dvh-4rem)]! w-screen max-w-none overflow-y-auto border-t border-border p-0 lg:h-[calc(100dvh-5rem)]!"
    >
      <Container size="2xl" className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {FULL_MENU_COLUMNS.map((col) => (
            <div key={col.id}>
              <div className="mb-4 text-lg font-bold text-neutral-800 md:mb-7 md:text-xl lg:text-2xl">{col.label}</div>
              <ul className="space-y-3">
                {col.items.map((item) => {
                  const cls =
                    "group relative text-sm text-neutral-600 transition-all duration-300 hover:pl-3 hover:text-primary md:text-base md:hover:pl-4 lg:text-lg";
                  const dot = (
                    <span className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100 md:h-1.5 md:w-1.5" />
                  );
                  return (
                    <li key={item.id}>
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                          {dot}
                          {item.label}
                        </a>
                      ) : item.href.startsWith("/") ? (
                        <Link href={item.href} onClick={onClose} className={cls}>
                          {dot}
                          {item.label}
                        </Link>
                      ) : (
                        <a href={item.href} className={cls}>
                          {dot}
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Sheet>
  );
}

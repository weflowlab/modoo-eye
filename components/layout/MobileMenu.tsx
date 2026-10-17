"use client";
// 헤더의 메뉴 드로어 2종. MobileMenu = 흰 헤더 햄버거(md 미만) 로 여는 바텀시트 내비.
// FullMenuSheet = 상단 띠의 햄버거로 여는 전체 메뉴(외부 사이트맵 열 그리드).
import Link from "next/link";
import { clinic } from "@/lib/mock";
import { Container } from "@/components/ui/Container";
import { Sheet } from "@/components/ui/Sheet";

export type NavItem = { id: string; href: string; label: string; active: boolean };

type MenuProps = { open: boolean; onClose: () => void; items: NavItem[] };

// 모바일 내비 바텀시트. 레퍼런스: side=bottom max-h-[50dvh], divide-y 목록, 활성 항목 왼쪽 막대
export function MobileMenu({ open, onClose, items }: MenuProps) {
  return (
    <Sheet open={open} onClose={onClose} side="bottom" title="전체 메뉴" className="max-h-[50dvh] w-screen max-w-none overflow-y-auto p-0">
      <Container size="4xl" className="py-4">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`relative block py-4 text-base font-medium transition-colors ${item.active ? "pl-4 text-primary" : "text-foreground hover:text-primary"}`}
              >
                {item.active && <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-primary" />}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Sheet>
  );
}

// 전체 메뉴 열 데이터. 레퍼런스는 CMS 의 externalMenu(병원 홈페이지 사이트맵). mock 에 없어 상수로 대체.
const FULL_MENU_COLUMNS = [
  { id: "c1", label: "병원소개", groups: [{ id: "g1", label: "", items: ["인사말", "의료진", "둘러보기", "오시는 길"] }] },
  { id: "c2", label: "진료안내", groups: [{ id: "g2", label: "", items: ["진료시간", "진료과목", "장비소개", "비급여 안내"] }] },
  { id: "c3", label: "망막질환", groups: [{ id: "g3", label: "", items: ["당뇨망막병증", "황반변성", "망막박리", "망막혈관폐쇄"] }] },
  { id: "c4", label: "백내장", groups: [{ id: "g4", label: "", items: ["백내장 수술", "노안 교정", "다초점 렌즈"] }] },
  { id: "c5", label: "커뮤니티", groups: [{ id: "g5", label: "", items: ["공지사항", "이벤트", "온라인 상담"] }] },
].map((c) => ({
  ...c,
  groups: c.groups.map((g) => ({ ...g, items: g.items.map((label, i) => ({ id: `${g.id}-${i}`, label, href: clinic.homepageUrl })) })),
}));

type FullProps = { open: boolean; onClose: () => void };

// 전체 메뉴 시트. 레퍼런스: modal=false, side=bottom, 높이 calc(100dvh-상단띠), 2/3/5열 그리드, 항목 hover 시 점 + 들여쓰기
export function FullMenuSheet({ open, onClose }: FullProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="bottom"
      modal={false}
      title="전체 메뉴"
      className="h-[calc(100dvh-3rem)]! w-screen max-w-none overflow-y-auto p-0 lg:h-[calc(100dvh-5rem)]!"
    >
      <Container size="2xl" className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {FULL_MENU_COLUMNS.map((col) => (
            <div key={col.id}>
              <div className="mb-4 text-lg font-bold text-neutral-800 md:mb-7 md:text-xl lg:text-2xl">{col.label}</div>
              <div className="space-y-6">
                {col.groups.map((g) => (
                  <div key={g.id}>
                    {g.label && <div className="mb-2 text-base font-bold text-neutral-800 md:mb-3 md:text-lg lg:text-xl">{g.label}</div>}
                    <ul className="space-y-3">
                      {g.items.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative text-sm text-neutral-600 transition-all duration-300 hover:pl-3 hover:text-primary md:text-base md:hover:pl-4 lg:text-lg"
                          >
                            <span className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100 md:h-1.5 md:w-1.5" />
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Sheet>
  );
}

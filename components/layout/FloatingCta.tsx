"use client";
// 화면 우하단 고정 "퀵메뉴" 버튼 + 드로어. 레퍼런스 QuickMenuCTA 를 옮김.
// 드로어는 데스크톱(md+) 오른쪽 사이드, 모바일 바텀시트. app/layout.tsx 의 <SiteFooter /> 뒤에 넣는다.
import { useState, useSyncExternalStore } from "react";
import { IconArrowUp, IconCalendarEvent, IconHome, IconLetterN, IconMessageCircle, IconPhone, IconX } from "@tabler/icons-react";
import { clinic } from "@/lib/mock";
import { Sheet } from "@/components/ui/Sheet";

// md 이상이면 드로어를 오른쪽에서, 미만이면 아래에서 연다 (레퍼런스 matchMedia 768px)
const MQ = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useIsDesktop = () => useSyncExternalStore(subscribe, () => window.matchMedia(MQ).matches, () => false);

// 레퍼런스 물결 링 3개 (scale/opacity 단계)
const RIPPLES = ["scale-[1.13] opacity-30", "scale-[1.27] opacity-15", "scale-[1.4] opacity-10"];

// 액션 버튼. 예약 URL 은 mock 에 없어 "#" 상수. 카톡 상담은 clinic.consultUrl.
const ACTIONS = [
  { key: "phone", label: "대표전화", href: `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`, Icon: IconPhone, color: "bg-[#485667] text-white", external: false },
  { key: "reserve", label: "간편 예약", href: "#", Icon: IconCalendarEvent, color: "bg-[#485667] text-white", external: true },
  { key: "naver", label: "네이버 예약", href: "#", Icon: IconLetterN, color: "bg-[#03c75a] text-white", external: true },
  { key: "kakao", label: "카톡 상담", href: clinic.consultUrl, Icon: IconMessageCircle, color: "bg-[#ffe500] text-[#222222]", external: true },
];

export function FloatingCta() {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const close = () => setOpen(false);

  // 드로어 안 섹션 라벨 공통 클래스
  const labelCls = "w-[68px] shrink-0 text-base font-semibold leading-[1.4] text-brand-primary md:w-[104px] md:text-[26px]";

  return (
    <>
      {/* 고정 버튼. 레퍼런스: right-[22px] bottom-8 md:right-[60px] md:bottom-[60px], size 60/120px */}
      <div className="fixed bottom-8 right-[22px] z-20 flex flex-col items-center gap-3 md:bottom-[60px] md:right-[60px] md:gap-5">
        <div className="relative size-[60px] md:size-[120px]">
          {RIPPLES.map((cls, i) => (
            <span
              key={cls}
              aria-hidden
              style={{ animationDelay: `${-(0.4 * i)}s` }}
              className={`pointer-events-none absolute inset-0 rounded-full bg-linear-to-t from-brand-secondary to-brand-primary animate-cta-ripple motion-reduce:animate-none ${cls}`}
            />
          ))}
          <button
            type="button"
            data-sheet-toggle
            onClick={() => setOpen(true)}
            aria-label="퀵메뉴"
            aria-expanded={open}
            aria-haspopup="dialog"
            className="relative z-1 flex size-full flex-col items-center justify-center rounded-full bg-linear-to-t from-brand-secondary to-brand-primary text-white shadow-[0_6px_24px_0_rgba(134,90,70,0.08)] transition-transform hover:scale-[1.04] active:scale-[0.97]"
          >
            <IconArrowUp className="size-[18px] md:size-9" stroke={2} />
            <span className="text-sm font-semibold leading-[1.6] tracking-tight md:text-2xl">퀵메뉴</span>
          </button>
        </div>
      </div>

      {/* 드로어. 레퍼런스: 데스크톱 w-[680px] px-10 py-8 / 모바일 px-4 pt-6 pb-[68px] */}
      <Sheet
        open={open}
        onClose={close}
        side={isDesktop ? "right" : "bottom"}
        title="퀵메뉴"
        className={`max-h-[100svh] overflow-y-auto bg-background ${isDesktop ? "w-[680px] max-w-full px-10 py-8" : "px-4 pb-[68px] pt-6"}`}
      >
        <div className="flex w-full flex-1 flex-col gap-8 md:my-auto md:gap-[60px]">
          {/* 닫기 */}
          <div className="flex items-center justify-end">
            <button type="button" onClick={close} aria-label="닫기" className="text-neutral-600 transition-colors hover:text-neutral-900">
              <IconX className="size-7 md:size-[30px]" stroke={1.5} />
            </button>
          </div>

          {/* 병원 정보: 오시는 길 / 진료시간 / 대표전화 (구분선으로 분리) */}
          <div className="flex flex-col gap-5 md:gap-10">
            <div className="flex gap-8 md:gap-10">
              <span className={labelCls}>오시는 길</span>
              <p className="whitespace-pre-line text-sm leading-[1.4] text-neutral-800 md:text-[22px]">{clinic.address}</p>
            </div>
            <div className="h-px w-full bg-neutral-300" />
            <div className="flex gap-8 md:gap-10">
              <span className={labelCls}>진료시간</span>
              <ul className="flex flex-col gap-1.5 text-sm leading-[1.4] text-neutral-800 md:gap-2 md:text-[22px]">
                {clinic.hours.map((h) => (
                  <li key={h.label} className="flex gap-6 md:gap-[60px]">
                    <span className="w-[104px] shrink-0 font-semibold md:w-[144px]">{h.label}</span>
                    <span>{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-px w-full bg-neutral-300" />
            <div className="flex items-center gap-8 md:gap-10">
              <span className={labelCls}>대표전화</span>
              <p className="text-lg leading-[1.4] text-neutral-800 md:text-[22px]">{clinic.phone}</p>
            </div>
          </div>

          {/* 액션 버튼 4개 + 홈페이지 바로가기 */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {ACTIONS.map(({ key, label, href, Icon, color, external }) => (
                <a
                  key={key}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={close}
                  className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 pb-3 pt-3.5 text-sm font-bold leading-[1.6] whitespace-nowrap shadow-[0_4px_16px_0_rgba(134,90,70,0.08)] transition-opacity hover:opacity-90 md:h-[66px] md:flex-row md:rounded-[12px] md:px-6 md:py-0 md:text-[17px] ${color}`}
                >
                  <Icon className="size-6 shrink-0" stroke={1.8} />
                  {label}
                </a>
              ))}
            </div>
            <a
              href={clinic.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex w-full items-center justify-center gap-1 rounded-lg bg-linear-to-t from-brand-secondary to-brand-primary py-4 text-lg font-bold leading-[1.6] whitespace-nowrap text-white shadow-[0_4px_16px_0_rgba(134,90,70,0.08)] transition-opacity hover:opacity-90 md:h-[72px] md:gap-2 md:rounded-[12px] md:py-0 md:text-2xl"
            >
              <IconHome className="size-6 shrink-0 md:size-8" stroke={1.8} />
              홈페이지 바로가기
            </a>
          </div>
        </div>
      </Sheet>
    </>
  );
}

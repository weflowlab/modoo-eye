"use client";
// 화면 고정 빠른 연결 버튼.
// - 데스크톱(md+): 오른쪽 아래 세로 원형 버튼 3개 (대표전화 / 네이버 톡톡 / 맨 위로). 올리면 왼쪽으로 라벨이 펼쳐진다.
// - 모바일: 화면 맨 아래 고정 바 2칸 (바로 전화 / 네이버 톡톡) + 오른쪽 아래 작은 맨 위로 버튼.
// 드로어는 두지 않는다 (위치·진료시간은 푸터에 있음).
import { useEffect, useState } from "react";
import { IconArrowUp, IconMessageCircle, IconPhone } from "@tabler/icons-react";
import { useSite } from "@/components/SiteProvider";

export function FloatingCta() {
  const { clinic } = useSite();
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;
  const [showTop, setShowTop] = useState(false);

  // 조금 스크롤한 뒤에만 "맨 위로" 표시
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // 데스크톱 원형 버튼 공통: 라벨은 평소 숨김, hover/focus 시 왼쪽으로 펼쳐짐
  const desktopBtn = "group flex items-center gap-3 outline-none";
  const label =
    "pointer-events-none max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-neutral-900/90 px-0 py-1.5 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:px-3.5 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:px-3.5 group-focus-visible:opacity-100";
  const circle = "flex size-13 items-center justify-center rounded-full shadow-[0_6px_20px_0_rgba(0,0,0,0.15)] transition-transform group-hover:scale-105 group-active:scale-95";

  return (
    <>
      {/* ── 데스크톱: 세로 원형 버튼 (맨 위로 → 전화 → 톡톡) ── */}
      <div className="fixed bottom-8 right-8 z-20 hidden flex-col items-end gap-3 md:flex">
        <button
          type="button"
          onClick={scrollTop}
          className={`${desktopBtn} transition-opacity duration-300 ${showTop ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-label="맨 위로"
          tabIndex={showTop ? 0 : -1}
        >
          <span className={label}>맨 위로</span>
          <span className={`${circle} border border-neutral-200 bg-white text-neutral-700`}>
            <IconArrowUp className="size-6" />
          </span>
        </button>
        <a href={tel} className={desktopBtn} aria-label={`대표전화 ${clinic.phone}`}>
          <span className={label}>{clinic.phone}</span>
          <span className={`${circle} bg-primary text-white`}>
            {/* 아이콘 흔들림: 전화 먼저, 톡톡은 1초 뒤 */}
            <IconPhone className="size-6 animate-wiggle motion-reduce:animate-none" />
          </span>
        </a>
        <a href={clinic.consultUrl} target="_blank" rel="noopener noreferrer" className={desktopBtn} aria-label="네이버 톡톡 상담">
          <span className={label}>네이버 톡톡 상담</span>
          <span className={`${circle} bg-[#03c75a] text-white`}>
            <IconMessageCircle className="size-6 -translate-y-px animate-wiggle motion-reduce:animate-none" style={{ animationDelay: "1s" }} />
          </span>
        </a>
      </div>

      {/* ── 모바일: 하단 고정 바 (바로 전화 / 네이버 톡톡) ── */}
      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 bg-primary pb-[env(safe-area-inset-bottom)] md:hidden">
        <a href={tel} className="flex h-14 items-center justify-center gap-2 bg-primary text-base font-bold text-white active:bg-brand-secondary">
          <IconPhone className="size-5 animate-wiggle motion-reduce:animate-none" />
          바로 전화
        </a>
        <a
          href={clinic.consultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 bg-[#03c75a] text-base font-bold text-white active:bg-[#02b04f]"
        >
          <IconMessageCircle className="size-5 -translate-y-px animate-wiggle motion-reduce:animate-none" style={{ animationDelay: "1s" }} />
          네이버 톡톡
        </a>
      </div>
      {/* 모바일: 맨 위로 (하단 바 위에 작게) */}
      <button
        type="button"
        onClick={scrollTop}
        aria-label="맨 위로"
        tabIndex={showTop ? 0 : -1}
        className={`fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+12px)] right-4 z-20 flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-md transition-opacity duration-300 md:hidden ${showTop ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <IconArrowUp className="size-5" />
      </button>
    </>
  );
}

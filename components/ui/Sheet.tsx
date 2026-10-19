"use client";
// 드로어/바텀시트 프리미티브. 레퍼런스의 shadcn Sheet(radix Dialog) 를 radix 없이 구현.
// 모바일 메뉴, 전체 메뉴, 퀵메뉴 드로어에서 공용. ESC/바깥 클릭 닫기, 열림/닫힘 전환, body 스크롤 잠금 포함.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  side?: "bottom" | "right";
  modal?: boolean; // false 면 오버레이/스크롤 잠금 없이 바깥 클릭만 감지 (레퍼런스 전체 메뉴)
  title: string; // 스크린리더용 제목
  className?: string;
  children: ReactNode;
};

const DURATION = 300; // 패널 transition duration-300 과 맞춘다 (닫힘 전환이 끝난 뒤 언마운트)

export function Sheet({ open, onClose, side = "bottom", modal = true, title, className = "", children }: Props) {
  const [mounted, setMounted] = useState(open); // DOM 에 붙어 있는지 (닫힘 애니메이션 동안 유지)
  const [visible, setVisible] = useState(false); // 전환 상태 (translate/opacity)
  const [prevOpen, setPrevOpen] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(0); // 열린 시각. 여는 탭의 꼬리 이벤트가 곧바로 "바깥 클릭"으로 잡혀 닫히는 것을 막는다

  // open 변화를 렌더 중에 반영: 열리면 즉시 마운트, 닫히면 즉시 숨김 상태로 (전환 시작)
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setMounted(true);
    else setVisible(false);
  }

  // 열림: 마운트된 다음 프레임에 visible → 슬라이드 인. 닫힘: 전환이 끝난 뒤 언마운트.
  // (예전엔 rAF 를 두 겹으로 걸고 바깥 것만 취소해서, 빠르게 열고 닫으면 안쪽 rAF 가 살아남아 상태가 꼬일 수 있었다)
  useEffect(() => {
    if (open) {
      openedAt.current = Date.now();
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true));
      });
      // rAF 가 지연되는 환경(백그라운드 탭·저전력 모드)에서도 열리도록 타이머로 한 번 더 보장
      const fallback = window.setTimeout(() => setVisible(true), 100);
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
        window.clearTimeout(fallback);
      };
    }
    const t = window.setTimeout(() => setMounted(false), DURATION);
    return () => window.clearTimeout(t);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 바깥 클릭 닫기 (토글 버튼은 data-sheet-toggle 로 제외)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (Date.now() - openedAt.current < 150) return; // 여는 탭 자체는 무시
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target) || target.closest("[data-sheet-toggle]")) return;
      onClose();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, onClose]);

  // modal 일 때 body 스크롤 잠금
  useEffect(() => {
    if (!open || !modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, modal]);

  if (!mounted || typeof document === "undefined") return null;

  // 레퍼런스: data-[side=bottom] inset-x-0 bottom-0 / data-[side=right] inset-y-0 right-0 h-full (너비·테두리는 호출부에서 지정)
  const sideCls =
    side === "bottom"
      ? `inset-x-0 bottom-0 h-auto ${visible ? "translate-y-0" : "translate-y-10"}`
      : `inset-y-0 right-0 h-full ${visible ? "translate-x-0" : "translate-x-full"}`;

  return createPortal(
    <>
      {/* 레퍼런스 sheet-overlay: fixed inset-0 z-50 bg-black/10 + fade */}
      {modal && (
        <div
          aria-hidden
          className={`fixed inset-0 z-50 bg-black/10 backdrop-blur-xs transition-opacity duration-100 ${visible ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={modal}
        aria-label={title}
        data-side={side}
        className={`fixed z-50 flex flex-col gap-4 bg-background text-sm text-foreground shadow-lg transition duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"} ${sideCls} ${className}`}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

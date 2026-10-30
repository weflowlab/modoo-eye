"use client";
// 드로어/바텀시트 프리미티브. 레퍼런스의 shadcn Sheet(radix Dialog) 를 radix 없이 구현.
// 패널은 클라이언트에서 항상 DOM 에 두고(portal), 열림/닫힘은 CSS 전환(translate·opacity·visibility)으로만 바꾼다.
// (예전엔 열릴 때 렌더 중 setState 로 마운트했는데, 터치 환경에서 그 값이 직후 재렌더에 유실돼 패널이 바로 사라지는 문제가 있었다)
// ESC/바깥 클릭 닫기, body 스크롤 잠금 포함.
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  side?: "bottom" | "right";
  modal?: boolean; // false 면 오버레이/스크롤 잠금 없이 바깥 클릭만 감지
  title: string; // 스크린리더용 제목
  className?: string;
  children: ReactNode;
};

// 클라이언트 마운트 여부 (portal 은 document 가 있어야 함). 서버 스냅샷은 false
const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

export function Sheet({ open, onClose, side = "bottom", modal = true, title, className = "", children }: Props) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(0); // 열린 시각. 여는 탭의 꼬리 이벤트가 곧바로 "바깥 클릭"으로 잡혀 닫히는 것을 막는다

  // 열린 시각 기록
  useEffect(() => {
    if (open) openedAt.current = Date.now();
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

  if (!isClient) return null;

  // 닫힘: 화면 밖으로 밀어내고 투명 + visibility hidden(전환이 끝난 뒤 적용) + 클릭 통과
  const sideCls =
    side === "bottom"
      ? `inset-x-0 bottom-0 h-auto ${open ? "translate-y-0" : "translate-y-full"}`
      : `inset-y-0 right-0 h-full ${open ? "translate-x-0" : "translate-x-full"}`;

  return createPortal(
    <>
      {/* 오버레이: fixed inset-0 z-50 bg-black/10 + fade */}
      {modal && (
        <div
          aria-hidden
          className={`fixed inset-0 z-50 bg-black/10 backdrop-blur-xs transition-all duration-200 ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={modal}
        aria-label={title}
        aria-hidden={!open}
        data-side={side}
        data-state={open ? "open" : "closed"}
        className={`fixed z-50 flex flex-col gap-4 bg-background text-sm text-foreground shadow-lg transition-all duration-300 ease-out ${
          open ? "visible opacity-100" : "invisible opacity-0"
        } ${sideCls} ${className}`}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

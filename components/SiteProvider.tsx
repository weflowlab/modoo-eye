"use client";
// 클라이언트 컴포넌트에 병원 정보/카테고리/인기 키워드를 전달하는 컨텍스트.
// 루트 레이아웃(서버)이 Payload 에서 읽어 넘기고, 헤더·푸터·퀵메뉴 등은 useSite() 로 꺼내 쓴다.
import { createContext, useContext, type ReactNode } from "react";
import type { SiteData } from "@/lib/types";

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({ value, children }: { value: SiteData; children: ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteData {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite 는 SiteProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}

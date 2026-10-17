"use client";
// 클라이언트에 마운트됐는지 알려주는 훅. 서버 프리렌더 중엔 false.
// swiper 자동재생처럼 렌더 중 현재 시각을 읽는 라이브러리는 Next 프리렌더가 막으므로,
// 그런 컴포넌트는 mounted 가 true 일 때만 그린다.
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // 클라이언트
    () => false, // 서버
  );
}

"use client";
// 글 조회수 집계. 페이지가 열리면 한 번 서버에 알린다 (같은 브라우저 세션에서는 글당 1회).
// 인기 글 순위(views)에 쓰인다. 관리자 미리보기 중에는 호출하지 않는다.
import { useEffect } from "react";

export function ViewCounter({ postId, disabled = false }: { postId: number; disabled?: boolean }) {
  useEffect(() => {
    if (disabled) return;
    const key = `viewed:${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // 시크릿 모드 등 저장 불가 시에도 집계는 진행
    }
    fetch("/next/views", { method: "POST", body: JSON.stringify({ id: postId }), keepalive: true }).catch(() => {});
  }, [postId, disabled]);
  return null;
}

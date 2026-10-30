"use client";
// Payload 관리자 상단 왼쪽 로고 (admin.components.graphics.Icon).
// 대부분 화면에서는 Payload 가 이 로고를 /admin 링크로 감싸지만, 대시보드류 화면(유입 관리 포함)에서는 링크 없이 그린다.
// 그래서 링크 안에 있지 않을 때만 클릭으로 /admin 에 간다 (링크 안에서 또 이동시키면 중복).
import { useRouter } from "next/navigation";

export const Icon = () => {
  const router = useRouter();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.webp"
      alt="모두의안과 관리자 홈"
      width={150}
      height={46}
      className="modoo-logo modoo-logo--nav"
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        if (!e.currentTarget.closest("a")) router.push("/admin");
      }}
    />
  );
};

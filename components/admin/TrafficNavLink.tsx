"use client";
// 관리자 왼쪽 메뉴에 "유입 관리" 링크를 추가한다 (payload.config admin.components.afterNavLinks).
// Payload 메뉴 묶음(콘텐츠·설정) 아래에 같은 모양으로 붙는다.
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TrafficNavLink() {
  const pathname = usePathname();
  const href = "/admin/traffic";
  const active = pathname === href;
  return (
    <div className="nav-group" style={{ marginTop: 10 }}>
      <div className="nav-group__label" style={{ color: "var(--theme-elevation-400)", marginBottom: 5 }}>
        통계
      </div>
      <div className="nav-group__content">
        <Link href={href} className={`nav__link${active ? " active" : ""}`} prefetch={false}>
          {active && <span className="nav__link-indicator" />}
          <span className="nav__link-label">유입 관리</span>
        </Link>
      </div>
    </div>
  );
}

// Next 프록시(구 미들웨어). 관리자(/admin) 첫 방문 때 테마 쿠키가 없으면 "light" 로 심어 준다.
// Payload 기본 동작은 쿠키가 없으면 기기의 다크 모드를 따라가는데, 병원 직원 기기 설정과 무관하게 흰 화면으로 시작하게 하되
// 계정 페이지의 테마 선택(라이트/다크/자동)은 그대로 쓸 수 있게 한다 (선택하면 같은 쿠키를 덮어쓴다).
import { NextResponse, type NextRequest } from "next/server";

const THEME_COOKIE = "payload-theme"; // Payload cookiePrefix 기본값 "payload" + "-theme"

export function proxy(request: NextRequest) {
  if (request.cookies.has(THEME_COOKIE)) return NextResponse.next();

  // 이번 요청의 서버 렌더에도 light 가 반영되도록 요청 쿠키에 먼저 넣고, 응답에도 심는다
  request.cookies.set(THEME_COOKIE, "light");
  const response = NextResponse.next({ request });
  response.cookies.set(THEME_COOKIE, "light", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

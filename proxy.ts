// Next 프록시(구 미들웨어). 두 가지 일을 한다.
// 1) 주소 통일: 정식 주소(NEXT_PUBLIC_SERVER_URL, 예: https://modooeyeblog.kr)가 아닌 운영 주소로 들어오면 정식 주소로 301.
//    - modoo-eye.vercel.app (Vercel 기본 주소) → 정식 주소. 검색엔진이 같은 글을 두 주소로 따로 색인하지 않게 한다.
//    - www.정식주소 → 정식 주소 (www 없는 쪽으로 통일)
//    미리보기 배포(modoo-eye-git-xxx.vercel.app)와 로컬은 건드리지 않는다.
// 2) 관리자(/admin) 첫 방문 때 테마 쿠키가 없으면 "light" 로 심어 준다.
//    Payload 기본 동작은 쿠키가 없으면 기기의 다크 모드를 따라가는데, 병원 직원 기기 설정과 무관하게 흰 화면으로 시작하게 하되
//    계정 페이지의 테마 선택(라이트/다크/자동)은 그대로 쓸 수 있게 한다 (선택하면 같은 쿠키를 덮어쓴다).
import { NextResponse, type NextRequest } from "next/server";

const THEME_COOKIE = "payload-theme"; // Payload cookiePrefix 기본값 "payload" + "-theme"
const VERCEL_DEFAULT_HOST = "modoo-eye.vercel.app"; // 프로젝트의 Vercel 기본 주소 (운영 배포)

function canonicalHost(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SERVER_URL || "").hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function proxy(request: NextRequest) {
  // 1) 주소 통일 (정식 주소가 실제 도메인일 때만. localhost 면 건너뜀)
  const canonical = canonicalHost();
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  if (canonical && !canonical.includes("localhost") && host && host !== canonical) {
    const isDefault = host === VERCEL_DEFAULT_HOST;
    const isWww = host === `www.${canonical}`;
    if (isDefault || isWww) {
      const url = request.nextUrl.clone();
      url.protocol = "https:";
      url.host = canonical;
      url.port = "";
      return NextResponse.redirect(url, 301);
    }
  }

  // 2) 관리자 테마 쿠키
  if (!request.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  if (request.cookies.has(THEME_COOKIE)) return NextResponse.next();

  // 이번 요청의 서버 렌더에도 light 가 반영되도록 요청 쿠키에 먼저 넣고, 응답에도 심는다
  request.cookies.set(THEME_COOKIE, "light");
  const response = NextResponse.next({ request });
  response.cookies.set(THEME_COOKIE, "light", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return response;
}

export const config = {
  // _next 정적 자원만 빼고 전부 (주소 통일은 sitemap.xml·robots.txt·rss.xml 도 포함해야 한다)
  matcher: ["/((?!_next/).*)"],
};

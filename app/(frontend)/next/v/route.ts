// 방문 기록 수집 (components/PageTracker 가 호출). 인증 없는 공개 POST. 봇과 관리자 로그인 브라우저는 세지 않는다.
// body.type 으로 세 가지를 받는다:
//   (없음)      새 페이지 보기 → { id } 반환 (나갈 때 체류시간 갱신에 씀)
//   "duration"  체류시간·스크롤 갱신
//   "click"     상담 버튼 클릭 (전화·톡톡·카카오·홈페이지)
import { getPayload } from "payload";
import config from "@payload-config";
import { detectAppSource, detectDevice, isBot, normalizeSource } from "@/lib/tracking";

const clamp = (n: unknown, max: number) => Math.max(0, Math.min(Number(n) || 0, max));
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(req: Request): Promise<Response> {
  const ua = req.headers.get("user-agent") || "";
  if (isBot(ua)) return Response.json({ ok: true, skipped: "bot" });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const payload = await getPayload({ config });

  // 체류시간·스크롤 갱신 (페이지를 나갈 때 sendBeacon 으로 옴)
  if (body.type === "duration") {
    const id = Number(body.id);
    if (!id) return new Response(null, { status: 400 });
    try {
      await payload.update({
        collection: "page-views",
        id,
        data: { durationMs: clamp(body.durationMs, 60 * 60 * 1000), maxScroll: clamp(body.maxScroll, 100) },
      });
    } catch {
      /* 이미 지워졌거나 없는 기록이면 무시 */
    }
    return new Response(null, { status: 204 });
  }

  const sessionId = str(body.sessionId, 80);
  const path = str(body.path, 300);
  if (!sessionId || !path) return new Response(null, { status: 400 });
  if (path.startsWith("/next/") || path.startsWith("/admin")) return new Response(null, { status: 204 }); // 내부 경로는 세지 않는다

  // 관리자로 로그인된 브라우저(원장님·직원)의 방문은 세지 않는다. 미리보기를 껐다 켰다 할 필요 없이 자동으로 빠진다.
  // 로그인 쿠키가 있을 때만 확인하므로 일반 방문자는 추가 비용이 없다. 방문자 입장에서 확인하려면 시크릿 창을 쓰면 된다.
  if ((req.headers.get("cookie") || "").includes("payload-token=")) {
    try {
      const { user } = await payload.auth({ headers: req.headers });
      if (user) return Response.json({ ok: true, skipped: "admin" });
    } catch {
      /* 만료된 토큰 등은 일반 방문자로 본다 */
    }
  }
  const device = detectDevice(ua);

  // 상담 버튼 클릭
  if (body.type === "click") {
    const label = str(body.label, 40);
    if (!label) return new Response(null, { status: 400 });
    await payload.create({ collection: "page-views", data: { sessionId, path, event: "click", label, device } });
    return new Response(null, { status: 204 });
  }

  // 새 페이지 보기
  const referrer = str(body.referrer, 500);
  const utmSource = str(body.utmSource, 60).toLowerCase();
  const source = utmSource || detectAppSource(ua) || normalizeSource(referrer, req.headers.get("host") || "");
  const doc = await payload.create({
    collection: "page-views",
    data: {
      sessionId,
      path,
      referrer,
      source,
      medium: str(body.utmMedium, 40),
      keyword: str(body.keyword, 120),
      query: str(body.query, 120), // 블로그 안 검색어
      device,
      event: "view",
    },
  });
  return Response.json({ id: doc.id });
}

// 방문 기록 수집 (components/PageTracker 가 호출). 인증 없는 공개 POST.
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

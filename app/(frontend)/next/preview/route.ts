// 관리자 미리보기 진입점. Payload 미리보기 창(iframe)이 이 주소를 열면
// 비밀키와 관리자 로그인을 확인한 뒤 draft 모드를 켜고 실제 페이지로 보낸다.
// draft 모드에서는 발행 전 초안 내용이 그대로 보인다.
import type { PayloadRequest } from "payload";
import { getPayload } from "payload";
import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const previewSecret = searchParams.get("previewSecret");

  if (!process.env.PREVIEW_SECRET || previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response("미리보기 비밀키가 올바르지 않습니다.", { status: 403 });
  }
  if (!path || !path.startsWith("/")) {
    return new Response("잘못된 경로입니다.", { status: 400 });
  }

  // 관리자로 로그인된 사용자만 초안을 볼 수 있다
  const payload = await getPayload({ config });
  let user = null;
  try {
    ({ user } = await payload.auth({ req: req as unknown as PayloadRequest, headers: req.headers }));
  } catch {
    user = null;
  }
  if (!user) return new Response("관리자 로그인이 필요합니다.", { status: 401 });

  (await draftMode()).enable();
  redirect(path);
}

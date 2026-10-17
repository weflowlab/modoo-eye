// 개발 전용: payload-types.ts 와 admin/importMap.js 를 생성한다.
// `payload generate:types` CLI 가 이 환경(Node 22 + tsx + undici)에서 깨져서, Next 런타임 안에서 같은 함수를 호출한다.
// 사용: 개발 서버 실행 중 `npm run payload:generate` (GET /api/dev-generate)
import config from "@payload-config";
import { generateImportMap } from "payload";
import { generateTypes } from "payload/node";

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const sanitized = await config;
  await generateTypes(sanitized, { log: true });
  await generateImportMap(sanitized, { log: true });
  return new Response("payload-types.ts, importMap.js 생성 완료");
}

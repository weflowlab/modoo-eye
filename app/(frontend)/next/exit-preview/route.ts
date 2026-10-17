// 미리보기(draft 모드) 종료
import { draftMode } from "next/headers";

export async function GET(): Promise<Response> {
  (await draftMode()).disable();
  return new Response("미리보기를 종료했습니다.");
}

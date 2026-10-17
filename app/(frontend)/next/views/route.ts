// 글 조회수 +1 (components/post/ViewCounter 가 호출)
import { incrementViews } from "@/lib/payload";

export async function POST(req: Request): Promise<Response> {
  let id: unknown;
  try {
    ({ id } = await req.json());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof id !== "number") return new Response(null, { status: 400 });
  try {
    await incrementViews(id);
  } catch {
    return new Response(null, { status: 404 });
  }
  return new Response(null, { status: 204 });
}

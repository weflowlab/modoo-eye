// Payload 저장 훅에서 Next 페이지 캐시를 갱신한다.
// next/cache 를 최상위에서 import 하면 Payload CLI(generate:types 등)가 Next 런타임까지 로드해 깨지므로 지연 import.
export async function revalidate(paths: string[], layout = false) {
  const { revalidatePath } = await import("next/cache");
  for (const p of paths) {
    if (layout) revalidatePath(p, "layout");
    else revalidatePath(p);
  }
}

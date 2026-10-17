// 제목 → URL 슬러그. 한글은 그대로 두고(레퍼런스와 동일), 공백·특수문자는 하이픈으로.
export function formatSlug(input?: string | null): string | undefined {
  if (!input) return undefined;
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // 글자/숫자 외 → 하이픈
    .replace(/^-+|-+$/g, "") // 양끝 하이픈 제거
    .replace(/-{2,}/g, "-");
}

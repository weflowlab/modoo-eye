// Payload 는 serverURL 이 설정되면 업로드 URL 을 절대 주소(http://localhost:3000/api/media/...)로 돌려준다.
// next/image 는 설정에 없는 호스트의 절대 주소를 거부하므로, 같은 사이트의 주소는 경로(/api/media/...)로 바꾼다.
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

export function mediaUrl(url: string): string {
  if (SERVER_URL && url.startsWith(SERVER_URL)) return url.slice(SERVER_URL.length) || "/";
  // 포트/호스트가 달라도 Payload 업로드 경로면 경로만 남긴다
  const m = url.match(/^https?:\/\/[^/]+(\/api\/media\/.*)$/);
  return m ? m[1] : url;
}

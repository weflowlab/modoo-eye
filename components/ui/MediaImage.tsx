// Payload 미디어(ImageRef)를 next/image 로 렌더하는 공통 래퍼. 부모가 relative + 비율(aspect-*) 박스여야 한다(fill).
// Payload 는 serverURL 이 설정돼 있으면 절대 URL(http://localhost:3000/api/media/...)을 돌려주는데,
// next/image 는 절대 URL 에 remotePatterns 가 필요하므로 같은 출처면 경로(/api/media/...)로 바꿔 넘긴다.
import Image from "next/image";
import type { ImageRef } from "@/lib/types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

// 같은 출처의 절대 URL → 경로. 외부 URL 은 그대로 (unoptimized 로 렌더)
function toSrc(url: string): { src: string; external: boolean } {
  if (!/^https?:\/\//.test(url)) return { src: url, external: false };
  try {
    const u = new URL(url);
    if (u.origin === new URL(SERVER_URL).origin) return { src: `${u.pathname}${u.search}`, external: false };
  } catch {
    /* 잘못된 URL 은 그대로 */
  }
  return { src: url, external: true };
}

type Props = {
  image: ImageRef;
  sizes: string; // 뷰포트별 렌더 폭 (예: "(min-width: 768px) 320px, 50vw")
  className?: string; // object-fit/hover 효과 등
  priority?: boolean;
};

export function MediaImage({ image, sizes, className = "", priority }: Props) {
  const { src, external } = toSrc(image.url);
  return (
    <Image
      src={src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={external}
      className={`object-cover ${className}`}
    />
  );
}

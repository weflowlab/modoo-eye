// 이미지 업로드 컬렉션. 글 썸네일, 본문 이미지, 의료진 사진, 배너에 사용.
// 저장소: BLOB_READ_WRITE_TOKEN 이 있으면 Vercel Blob (payload.config.ts 의 플러그인이 staticDir 대신 처리), 없으면 public/media.
import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "이미지", plural: "이미지" },
  access: { read: () => true },
  admin: { group: "콘텐츠" },
  upload: {
    // Blob 을 쓸 때는 로컬 폴더를 비워 둔다. public/media 를 그대로 두면 같은 이름의 스톡 파일 때문에 업로드 파일명에 "-1" 이 붙는다.
    staticDir: process.env.BLOB_READ_WRITE_TOKEN ? path.resolve(dirname, "../.payload-media-tmp") : path.resolve(dirname, "../public/media"),
    mimeTypes: ["image/*"],
    // 업로드 시점에 가볍게 저장: 원본은 가로 1600px 이하로 줄이고 WebP(품질 82)로 변환.
    // next/image 최적화(/_next/image)를 꺼 두었으므로(next.config) 여기서 만든 파일이 그대로 나간다.
    resizeOptions: { width: 1600, withoutEnlargement: true },
    formatOptions: { format: "webp", options: { quality: 82 } },
    // 용도별 리사이즈 (썸네일 카드 / 본문 / OG). 전부 WebP
    imageSizes: [
      { name: "thumbnail", width: 480, height: 480, position: "centre", formatOptions: { format: "webp", options: { quality: 82 } } },
      { name: "card", width: 800, height: 800, position: "centre", formatOptions: { format: "webp", options: { quality: 82 } } },
      { name: "content", width: 1200, height: undefined, formatOptions: { format: "webp", options: { quality: 82 } } },
      { name: "og", width: 1200, height: 630, position: "centre", formatOptions: { format: "webp", options: { quality: 82 } } },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
  },
  fields: [
    { name: "alt", label: "대체 텍스트 (이미지 설명)", type: "text", required: true },
    { name: "caption", label: "캡션", type: "text" },
  ],
};

// 이미지 업로드 컬렉션. 글 썸네일, 본문 이미지, 의료진 사진, 배너에 사용.
// 파일은 public/media 에 저장되고 /media/파일명 으로 서빙된다.
// 운영(Vercel) 배포 시에는 로컬 디스크가 유지되지 않으므로 S3/Vercel Blob 스토리지 어댑터로 교체 필요.
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
    staticDir: path.resolve(dirname, "../public/media"),
    mimeTypes: ["image/*"],
    // 용도별 리사이즈 (썸네일 카드 / 본문 / OG)
    imageSizes: [
      { name: "thumbnail", width: 480, height: 480, position: "centre" },
      { name: "card", width: 800, height: 800, position: "centre" },
      { name: "content", width: 1200, height: undefined },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
  },
  fields: [
    { name: "alt", label: "대체 텍스트 (이미지 설명)", type: "text", required: true },
    { name: "caption", label: "캡션", type: "text" },
  ],
};

import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  // Payload 관리자/미리보기(draftMode)와의 호환을 위해 Cache Components 는 끔.
  // 글/의료진 페이지는 generateStaticParams 로 정적 생성되고, Payload 저장 훅의 revalidatePath 로 갱신된다.
  cacheComponents: false,
  // 이미지 최적화(/_next/image) 끔: Vercel 이미지 변환 횟수(월 5,000회 한도, 초과 시 유료)를 쓰지 않기 위해.
  // 대신 Payload 가 업로드 시점에 WebP(품질 82, 가로 1600 이하)와 용도별 크기를 미리 만들어 둔다(collections/Media.ts).
  // 끄면 원본 파일이 그대로 나가므로, 큰 이미지를 그대로 올리지 않도록 원본 자체를 가볍게 유지해야 한다.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withPayload(nextConfig);

import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  // Payload 관리자/미리보기(draftMode)와의 호환을 위해 Cache Components 는 끔.
  // 글/의료진 페이지는 generateStaticParams 로 정적 생성되고, Payload 저장 훅의 revalidatePath 로 갱신된다.
  cacheComponents: false,
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

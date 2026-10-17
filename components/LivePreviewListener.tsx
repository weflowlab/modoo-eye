"use client";
// 관리자 미리보기 창 안에서만 렌더. Payload 에서 저장(자동저장 포함)할 때마다 페이지를 새로고침해
// 작성 중인 내용이 바로 반영되게 한다.
import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

export function LivePreviewListener() {
  const router = useRouter();
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || ""}
    />
  );
}

"use client";
// 유입 관리 화면의 상단 빵부스러기: 로고 / 유입 관리 (Payload 가 기본으로 "대시보드"를 보여 주는 것을 바꾼다)
import { SetStepNav } from "@payloadcms/ui";

export function TrafficStepNav() {
  return <SetStepNav nav={[{ label: "유입 관리", url: "/admin/traffic" }]} />;
}

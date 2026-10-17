// 병원 정보 글로벌. 푸터, 퀵메뉴, 면책 문구, CTA, 구조화 데이터(JSON-LD) 에 쓰인다. 사이트에 하나만 존재.
// 필드 구성은 lib/types.ts 의 ClinicInfo 와 1:1 로 맞춘다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";

// {label, href} 링크 배열 필드
const links = (name: string, label: string) => ({
  name,
  label,
  type: "array" as const,
  labels: { singular: "링크", plural: "링크" },
  fields: [
    { name: "label", label: "이름", type: "text" as const, required: true },
    { name: "href", label: "주소", type: "text" as const, required: true },
  ],
});

// 문자열 배열 필드
const values = (name: string, label: string, itemLabel = "내용") => ({
  name,
  label,
  type: "array" as const,
  labels: { singular: "항목", plural: "항목" },
  fields: [{ name: "value", label: itemLabel, type: "text" as const, required: true }],
});

export const Clinic: GlobalConfig = {
  slug: "clinic",
  label: "병원 정보",
  access: { read: () => true },
  admin: { group: "설정" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "기본 정보",
          fields: [
            { name: "name", label: "병원명", type: "text", required: true },
            { name: "nameEn", label: "영문 병원명", type: "text" },
            { name: "homepageUrl", label: "홈페이지 주소", type: "text", required: true },
            { name: "address", label: "주소", type: "text", required: true },
            { name: "phone", label: "대표전화", type: "text", required: true },
            { name: "fax", label: "팩스", type: "text" },
            { name: "businessNumber", label: "사업자등록번호", type: "text" },
            values("representatives", "대표자", "이름"),
            {
              name: "stats",
              label: "수술 실적 (메인 페이지 표시)",
              type: "array",
              labels: { singular: "실적", plural: "실적" },
              fields: [
                { name: "label", label: "항목 (예: 망막수술)", type: "text", required: true },
                { name: "value", label: "수치 (예: 7,000례 이상)", type: "text", required: true },
              ],
            },
            { name: "statsNote", label: "실적 기준 시점 (예: 2024년 12월 기준)", type: "text" },
          ],
        },
        {
          label: "진료시간·오시는 길",
          fields: [
            {
              name: "hours",
              label: "진료시간",
              type: "array",
              labels: { singular: "행", plural: "행" },
              fields: [
                { name: "label", label: "구분 (예: 평일)", type: "text", required: true },
                { name: "value", label: "시간", type: "text", required: true },
              ],
            },
            { name: "directions", label: "대중교통 안내", type: "textarea" },
            values("parking", "주차 안내"),
            links("mapLinks", "지도 링크"),
          ],
        },
        {
          label: "채널·링크",
          fields: [
            { name: "consultUrl", label: "상담·예약 버튼 연결 주소 (네이버 톡톡)", type: "text", required: true },
            { name: "kakaoChannelUrl", label: "카카오채널 주소", type: "text" },
            links("sns", "채널 링크 (푸터)"),
            links("legalLinks", "하단 법적 링크 (개인정보처리방침 등)"),
            links("homepageMenu", "홈페이지 메뉴 (전체 메뉴 시트에 표시)"),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"], true);
      },
    ],
  },
};

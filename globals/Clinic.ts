// 병원 정보 글로벌. 푸터, 퀵메뉴, 면책 문구, CTA, 구조화 데이터(JSON-LD) 에 쓰인다. 사이트에 하나만 존재.
// 필드 구성은 lib/types.ts 의 ClinicInfo 와 1:1 로 맞춘다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";
import { clinic as mockClinic } from "../lib/mock";
import * as defaults from "../lib/clinicDefaults";

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
          label: "글 하단 문구",
          fields: [
            // 기본 문구는 lib/clinicDefaults.ts. defaultValue 는 반드시 함수로 (globals/HomePage.ts 주석 참고)
            {
              name: "disclaimerText",
              label: "의료광고 안내 문구 (글 하단 면책 상자)",
              type: "textarea",
              defaultValue: () => defaults.DISCLAIMER_TEXT,
              admin: { description: "\"[의료광고 심의 및 안내사항]\" 제목과 아래 의료기관 한 줄은 자동으로 붙습니다." },
            },
            { name: "ctaTitle", label: "상담 블록 제목", type: "text", defaultValue: () => defaults.CTA_TITLE },
            {
              name: "ctaText",
              label: "상담 블록 안내 문구",
              type: "textarea",
              defaultValue: () => defaults.ctaText(mockClinic.name),
              admin: { description: '"|" 는 모바일에서만 줄바꿈, Enter 는 모든 화면에서 줄바꿈' },
            },
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

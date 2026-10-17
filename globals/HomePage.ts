// 메인 페이지 글로벌. 히어로 문구, 배너, 소개, 핵심 요약, FAQ, 출처를 관리자가 직접 수정한다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";

export const HomePage: GlobalConfig = {
  slug: "home",
  label: "메인 페이지",
  access: { read: () => true },
  admin: {
    group: "설정",
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/next/preview?path=%2F&previewSecret=${process.env.PREVIEW_SECRET}`,
    },
  },
  versions: { drafts: { autosave: { interval: 500 } } },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "히어로·배너",
          fields: [
            { name: "heroImage", label: "히어로 배경 사진 (가로 1920 이상 권장)", type: "upload", relationTo: "media" },
            { name: "heroTitle", label: "히어로 제목", type: "text" },
            { name: "heroText", label: "히어로 문구", type: "textarea" },
            { name: "searchPlaceholder", label: "검색창 안내 문구", type: "text" },
            {
              name: "popularKeywords",
              label: "인기 검색 키워드",
              type: "array",
              labels: { singular: "키워드", plural: "키워드" },
              fields: [{ name: "value", label: "키워드", type: "text", required: true }],
            },
            {
              name: "banners",
              label: "배너 슬라이드",
              type: "array",
              labels: { singular: "배너", plural: "배너" },
              fields: [
                { name: "image", label: "데스크톱 이미지 (1920×920)", type: "upload", relationTo: "media" },
                { name: "mobileImage", label: "모바일 이미지 (750×1624)", type: "upload", relationTo: "media" },
                { name: "label", label: "작은 제목", type: "text" },
                { name: "text", label: "문구", type: "textarea" },
              ],
            },
          ],
        },
        {
          label: "소개·요약",
          fields: [
            { name: "introLabel", label: "소개 영문 라벨", type: "text" },
            { name: "introText", label: "병원 소개 문구", type: "textarea" },
            { name: "summaryTitle", label: "핵심 요약 제목", type: "text" },
            { name: "summaryText", label: "핵심 요약 문단", type: "textarea" },
            {
              name: "keyPoints",
              label: "핵심 포인트",
              type: "array",
              labels: { singular: "항목", plural: "항목" },
              fields: [{ name: "value", label: "내용", type: "text", required: true }],
            },
          ],
        },
        {
          label: "FAQ·출처",
          fields: [
            {
              name: "faq",
              label: "자주 묻는 질문",
              type: "array",
              labels: { singular: "질문", plural: "질문" },
              fields: [
                { name: "question", label: "질문", type: "text", required: true },
                { name: "answer", label: "답변", type: "textarea", required: true },
              ],
            },
            {
              name: "sources",
              label: "참고 자료",
              type: "array",
              labels: { singular: "출처", plural: "출처" },
              fields: [
                { name: "label", label: "자료명", type: "text", required: true },
                { name: "href", label: "링크", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"]);
      },
    ],
  },
};

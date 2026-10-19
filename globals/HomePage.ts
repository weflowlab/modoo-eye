// 메인 페이지 글로벌. 히어로 문구, 배너, 소개, 핵심 요약, FAQ, 출처를 관리자가 직접 수정한다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";
import { clinic, popularKeywords } from "../lib/mock";
import * as defaults from "../lib/homeDefaults";

// 기본 문구(lib/homeDefaults.ts)를 필드 defaultValue 로 넣어 새 DB 에서도 관리자 화면에 미리 채워진다.
// 이미 저장된 DB 는 값이 null 이라 defaultValue 가 적용되지 않으므로 시드(/api/dev-seed)가 비어 있는 필드를 채운다.
// 주의: defaultValue 는 반드시 함수로 쓴다. 문자열 그대로 두면 Payload 가 SQLite 컬럼 DEFAULT 로 밀어 넣는데,
// 줄바꿈이 든 한글 문구는 drizzle 스키마 비교가 깨져 서버 기동 때마다 테이블 재생성을 시도하다 실패한다.
const BREAK_HINT = '"|" 는 모바일에서만 줄바꿈, Enter 는 모든 화면에서 줄바꿈';

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
            // 제목 묶음은 홈페이지 섹션 이름과 맞춘다 (관리자가 어느 부분인지 바로 알 수 있게)
            {
              type: "collapsible",
              label: "메인페이지 상단",
              admin: { initCollapsed: false },
              fields: [
                { name: "heroTitle", label: "제목", type: "textarea", defaultValue: () => defaults.heroTitle(clinic) },
                { name: "heroText", label: "문구", type: "textarea", defaultValue: () => defaults.HERO_TEXT },
                { name: "searchPlaceholder", label: "검색창 안내 문구", type: "text", defaultValue: () => defaults.SEARCH_PLACEHOLDER },
                {
                  name: "popularKeywords",
                  label: "인기 검색어",
                  type: "array",
                  labels: { singular: "키워드", plural: "키워드" },
                  defaultValue: () => popularKeywords.map((value) => ({ value })),
                  fields: [{ name: "value", label: "키워드", type: "text", required: true }],
                },
              ],
            },
            {
              name: "banners",
              label: "배너 슬라이드",
              type: "array",
              labels: { singular: "배너", plural: "배너" },
              defaultValue: () => defaults.BANNERS,
              fields: [
                { name: "image", label: "데스크톱 이미지 (1920×920)", type: "upload", relationTo: "media" },
                {
                  name: "mobileImage",
                  label: "모바일 이미지 (4:5, 예 800×1000)",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "비우면 데스크톱 이미지를 씁니다. 더 긴 이미지는 위쪽을 남기고 아래가 잘립니다." },
                },
                { name: "label", label: "작은 제목", type: "text" },
                { name: "text", label: "문구", type: "textarea", admin: { description: BREAK_HINT } },
              ],
            },
          ],
        },
        {
          label: "소개·요약",
          fields: [
            {
              type: "collapsible",
              label: "ABOUT MODOO'S EYE CLINIC",
              admin: { initCollapsed: false },
              fields: [
                {
                  name: "summaryTitle",
                  label: "제목",
                  type: "text",
                  defaultValue: () => defaults.SUMMARY_TITLE,
                  admin: { description: BREAK_HINT },
                },
                {
                  name: "summaryText",
                  label: "문단",
                  type: "textarea",
                  defaultValue: () => defaults.summaryText(clinic),
                  admin: { description: BREAK_HINT },
                },
              ],
            },
            {
              name: "keyPoints",
              label: "모두의안과의 장점 (최대 4개)",
              type: "array",
              labels: { singular: "카드", plural: "카드" },
              maxRows: 4,
              defaultValue: () => defaults.KEY_POINTS.map(({ title, text }) => ({ title, value: text })),
              fields: [
                { name: "title", label: "제목", type: "text" },
                { name: "value", label: "내용", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "FAQ",
          fields: [
            {
              name: "faq",
              label: "자주 묻는 질문",
              type: "array",
              labels: { singular: "질문", plural: "질문" },
              defaultValue: () => defaults.faq(clinic),
              fields: [
                { name: "question", label: "질문", type: "text", required: true },
                { name: "answer", label: "답변", type: "textarea", required: true },
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

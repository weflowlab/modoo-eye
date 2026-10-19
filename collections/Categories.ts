// 글 카테고리 (진료 분야). 헤더 메뉴와 URL 경로(/[category]) 에 쓰인다.
import type { CollectionConfig } from "payload";
import { revalidate } from "../lib/revalidate";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "카테고리", plural: "카테고리" },
  access: { read: () => true },
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "order"], group: "콘텐츠" },
  fields: [
    { name: "name", label: "카테고리명", type: "text", required: true },
    {
      name: "slug",
      label: "URL 경로 (영문 소문자)",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "예: retina → /retina" },
      validate: (v: unknown) => (typeof v === "string" && /^[a-z0-9-]+$/.test(v)) || "영문 소문자, 숫자, 하이픈만 가능",
    },
    { name: "description", label: "설명", type: "textarea" },
    { name: "order", label: "메뉴 순서", type: "number", defaultValue: 0 },
  ],
  hooks: {
    // 카테고리가 바뀌면 메뉴가 있는 모든 페이지를 다시 생성
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"], true);
      },
    ],
    afterDelete: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"], true);
      },
    ],
  },
};

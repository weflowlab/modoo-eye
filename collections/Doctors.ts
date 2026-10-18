// 의료진 컬렉션. 글 하단 작성자 카드(이름·직함·사진·전문 분야·한 줄 소개·약력)에 쓰인다. 의료진 별도 페이지는 없다.
import type { CollectionConfig } from "payload";
import { revalidate } from "../lib/revalidate";
import { formatSlug } from "../lib/formatSlug";

export const Doctors: CollectionConfig = {
  slug: "doctors",
  labels: { singular: "의료진", plural: "의료진" },
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "title", "order"],
    group: "콘텐츠",
    description: "글 하단 '이 글을 쓴 의료진' 카드에 표시됩니다. 별도 의료진 페이지는 없습니다.",
  },
  fields: [
    { name: "name", label: "이름", type: "text", required: true },
    {
      name: "slug",
      label: "URL 경로",
      type: "text",
      unique: true,
      admin: { description: "비워두면 이름으로 자동 생성", position: "sidebar" },
      hooks: { beforeValidate: [({ value, data }) => formatSlug(value || data?.name)] },
    },
    { name: "title", label: "직함", type: "text", required: true, defaultValue: "원장" },
    { name: "photo", label: "프로필 사진", type: "upload", relationTo: "media" },
    {
      name: "specialties",
      label: "전문 분야",
      type: "array",
      labels: { singular: "분야", plural: "분야" },
      fields: [{ name: "value", label: "분야", type: "text", required: true }],
    },
    { name: "bio", label: "한 줄 소개", type: "textarea" },
    {
      name: "career",
      label: "약력",
      type: "array",
      labels: { singular: "항목", plural: "항목" },
      fields: [{ name: "value", label: "약력", type: "text", required: true }],
    },
    { name: "order", label: "표시 순서", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (context.disableRevalidate) return;
        // 작성자 카드가 글마다 들어가므로 글 페이지 전체를 갱신
        await revalidate(["/"], true);
      },
    ],
  },
};

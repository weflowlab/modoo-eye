// 의료진 컬렉션. 의료진 목록/상세 페이지와 글 작성자 카드에 쓰인다.
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
    // 의료진 상세 미리보기
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/next/preview?path=${encodeURIComponent(`/doctors/${data?.slug ?? ""}`)}&previewSecret=${process.env.PREVIEW_SECRET}`,
    },
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
    { name: "story", label: "진료 이야기 (상세 페이지 본문)", type: "richText" },
    { name: "order", label: "표시 순서", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, context }) => {
        if (context.disableRevalidate) return;
        await revalidate(["/", "/doctors", `/doctors/${doc.slug}`]);
      },
    ],
  },
};

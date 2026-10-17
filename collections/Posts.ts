// 블로그 글 컬렉션. 초안(draft) → 발행(published) 워크플로우와 자동저장, 작성 중 미리보기를 지원한다.
import type { CollectionConfig } from "payload";
import { revalidate } from "../lib/revalidate";
import {
  lexicalEditor,
  HeadingFeature,
  BlockquoteFeature,
  OrderedListFeature,
  UnorderedListFeature,
  LinkFeature,
  UploadFeature,
  HorizontalRuleFeature,
  FixedToolbarFeature,
  EXPERIMENTAL_TableFeature,
  defaultEditorFeatures,
} from "@payloadcms/richtext-lexical";
import { formatSlug } from "../lib/formatSlug";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "글", plural: "글" },
  // 비로그인 사용자는 발행된 글만 조회
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "_status", "publishedAt"],
    group: "콘텐츠",
    // 글 작성 중 오른쪽에 실제 페이지 미리보기
    livePreview: {
      url: async ({ data, req }) => {
        let categorySlug = "";
        const cat = data?.category;
        if (typeof cat === "object" && cat?.slug) categorySlug = cat.slug;
        else if (cat) {
          const doc = await req.payload.findByID({ collection: "categories", id: cat, depth: 0 });
          categorySlug = doc.slug;
        }
        const path = `/${categorySlug}/${data?.slug ?? ""}`;
        return `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${process.env.PREVIEW_SECRET}`;
      },
    },
  },
  // 초안/발행 + 자동저장 + 예약 발행
  versions: {
    drafts: { autosave: { interval: 500 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  fields: [
    { name: "title", label: "제목", type: "text", required: true },
    {
      name: "slug",
      label: "URL 경로",
      type: "text",
      unique: true,
      index: true,
      admin: { description: "비워두면 제목으로 자동 생성 (한글 가능)", position: "sidebar" },
      hooks: { beforeValidate: [({ value, data }) => formatSlug(value || data?.title)] },
    },
    {
      name: "category",
      label: "카테고리",
      type: "relationship",
      relationTo: "categories",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "author",
      label: "작성 의료진",
      type: "relationship",
      relationTo: "doctors",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      label: "발행일",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
      hooks: {
        // 발행 시점에 비어 있으면 현재 시각으로
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) return new Date();
            return value;
          },
        ],
      },
    },
    { name: "thumbnail", label: "썸네일 이미지", type: "upload", relationTo: "media", admin: { position: "sidebar" } },
    {
      name: "summary",
      label: "요약 (카드·검색·AI 검색 노출용, 1~2문장)",
      type: "textarea",
      required: true,
      maxLength: 200,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "본문",
          fields: [
            {
              name: "content",
              label: "본문",
              type: "richText",
              required: true,
              editor: lexicalEditor({
                features: () => [
                  ...defaultEditorFeatures,
                  HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }), // h2 는 목차 항목이 된다
                  BlockquoteFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  LinkFeature(),
                  UploadFeature({ collections: { media: { fields: [{ name: "caption", label: "캡션", type: "text" }] } } }),
                  HorizontalRuleFeature(),
                  EXPERIMENTAL_TableFeature(),
                  FixedToolbarFeature(),
                ],
              }),
            },
            {
              name: "images",
              label: "상단 이미지 슬라이드",
              type: "array",
              labels: { singular: "이미지", plural: "이미지" },
              fields: [{ name: "image", label: "이미지", type: "upload", relationTo: "media", required: true }],
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
              label: "참고한 공신력 있는 자료",
              type: "array",
              labels: { singular: "출처", plural: "출처" },
              fields: [
                { name: "label", label: "자료명", type: "text", required: true },
                { name: "href", label: "링크", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "태그·관련 글",
          fields: [
            {
              name: "tags",
              label: "해시태그",
              type: "array",
              labels: { singular: "태그", plural: "태그" },
              fields: [{ name: "tag", label: "태그", type: "text", required: true }],
            },
            {
              name: "related",
              label: "함께 읽으면 좋은 글",
              type: "relationship",
              relationTo: "posts",
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
            },
          ],
        },
      ],
    },
    {
      name: "views",
      label: "조회수 (인기 글 순위에 사용)",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", readOnly: true },
    },
  ],
  hooks: {
    // 발행/수정 시 관련 페이지를 다시 생성
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        if (context.disableRevalidate) return;
        const catId = typeof doc.category === "object" ? doc.category.id : doc.category;
        const cat = await req.payload.findByID({ collection: "categories", id: catId, depth: 0 });
        const paths = ["/", "/posts", `/${cat.slug}`, `/${cat.slug}/${doc.slug}`];
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) paths.push(`/${cat.slug}/${previousDoc.slug}`);
        await revalidate(paths);
      },
    ],
  },
};

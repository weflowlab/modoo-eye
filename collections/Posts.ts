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
  BlocksFeature,
  defaultEditorFeatures,
} from "@payloadcms/richtext-lexical";
import { formatSlug } from "../lib/formatSlug";
import { postBlocks } from "../lib/postBlocks";
import { buildPostTemplate } from "../lib/postTemplate";

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
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "";
        let categorySlug = "";
        const cat = data?.category;
        if (cat && typeof cat === "object" && cat.slug) categorySlug = cat.slug;
        else if (cat) {
          const doc = await req.payload.findByID({ collection: "categories", id: cat, depth: 0 });
          categorySlug = doc.slug;
        }
        // 새 글은 카테고리나 URL 경로가 아직 없을 수 있다. 그때는 안내 화면을 보여 준다 ("//slug" 같은 깨진 경로 방지)
        if (!categorySlug || !data?.slug) return `${base}/next/preview-pending`;
        const path = `/${categorySlug}/${data.slug}`;
        return `${base}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${process.env.PREVIEW_SECRET}`;
      },
    },
  },
  // 초안/발행 + 자동저장 + 예약 발행
  versions: {
    // 예약은 Payload 의 "예약 발행"(작업 큐 필요, Vercel 에선 안 돎) 대신 발행일 필드로 한다: 발행일이 미래면 그 시각까지 사이트에 안 보인다 (lib/payload.ts publishedWhere)
    // 자동저장 3초: 0.5초면 SQLite 쓰기 잠금이 너무 자주 걸려 개발 서버가 멈추곤 했다
    drafts: { autosave: { interval: 3000 }, schedulePublish: false },
    maxPerDoc: 30,
  },
  fields: [
    // 사이드바는 쓰지 않는다 (모든 탭에 따라다녀 헷갈림). 설정류는 "카테고리" 탭에 모은다.
    // 제목은 탭 위에 항상 보인다 (admin.useAsTitle 필드는 Payload 규칙상 최상위에 있어야 한다)
    {
      name: "title",
      label: "제목",
      type: "text",
      required: true,
      // 복제하면 목록에서 구분되도록 "(복사본)" 을 붙인다
      hooks: { beforeDuplicate: [({ value }) => (value ? `${value} (복사본)` : value)] },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "카테고리",
          description: "글을 쓰기 전에 먼저 정합니다. 카테고리와 의료진을 고르면 오른쪽 미리보기가 나타납니다.",
          fields: [
            {
              type: "row",
              fields: [
                { name: "category", label: "카테고리", type: "relationship", relationTo: "categories", required: true, admin: { width: "50%" } },
                { name: "author", label: "작성 의료진", type: "relationship", relationTo: "doctors", required: true, admin: { width: "50%" } },
              ],
            },
            { name: "thumbnail", label: "썸네일 이미지 (목록 카드·공유 미리보기)", type: "upload", relationTo: "media" },
            {
              name: "publishedAt",
              label: "발행일 (예약 가능)",
              type: "date",
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description: "비우면 게시하는 순간으로 찍힙니다. 미래 시각으로 두고 게시하면 그 시각까지 사이트에 보이지 않다가 자동으로 공개됩니다. 지난 시각으로는 바꿀 수 없습니다.",
              },
              // 발행일을 지난 시각으로 바꾸는 것은 막는다. 예외: 지금 저장돼 있는 날짜 그대로, 또는 이미 발행된 버전의 날짜로 되돌리는 것.
              // (오류 문구는 입력칸 옆 말풍선에 들어가야 해서 짧게. 자세한 안내는 아래 description)
              validate: async (value, { previousValue, req, id }) => {
                if (!value) return true;
                if (req.context?.seed) return true; // 시드는 과거 발행일로 글을 넣는다

                const next = new Date(value).getTime();
                const same = (d?: Date | string | null) => !!d && new Date(d).getTime() === next;
                if (same(previousValue)) return true;
                if (next >= Date.now() - 5 * 60 * 1000) return true;
                if (id) {
                  try {
                    const published = await req.payload.findByID({ collection: "posts", id, depth: 0, draft: false });
                    if (same(published?.publishedAt)) return true;
                  } catch {
                    /* 아직 발행된 버전이 없으면 무시 */
                  }
                }
                return "지난 시각으로는 발행할 수 없습니다";
              },
              hooks: {
                // 발행 시점에 비어 있으면 현재 시각으로
                beforeChange: [
                  ({ siblingData, value }) => {
                    if (siblingData._status === "published" && !value) return new Date();
                    return value;
                  },
                ],
                // 복제본은 발행일을 비워 새로 발행할 때 다시 찍히게 한다
                beforeDuplicate: [() => null],
              },
            },
            {
              name: "slug",
              label: "URL 경로",
              type: "text",
              unique: true,
              index: true,
              admin: { description: "비워두면 제목으로 자동 생성 (한글 가능). 발행 뒤에 바꾸면 기존 주소가 끊기니 주의." },
              hooks: { beforeValidate: [({ value, data }) => formatSlug(value || data?.title)] },
            },
            {
              name: "views",
              label: "조회수 (인기 글 순위에 사용)",
              type: "number",
              defaultValue: 0,
              admin: { readOnly: true },
              hooks: { beforeDuplicate: [() => 0] }, // 복제본 조회수는 0 부터
            },
          ],
        },
        {
          label: "요약",
          fields: [
            {
              name: "summary",
              label: "핵심 요약 (글 맨 위 요약 상자, 카드·검색·AI 검색 노출용, 1~2문장)",
              type: "textarea",
              required: true,
              maxLength: 200,
            },
            {
              name: "keyPoints",
              label: "핵심 포인트 (요약 상자 아래 불릿, 3~5개 권장)",
              type: "array",
              maxRows: 6,
              labels: { singular: "포인트", plural: "포인트" },
              fields: [{ name: "text", label: "내용", type: "text", required: true }],
            },
          ],
        },
        {
          label: "본문",
          fields: [
            {
              name: "content",
              label: "본문",
              type: "richText",
              required: true,
              // 새 글이면 템플릿 뼈대가 미리 들어간다 (함수로 두어 DB DEFAULT 로 들어가지 않게)
              defaultValue: () => buildPostTemplate(),
              admin: {
                description:
                  '새 글에는 뼈대가 미리 들어 있습니다. 괄호 안 안내문을 실제 내용으로 바꾸고, 필요 없는 섹션이나 상자는 지우세요. 섹션 제목(H2)은 자동으로 01, 02 번호가 붙고, "DEFINITION | 제목" 처럼 쓰면 세로줄 앞은 영문 라벨이 됩니다. 강조 박스·단계별 안내·체크리스트·흐름도는 "+" 버튼으로 추가합니다.',
              },
              editor: lexicalEditor({
                features: () => [
                  ...defaultEditorFeatures,
                  HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }), // h2 는 목차 항목이 된다
                  BlocksFeature({ blocks: postBlocks }),
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
                { name: "label", label: "자료명 (기관명)", type: "text", required: true },
                { name: "href", label: "링크", type: "text", required: true },
                { name: "description", label: "한 줄 설명 (선택. 비우면 링크 주소가 보입니다)", type: "text" },
              ],
            },
          ],
        },
        {
          label: "태그·관련 글",
          fields: [
            {
              name: "tags",
              label: "관련 검색어 (글 끝 해시태그 칩, 클릭하면 블로그 검색)",
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
  ],
  hooks: {
    // 발행/수정 시 관련 페이지를 다시 생성
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        if (context.disableRevalidate) return;
        // 초안 자동저장(0.5초마다)은 공개 페이지에 영향이 없으므로 건너뛴다. 발행 상태였다가 초안으로 바뀌는 경우는 갱신한다.
        if (doc._status !== "published" && previousDoc?._status !== "published") return;
        // 새 글의 빈 초안은 카테고리가 없을 수 있다
        const catId = doc.category && typeof doc.category === "object" ? doc.category.id : doc.category;
        if (!catId) return;
        const cat = await req.payload.findByID({ collection: "categories", id: catId, depth: 0 });
        const paths = ["/", "/posts", `/${cat.slug}`, `/${cat.slug}/${doc.slug}`];
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) paths.push(`/${cat.slug}/${previousDoc.slug}`);
        await revalidate(paths);
      },
    ],
    // 삭제 시에도 글 페이지(정적 생성)와 목록을 바로 갱신한다. 없으면 글 페이지가 다음 배포 때까지 남는다
    afterDelete: [
      async ({ doc, req, context }) => {
        if (context.disableRevalidate) return;
        const catId = doc.category && typeof doc.category === "object" ? doc.category.id : doc.category;
        const paths = ["/", "/posts"];
        if (catId) {
          const cat = await req.payload.findByID({ collection: "categories", id: catId, depth: 0 });
          paths.push(`/${cat.slug}`, `/${cat.slug}/${doc.slug}`);
        }
        await revalidate(paths);
      },
    ],
  },
};

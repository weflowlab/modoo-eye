// Payload 리치텍스트(Lexical JSON) 를 본문 HTML 로 렌더. 기본 스타일은 globals.css 의 .prose-content 가 담당.
// - h2: 섹션 번호(01, 02…)와 영문 라벨("LABEL | 제목" 표기)을 붙인 PostSectionHeading 으로, id 는 목차와 같은 규칙
// - 업로드 이미지는 next/image + 캡션(figure)
// - 블록(강조 박스·단계별 안내·체크리스트·흐름도)은 components/post/blocks/* 로
import Image from "next/image";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { DefaultNodeTypes, SerializedBlockNode, SerializedUploadNode, SerializedHeadingNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { extractHeadings, type HeadingItem, type LexicalNode } from "@/lib/lexical";
import { mediaUrl } from "@/lib/mediaUrl";
import type { PostBlockFields } from "@/lib/postBlocks";
import { PostSectionHeading } from "./PostSectionHeading";
import { Callout } from "./blocks/Callout";
import { Steps } from "./blocks/Steps";
import { Checklist } from "./blocks/Checklist";
import { Flow } from "./blocks/Flow";

type Props = { content: unknown; className?: string };
type Nodes = DefaultNodeTypes | SerializedBlockNode<PostBlockFields>;

export function RichTextContent({ content, className }: Props) {
  // 헤딩 노드 → 번호·라벨·id (목차와 동일 규칙)
  const headings = new Map<LexicalNode, HeadingItem>();
  for (const h of extractHeadings(content)) headings.set(h.node, h);

  const converters: JSXConvertersFunction<Nodes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const n = node as SerializedHeadingNode;
      const meta = headings.get(n as unknown as LexicalNode);
      // h2: 섹션 제목 (번호 + 라벨 + 제목). 라벨 규칙 때문에 텍스트는 nodesToJSX 대신 정리된 제목을 쓴다
      if (n.tag === "h2" && meta) return <PostSectionHeading id={meta.id} number={meta.number} label={meta.label} title={meta.heading} />;
      const Tag = n.tag;
      return <Tag>{nodesToJSX({ nodes: n.children })}</Tag>;
    },
    // 업로드 이미지: 캡션이 있으면 figure
    upload: ({ node }) => {
      const n = node as SerializedUploadNode;
      const media = typeof n.value === "object" ? n.value : null;
      if (!media || typeof media !== "object" || !("url" in media) || !media.url) return null;
      const m = media as { url: string; alt?: string; width?: number | null; height?: number | null };
      const caption = (n.fields as { caption?: string } | undefined)?.caption;
      const img = (
        <Image
          src={mediaUrl(m.url)}
          alt={m.alt ?? ""}
          width={m.width ?? 1200}
          height={m.height ?? 800}
          sizes="(min-width: 1024px) 800px, 100vw"
          className="my-0! w-full rounded-[12px] border border-border"
        />
      );
      return caption ? (
        <figure className="my-6">
          {img}
          <figcaption className="mt-2.5 text-center text-sm text-neutral-500">{caption}</figcaption>
        </figure>
      ) : (
        <div className="my-6">{img}</div>
      );
    },
    // 표: 모바일 가로 스크롤 래퍼. 기본 변환기는 셀에 인라인 스타일(회색 테두리·8px 여백)을 박아 넣어 CSS 가 밀리므로 행·셀도 직접 그린다
    table: ({ node, nodesToJSX }) => (
      <div className="prose-table my-6 overflow-x-auto rounded-[11px] border border-border">
        <table>
          <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
        </table>
      </div>
    ),
    tablerow: ({ node, nodesToJSX }) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,
    tablecell: ({ node, nodesToJSX }) => {
      const Cell = node.headerState ? "th" : "td";
      return (
        <Cell colSpan={node.colSpan > 1 ? node.colSpan : undefined} rowSpan={node.rowSpan > 1 ? node.rowSpan : undefined}>
          {nodesToJSX({ nodes: node.children })}
        </Cell>
      );
    },
    blocks: {
      callout: ({ node }) => <Callout fields={node.fields} />,
      steps: ({ node }) => <Steps fields={node.fields} />,
      checklist: ({ node }) => <Checklist fields={node.fields} />,
      flow: ({ node }) => <Flow fields={node.fields} />,
    },
  });

  return (
    <RichText
      data={content as SerializedEditorState}
      converters={converters}
      className={className}
      disableContainer
    />
  );
}

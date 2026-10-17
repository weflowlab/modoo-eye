// Payload 리치텍스트(Lexical JSON) 를 본문 HTML 로 렌더. 스타일은 globals.css 의 .prose-content 가 담당.
// - h2 에는 목차와 같은 규칙의 id 를 붙여 목차 클릭 시 이동할 수 있게 한다
// - 업로드 이미지는 next/image + 캡션(figure) 로 렌더
import Image from "next/image";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { DefaultNodeTypes, SerializedUploadNode, SerializedHeadingNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { extractHeadings, type LexicalNode } from "@/lib/lexical";
import { mediaUrl } from "@/lib/mediaUrl";

type Props = { content: unknown; className?: string };

export function RichTextContent({ content, className }: Props) {
  // 헤딩 노드 → id 매핑 (목차와 동일)
  const ids = new Map<LexicalNode, string>();
  for (const h of extractHeadings(content)) ids.set(h.node, h.id);

  const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    // h2/h3: id 부여 (h2 만 목차 대상)
    heading: ({ node, nodesToJSX }) => {
      const n = node as SerializedHeadingNode;
      const Tag = n.tag;
      const id = ids.get(n as unknown as LexicalNode);
      return <Tag id={id}>{nodesToJSX({ nodes: n.children })}</Tag>;
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

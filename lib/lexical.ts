// Lexical(Payload 리치텍스트) JSON 유틸.
// - extractHeadings: 본문의 h2 를 목차 항목으로 뽑는다 (RichTextContent 의 heading id 와 동일 규칙)
// - htmlSectionsToLexical: 시드용. 목 데이터의 간단한 HTML 섹션을 Lexical 노드로 변환
import { formatSlug } from "./formatSlug";

export type LexicalNode = { type: string; children?: LexicalNode[]; [k: string]: unknown };
export type LexicalState = { root: LexicalNode };
// heading: 한글 제목(목차·id 에 쓰임), label: 영문 라벨(선택), number: 1부터 시작하는 섹션 번호
export type HeadingItem = { id: string; heading: string; label?: string; number: number; node: LexicalNode };

// 노드 아래 모든 텍스트를 이어 붙인다
export function nodeText(node: LexicalNode): string {
  if (node.type === "text") return String(node.text ?? "");
  return (node.children ?? []).map(nodeText).join("");
}

// 섹션 제목 표기 규칙: "DEFINITION | 황반변성이란?" → 라벨 "DEFINITION", 제목 "황반변성이란?". 세로줄이 없으면 전체가 제목.
export function splitHeading(raw: string): { label?: string; heading: string } {
  const i = raw.indexOf("|");
  if (i < 0) return { heading: raw.trim() };
  const label = raw.slice(0, i).trim();
  const heading = raw.slice(i + 1).trim();
  return label && heading ? { label, heading } : { heading: raw.replace("|", " ").trim() };
}

// h2 헤딩 목록. id 는 "제목 슬러그" 이고 중복이면 -2, -3 을 붙인다.
export function extractHeadings(content: unknown, tag = "h2"): HeadingItem[] {
  const state = content as LexicalState | undefined;
  const out: HeadingItem[] = [];
  const seen = new Map<string, number>();
  const walk = (n: LexicalNode) => {
    if (n.type === "heading" && n.tag === tag) {
      const { label, heading } = splitHeading(nodeText(n));
      const base = formatSlug(heading) || "section";
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      out.push({ id: count === 1 ? base : `${base}-${count}`, heading, label, number: out.length + 1, node: n });
    }
    n.children?.forEach(walk);
  };
  if (state?.root) walk(state.root);
  return out;
}

// ── 시드용 HTML → Lexical 변환 (p, h3, ol/ul, blockquote, table, strong 만 지원) ──

const base = { direction: "ltr" as const, format: "", indent: 0, version: 1 };

function text(t: string, bold = false): LexicalNode {
  return { type: "text", text: t, format: bold ? 1 : 0, detail: 0, mode: "normal", style: "", version: 1 };
}

// <strong> 만 굵게, 나머지 태그는 제거
function inline(html: string): LexicalNode[] {
  const nodes: LexicalNode[] = [];
  const re = /<strong>(.*?)<\/strong>|([^<]+)|<[^>]+>/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) nodes.push(text(m[1], true));
    else if (m[2] !== undefined && m[2].trim()) nodes.push(text(m[2]));
  }
  return nodes;
}

const paragraph = (html: string): LexicalNode => ({ type: "paragraph", children: inline(html), textFormat: 0, textStyle: "", ...base });

function list(html: string, ordered: boolean): LexicalNode {
  const items = [...html.matchAll(/<li>(.*?)<\/li>/gs)].map((m, i) => ({
    type: "listitem",
    value: i + 1,
    children: inline(m[1]),
    ...base,
  }));
  return { type: "list", listType: ordered ? "number" : "bullet", start: 1, tag: ordered ? "ol" : "ul", children: items, ...base };
}

function table(html: string): LexicalNode {
  const rows = [...html.matchAll(/<tr>(.*?)<\/tr>/gs)].map((r) => {
    const cells = [...r[1].matchAll(/<(th|td)>(.*?)<\/\1>/gs)].map((c) => ({
      type: "tablecell",
      headerState: c[1] === "th" ? 1 : 0,
      colSpan: 1,
      rowSpan: 1,
      backgroundColor: null,
      children: [paragraph(c[2])],
      ...base,
    }));
    return { type: "tablerow", children: cells, ...base };
  });
  return { type: "table", children: rows, ...base };
}

export function htmlToLexicalNodes(html: string): LexicalNode[] {
  const nodes: LexicalNode[] = [];
  const re = /<(p|h3|ol|ul|blockquote|table)>(.*?)<\/\1>/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const [, tag, body] = m;
    if (tag === "p") nodes.push(paragraph(body));
    else if (tag === "h3") nodes.push({ type: "heading", tag: "h3", children: inline(body), ...base });
    else if (tag === "ol" || tag === "ul") nodes.push(list(body, tag === "ol"));
    else if (tag === "blockquote") nodes.push({ type: "quote", children: inline(body), ...base });
    else if (tag === "table") nodes.push(table(body));
  }
  return nodes;
}

// 섹션 배열(h2 제목 + HTML) → Lexical 문서
export function htmlSectionsToLexical(sections: { heading: string; html: string }[]): LexicalState {
  const children: LexicalNode[] = [];
  for (const s of sections) {
    children.push({ type: "heading", tag: "h2", children: [text(s.heading)], ...base });
    children.push(...htmlToLexicalNodes(s.html));
  }
  return { root: { type: "root", children, ...base } };
}

// ── 글을 코드로 조립할 때 쓰는 빌더 (lib/samplePost.ts). 인라인은 <strong> 만 지원 ──

// 배열 행 id (Payload 가 각 행에 기대하는 24자리 16진수)
export const rowId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

export const lx = {
  p: (html: string): LexicalNode => paragraph(html),
  h2: (title: string): LexicalNode => ({ type: "heading", tag: "h2", children: [text(title)], ...base }),
  h3: (title: string): LexicalNode => ({ type: "heading", tag: "h3", children: [text(title)], ...base }),
  ul: (items: string[]): LexicalNode => list(items.map((i) => `<li>${i}</li>`).join(""), false),
  ol: (items: string[]): LexicalNode => list(items.map((i) => `<li>${i}</li>`).join(""), true),
  quote: (html: string): LexicalNode => ({ type: "quote", children: inline(html), ...base }),
  // 첫 행은 머리글(th)
  table: (rows: string[][]): LexicalNode =>
    table(rows.map((r, i) => `<tr>${r.map((c) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")),
  // 본문 블록 (lib/postBlocks.ts). 배열 필드의 각 행에는 id 를 붙여 준다
  block: (fields: Record<string, unknown> & { blockType: string }): LexicalNode => {
    const withIds = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, Array.isArray(v) ? v.map((row) => ({ id: rowId(), ...(row as object) })) : v]),
    );
    return { type: "block", version: 2, format: "", fields: { id: rowId(), blockName: "", ...withIds } };
  },
  doc: (children: LexicalNode[]): LexicalState => ({ root: { type: "root", children, ...base } }),
};

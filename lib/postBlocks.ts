// 글 본문 에디터에서 끼워 넣는 블록 정의 (Payload Lexical BlocksFeature).
// 관리자는 본문 쓰다가 "+" → 블록 선택 → 칸만 채우면 되고, 프론트는 components/post/blocks/* 가 디자인을 입혀 그린다.
// 레퍼런스(blog.kimsretina.com) 본문 부품: 강조 박스, 단계별 안내, 체크리스트, 흐름도.
// 블록을 추가/변경하면 dev 서버 띄운 뒤 `npm run payload:generate` 로 타입을 다시 만든다.
import type { Block } from "payload";

// ── 프론트 렌더용 타입 (Lexical 블록 노드의 fields 모양) ──
export type CalloutFields = {
  blockType: "callout";
  variant: "tip" | "caution" | "summary";
  title?: string | null;
  text: string;
};
export type StepsFields = {
  blockType: "steps";
  title?: string | null;
  items: { title: string; text?: string | null; id?: string }[];
};
export type ChecklistFields = {
  blockType: "checklist";
  title?: string | null;
  items: { text: string; id?: string }[];
};
export type FlowFields = {
  blockType: "flow";
  items: { label: string; text?: string | null; id?: string }[];
};
export type PostBlockFields = CalloutFields | StepsFields | ChecklistFields | FlowFields;

const BREAK_HINT = "Enter 로 줄바꿈";

// 강조 박스: 팁 / 주의 / 요약 인용
export const CalloutBlock: Block = {
  slug: "callout",
  labels: { singular: "강조 박스", plural: "강조 박스" },
  fields: [
    {
      name: "variant",
      label: "종류",
      type: "select",
      required: true,
      defaultValue: "tip",
      options: [
        { label: "참고·팁 (남색)", value: "tip" },
        { label: "주의 (노란색)", value: "caution" },
        { label: "요약 인용 (회색, 왼쪽 강조선)", value: "summary" },
      ],
    },
    { name: "title", label: "제목 (굵은 한 줄)", type: "text" },
    { name: "text", label: "내용", type: "textarea", required: true, admin: { description: BREAK_HINT } },
  ],
};

// 단계별 안내: 큰 번호 + 소제목 + 설명
export const StepsBlock: Block = {
  slug: "steps",
  labels: { singular: "단계별 안내", plural: "단계별 안내" },
  fields: [
    { name: "title", label: "묶음 제목 (선택)", type: "text", admin: { description: "예: 검사부터 치료까지 4단계" } },
    {
      name: "items",
      label: "단계",
      type: "array",
      required: true,
      minRows: 2,
      maxRows: 8,
      labels: { singular: "단계", plural: "단계" },
      fields: [
        { name: "title", label: "단계 제목", type: "text", required: true },
        { name: "text", label: "설명", type: "textarea", admin: { description: BREAK_HINT } },
      ],
    },
  ],
};

// 체크리스트: 체크 아이콘 달린 증상·대상 목록
export const ChecklistBlock: Block = {
  slug: "checklist",
  labels: { singular: "체크리스트", plural: "체크리스트" },
  fields: [
    { name: "title", label: "제목 (선택)", type: "text", admin: { description: "예: 이런 증상이 있다면 검사를 받아 보세요" } },
    {
      name: "items",
      label: "항목",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "항목", plural: "항목" },
      fields: [{ name: "text", label: "내용", type: "text", required: true }],
    },
  ],
};

// 흐름도: 카드 → 카드 → 카드 (진행 단계, 원인→결과 등)
export const FlowBlock: Block = {
  slug: "flow",
  labels: { singular: "흐름도 (A → B → C)", plural: "흐름도" },
  fields: [
    {
      name: "items",
      label: "카드",
      type: "array",
      required: true,
      minRows: 2,
      maxRows: 5,
      labels: { singular: "카드", plural: "카드" },
      fields: [
        { name: "label", label: "카드 제목", type: "text", required: true },
        { name: "text", label: "짧은 설명 (선택)", type: "text" },
      ],
    },
  ],
};

export const postBlocks: Block[] = [CalloutBlock, StepsBlock, ChecklistBlock, FlowBlock];

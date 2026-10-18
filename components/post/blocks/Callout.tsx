// 본문 블록: 강조 박스 (참고·팁 / 주의 / 요약 인용). lib/postBlocks.ts 의 CalloutBlock.
import { IconAlertTriangle, IconBulb, IconQuote } from "@tabler/icons-react";
import type { CalloutFields } from "@/lib/postBlocks";

const STYLES = {
  tip: {
    box: "border border-[var(--brand-primary-20)] bg-[var(--brand-primary-5)]",
    title: "text-primary",
    Icon: IconBulb,
    fallbackTitle: "참고",
  },
  caution: {
    box: "border border-amber-200 bg-amber-50",
    title: "text-amber-800",
    Icon: IconAlertTriangle,
    fallbackTitle: "주의",
  },
  summary: {
    box: "border-l-4 border-primary bg-neutral-50",
    title: "text-foreground",
    Icon: IconQuote,
    fallbackTitle: "",
  },
} as const;

export function Callout({ fields }: { fields: CalloutFields }) {
  const s = STYLES[fields.variant] ?? STYLES.tip;
  const title = fields.title || s.fallbackTitle;
  return (
    <aside className={`my-6 rounded-[11px] px-5 py-4 md:px-6 md:py-5 ${s.box}`}>
      {title && (
        <p className={`m-0! flex items-center gap-2 text-[15.5px] font-bold ${s.title}`}>
          <s.Icon className="size-5 shrink-0" stroke={2} />
          {title}
        </p>
      )}
      <p className={`m-0! whitespace-pre-line text-[15.5px] leading-[1.75] text-neutral-700 ${title ? "mt-2" : ""}`}>{fields.text}</p>
    </aside>
  );
}

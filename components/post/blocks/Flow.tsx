// 본문 블록: 흐름도 (카드 → 카드 → 카드). 데스크톱 가로, 모바일 세로. lib/postBlocks.ts 의 FlowBlock.
import { IconArrowRight } from "@tabler/icons-react";
import type { FlowFields } from "@/lib/postBlocks";

export function Flow({ fields }: { fields: FlowFields }) {
  const items = fields.items ?? [];
  if (items.length === 0) return null;
  return (
    <div className="my-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-stretch">
      {items.map((it, i) => (
        <div key={it.id ?? i} className="contents">
          <div className="flex-1 rounded-[11px] border border-[var(--brand-primary-20)] bg-white px-4 py-4 text-center">
            <p className="m-0! text-[15.5px] font-bold leading-snug text-foreground">{it.label}</p>
            {it.text && <p className="m-0! mt-1.5 text-[13.5px] leading-[1.6] text-neutral-500">{it.text}</p>}
          </div>
          {i < items.length - 1 && (
            <div className="flex items-center justify-center text-primary" aria-hidden>
              <IconArrowRight className="size-5 rotate-90 sm:rotate-0" stroke={2} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

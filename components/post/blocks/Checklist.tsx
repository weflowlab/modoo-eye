// 본문 블록: 체크리스트 (체크 아이콘 달린 증상·대상 목록). lib/postBlocks.ts 의 ChecklistBlock.
import { IconCircleCheckFilled } from "@tabler/icons-react";
import type { ChecklistFields } from "@/lib/postBlocks";

export function Checklist({ fields }: { fields: ChecklistFields }) {
  const items = fields.items ?? [];
  if (items.length === 0) return null;
  return (
    <section className="my-6 rounded-[11px] border border-border bg-neutral-50 px-5 py-4 md:px-6 md:py-5">
      {fields.title && <p className="m-0! mb-3 text-[15.5px] font-bold text-foreground">{fields.title}</p>}
      <ul className="m-0! grid list-none gap-2 p-0! sm:grid-cols-2">
        {items.map((it, i) => (
          <li key={it.id ?? i} className="flex items-start gap-2.5 text-[15px] leading-[1.65] text-neutral-700">
            <IconCircleCheckFilled className="mt-[3px] size-[18px] shrink-0 text-primary" />
            <span>{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// 본문 블록: 단계별 안내 (큰 번호 + 소제목 + 설명). lib/postBlocks.ts 의 StepsBlock.
import type { StepsFields } from "@/lib/postBlocks";

export function Steps({ fields }: { fields: StepsFields }) {
  const items = fields.items ?? [];
  if (items.length === 0) return null;
  return (
    <section className="my-6">
      {fields.title && <p className="m-0! mb-3 text-[15px] font-bold text-primary">{fields.title}</p>}
      <ol className="m-0! grid list-none gap-3 p-0! sm:grid-cols-2">
        {items.map((it, i) => (
          <li key={it.id ?? i} className="flex gap-4 rounded-[11px] border border-border bg-white p-4 md:p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white">{i + 1}</span>
            <div className="min-w-0">
              <h4 className="m-0! text-[16px] font-bold leading-snug text-foreground">{it.title}</h4>
              {it.text && <p className="m-0! mt-1.5 whitespace-pre-line text-[14.5px] leading-[1.7] text-neutral-600">{it.text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// 메인 페이지 "모두의안과의 장점". 아이콘이 있는 카드 4개 (데스크톱 가로 4, 태블릿 2×2, 모바일 세로).
// 관리자 '메인 페이지 → 핵심 포인트' 문구가 있으면 그 문구를 카드 본문으로 쓰고, 없으면 기본 카드 4개.
import { IconUsers, IconSchool, IconRoute, IconHeartHandshake, type Icon } from "@tabler/icons-react";
import { Reveal } from "@/components/ui/Reveal";
import { getClinic } from "@/lib/payload";
import { KEY_POINTS } from "@/lib/homeDefaults"; // 기본 카드 4개 (글로벌에 카드가 없을 때)
import type { HomeContent } from "@/lib/types";

type Card = { Icon: Icon; title: string; text: string };

// 아이콘 순서 (i번째 카드에 붙는 아이콘)
const ICONS: Icon[] = [IconUsers, IconSchool, IconRoute, IconHeartHandshake];

type Props = { keyPoints?: HomeContent["keyPoints"] };

export async function StrengthsSection({ keyPoints }: Props) {
  const clinic = await getClinic();
  const cards: Card[] = (keyPoints && keyPoints.length > 0 ? keyPoints : KEY_POINTS)
    .slice(0, 4)
    .map((k, i) => ({ Icon: ICONS[i % ICONS.length], title: k.title, text: k.text }));

  return (
    <section aria-labelledby="home-strengths-title" className="bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 아이브로우 + 제목: 가운데 정렬, ABOUT 섹션과 같은 크기 */}
        <div className="text-center">
          <p className="text-sm font-semibold text-primary md:text-base">WHY {clinic.nameEn || clinic.name}</p>
          <Reveal variant="up">
            <h2 id="home-strengths-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              {clinic.name}의 장점
            </h2>
          </Reveal>
        </div>

        {/* 카드 4개 */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4 lg:gap-6">
          {cards.map(({ Icon, title, text }, i) => (
            <Reveal key={title || text} variant="fade-up" delay={0.1 * i}>
              <div className="h-full rounded-[11px] border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-[0_8px_30px_0_var(--brand-primary-10)] md:p-7">
                {/* 아이콘: 연한 남색 원 */}
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--brand-primary-10)] text-primary md:size-14">
                  <Icon className="size-6 md:size-7" stroke={1.75} />
                </div>
                {title && <h3 className="mt-5 text-lg font-bold md:text-xl">{title}</h3>}
                <p className={`whitespace-pre-line text-sm leading-relaxed text-neutral-600 md:text-[15px] ${title ? "mt-2" : "mt-5 font-semibold text-neutral-800"}`}>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

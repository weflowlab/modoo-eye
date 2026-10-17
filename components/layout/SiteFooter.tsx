// 사이트 푸터. 오시는 길(지도 링크 3개), 진료시간, 대표전화 + 채널, 법적 링크 + 저작권. 데이터는 @/lib/mock 의 clinic.
import { IconArticle, IconBrandInstagram, IconBrandYoutube, IconMapPin } from "@tabler/icons-react";
import { clinic } from "@/lib/mock";
import { Container } from "@/components/ui/Container";

// 레퍼런스 진료시간 아래 회색 안내문(수술시간 등). mock 에 필드가 없어 상수로 대체.
const HOURS_NOTES = ["안내 문구 플레이스홀더 1", "안내 문구 플레이스홀더 2"];

// 채널 아이콘 (레퍼런스는 svg 이미지 → tabler 아이콘으로 대체)
const SNS_ICONS = [IconBrandYoutube, IconArticle, IconBrandInstagram];

export function SiteFooter() {
  return (
    // 레퍼런스: mt-10 md:mt-24 bg-neutral-800 text-white
    <footer className="mt-10 bg-neutral-800 text-white md:mt-24">
      {/* 상단 3열: 모바일은 wrap 으로 세로 쌓임, 데스크톱은 justify-between */}
      <Container size="4xl" className="flex flex-wrap justify-between gap-10 py-12">
        {/* 오시는 길 */}
        <div className="w-auto max-w-120">
          <div className="mb-5 text-sm font-semibold text-white md:text-base">오시는 길</div>
          <p className="mb-4 text-base leading-relaxed md:mb-5 md:text-lg">{clinic.address}</p>
          <div className="flex flex-wrap gap-2">
            {clinic.mapLinks.map((m) => (
              // 레퍼런스: w-30 h-11 md:w-38 md:h-12.5 rounded-md bg-neutral-700 hover:bg-neutral-600
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-30 items-center justify-center gap-2 rounded-md bg-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-600 md:h-12.5 md:w-38"
              >
                <IconMapPin className="size-4 shrink-0" />
                <span className="text-sm text-white md:text-base">{m.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 진료시간 */}
        <div className="w-auto max-w-120">
          <div className="mb-5 text-sm font-semibold text-white md:text-base">진료시간</div>
          <ul className="space-y-1 text-base md:text-lg">
            {clinic.hours.map((h) => (
              <li key={h.label} className="flex gap-6">
                <span className="w-40 shrink-0">{h.label}</span>
                <span>{h.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            {HOURS_NOTES.map((n) => (
              <p key={n} className="text-base text-neutral-400 md:text-lg">
                {n}
              </p>
            ))}
          </div>
        </div>

        {/* 대표전화 + 채널 */}
        <div className="w-auto max-w-120">
          <div className="mb-5 text-sm font-semibold text-white md:text-base">대표전화</div>
          <p className="text-2xl font-bold text-white md:text-3xl">{clinic.phone}</p>
          <div className="mb-3 mt-6 text-base text-neutral-400">채널</div>
          <div className="flex gap-2">
            {clinic.sns.map((s, i) => {
              const Icon = SNS_ICONS[i] ?? IconArticle;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-700 p-2 hover:bg-neutral-600"
                >
                  <Icon className="size-6" />
                </a>
              );
            })}
          </div>
        </div>
      </Container>

      {/* 하단: 법적 링크 + 저작권. 모바일 세로 중앙, md 이상 양끝 정렬 */}
      <div className="border-t border-neutral-700">
        <Container
          size="4xl"
          className="flex flex-col items-center gap-x-2 gap-y-4 py-5 text-base text-neutral-400 md:flex-row md:items-center md:justify-between md:py-7 md:text-lg"
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-medium md:gap-x-7">
            {clinic.legalLinks.map((l) => (
              // 레퍼런스: 항목 사이 세로 구분선(after), 마지막 항목은 숨김
              <li
                key={l.label}
                className="relative pr-4 after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-neutral-400 last:pr-0 last:after:hidden md:pr-7"
              >
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-200">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p>© 2026 {clinic.name}</p>
        </Container>
      </div>
    </footer>
  );
}

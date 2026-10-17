// 사이트 푸터. 오시는 길(지도 링크 3개), 진료시간, 대표전화 + 채널, 법적 링크 + 사업자 정보 + 저작권. 데이터는 Payload 병원 정보(getClinic).
import Image from "next/image";
import { IconBrandKakaoTalk, IconMapPin, IconMessageCircle } from "@tabler/icons-react";
import { getClinic } from "@/lib/payload";
import { Container } from "@/components/ui/Container";

// 채널 아이콘: 라벨에 "카카오" 가 들어가면 카카오톡 아이콘, 그 외(네이버 톡톡 등)는 말풍선
const snsIcon = (label: string) => (label.includes("카카오") ? IconBrandKakaoTalk : IconMessageCircle);

export async function SiteFooter() {
  const clinic = await getClinic();
  return (
    // 레퍼런스: mt-10 md:mt-24 bg-neutral-800 text-white
    <footer className="mt-10 bg-neutral-800 text-white md:mt-24">
      {/* 상단 3열: 모바일은 wrap 으로 세로 쌓임, 데스크톱은 justify-between */}
      <Container size="4xl" className="flex flex-wrap justify-between gap-10 py-12">
        {/* 오시는 길 */}
        <div className="w-auto max-w-120">
          <div className="mb-5 text-sm font-semibold text-white md:text-base">오시는 길</div>
          <p className="mb-2 text-base leading-relaxed md:text-lg">{clinic.address}</p>
          <p className="mb-1 text-base text-neutral-400 md:text-lg">{clinic.directions}</p>
          <p className="mb-4 text-base text-neutral-400 md:mb-5 md:text-lg">주차: {clinic.parking.join(" · ")}</p>
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
        </div>

        {/* 대표전화 + 채널 */}
        <div className="w-auto max-w-120">
          <div className="mb-5 text-sm font-semibold text-white md:text-base">대표전화</div>
          <p className="text-2xl font-bold text-white md:text-3xl">{clinic.phone}</p>
          <p className="mt-1 text-base text-neutral-400 md:text-lg">팩스 {clinic.fax}</p>
          <div className="mb-3 mt-6 text-base text-neutral-400">상담 채널</div>
          <div className="flex gap-2">
            {clinic.sns.map((s) => {
              const Icon = snsIcon(s.label);
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

      {/* 하단: 로고 + 사업자 정보 / 법적 링크 + 저작권. 모바일 세로 중앙, md 이상 양끝 정렬 */}
      <div className="border-t border-neutral-700">
        <Container
          size="4xl"
          className="flex flex-col items-center gap-x-6 gap-y-4 py-5 text-base text-neutral-400 md:flex-row md:items-center md:justify-between md:py-7 md:text-lg"
        >
          {/* 어두운 배경이라 남색 로고는 흰 알약 안에 */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-5">
            <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-white px-4">
              <Image src="/logo.png" alt={clinic.name} width={181} height={56} className="h-5 w-auto" />
            </span>
            <p className="text-center text-sm leading-relaxed md:text-left md:text-base">
              {clinic.name} ({clinic.nameEn}) · 대표 {clinic.representatives.join("·")} · 사업자등록번호 {clinic.businessNumber}
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-medium md:justify-end md:gap-x-7">
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
            <li className="w-full text-center md:w-auto md:text-right">© 2026 {clinic.name}</li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

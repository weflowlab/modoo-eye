// 사이트 푸터 (자체 구성). 연한 회색 배경 3열: 로고 + 주소·지도 / 진료시간 / 상담·예약(네이버 톡톡 + 대표전화).
// 하단 바: 법적 링크 + 저작권. 데이터는 Payload 병원 정보(getClinic). 상담 채널은 네이버 톡톡 하나만 쓴다.
import Image from "next/image";
import { IconMapPin, IconMessageCircle, IconPhone } from "@tabler/icons-react";
import { getClinic } from "@/lib/payload";
import { Container } from "@/components/ui/Container";

// 지도 서비스 브랜드 마크 (단순화한 SVG). 네이버 초록 N / 카카오 노랑 말풍선 / 구글 4색 G.
// 배포 전 각 사의 공식 로고 에셋으로 교체 권장 (브랜드 가이드라인 준수).
function NaverMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
      <rect width="24" height="24" rx="5" fill="#03c75a" />
      <path d="M7 6.5h3.4l3.2 5v-5H17v11h-3.4l-3.2-5v5H7z" fill="#fff" />
    </svg>
  );
}
function KakaoMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
      <rect width="24" height="24" rx="5" fill="#ffe500" />
      <path d="M12 6c-3.6 0-6.5 2.3-6.5 5.1 0 1.8 1.2 3.4 3 4.3l-.7 2.6c-.1.2.2.4.4.3l3-2c.3 0 .5.1.8.1 3.6 0 6.5-2.3 6.5-5.1S15.6 6 12 6z" fill="#3c1e1e" />
    </svg>
  );
}
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
      <path d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z" fill="#FBBC05" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5L6.4 10c.8-2.3 3-4 5.6-4z" fill="#EA4335" />
    </svg>
  );
}
// 라벨로 마크 선택
const mapMark = (label: string) => (label.includes("네이버") ? NaverMark : label.includes("카카오") ? KakaoMark : GoogleMark);

export async function SiteFooter() {
  const clinic = await getClinic();
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-700">
      <Container size="4xl" className="grid gap-10 py-14 md:py-16 lg:grid-cols-3 lg:pl-16 lg:pr-8 xl:pl-28 xl:pr-16">
        {/* 1열: 로고 + 주소 + 지도 링크 (왼쪽) */}
        <div className="lg:w-80 lg:justify-self-start">
          <Image src="/logo.png" alt={clinic.name} width={181} height={56} className="h-9 w-auto" />
          <p className="mt-5 flex items-start gap-2 text-sm text-neutral-600 md:text-base">
            <IconMapPin className="mt-0.5 size-4 shrink-0 text-neutral-400" />
            {clinic.address}
          </p>
          <div className="mt-3 flex flex-nowrap gap-1.5">
            {clinic.mapLinks.map((m) => {
              const Mark = mapMark(m.label);
              return (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[11px] border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-primary hover:text-primary"
                >
                  <Mark />
                  {m.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* 2열: 진료시간 (정중앙) */}
        <div className="lg:justify-self-center">
          <h2 className="flex h-9 items-center text-sm font-bold text-neutral-900 md:text-base">진료시간</h2>
          <ul className="mt-4 space-y-1.5 text-sm md:text-base">
            {clinic.hours.map((h) => (
              <li key={h.label} className="flex gap-4">
                <span className="w-20 shrink-0 text-neutral-500">{h.label}</span>
                <span className="font-medium text-neutral-800">{h.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3열: 상담·예약 (오른쪽) */}
        <div className="lg:w-80 lg:justify-self-end">
          <h2 className="flex h-9 items-center text-sm font-bold text-neutral-900 md:text-base">상담·예약</h2>
          <a
            href={clinic.consultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-[11px] bg-[#03c75a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#02b04f] md:text-base"
          >
            <IconMessageCircle className="size-5" />
            네이버 톡톡
          </a>
          <a href={tel} className="mt-3 flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-primary md:text-xl">
            <IconPhone className="size-5 text-primary" />
            {clinic.phone}
          </a>
        </div>
      </Container>

      {/* 하단 바: 법적 링크 + 저작권 */}
      <div className="border-t border-neutral-200">
        <Container size="4xl" className="flex flex-col items-center gap-3 py-5 text-sm text-neutral-500 md:flex-row md:justify-between">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {clinic.legalLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p>© 2026 {clinic.name}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}

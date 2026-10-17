// 메인 페이지 "출처" 블록. 접힌 <details> 안에 참고 링크 목록.
// 레퍼런스: 요약 섹션 맨 아래 details (summary "출처 (n)")
import { getClinic } from "@/lib/payload";
import type { ClinicInfo } from "@/lib/types";

type Source = { label: string; href: string };

// Payload 'home' 글로벌의 출처가 비어 있을 때의 기본값: 공식 홈페이지 + 홈페이지 사이트맵(병원소개/의료진소개/클리닉 페이지)
const defaultSources = (clinic: ClinicInfo): Source[] => [
  { label: `${clinic.name} 공식 홈페이지`, href: clinic.homepageUrl },
  ...clinic.homepageMenu
    .filter((m) => ["병원소개", "의료진소개"].includes(m.label) || m.label.endsWith("클리닉"))
    .map((m) => ({ label: `${clinic.name} ${m.label}`, href: m.href })),
];

type Props = { sources?: Source[] }; // HomeContent.sources

export async function SourcesSection({ sources: sourcesProp }: Props) {
  const clinic = await getClinic();
  const sources = sourcesProp && sourcesProp.length > 0 ? sourcesProp : defaultSources(clinic);
  if (sources.length === 0) return null;

  return (
    <details className="mt-4 rounded-lg border border-neutral-200 px-4 py-3 md:px-6">
      <summary className="cursor-pointer text-sm font-semibold text-neutral-700">출처 ({sources.length})</summary>
      <ul className="mt-3 space-y-1 text-sm">
        {sources.map((s) => (
          <li key={`${s.label}-${s.href}`}>
            {/* 레퍼런스: 밑줄 링크, hover 시 primary 색 */}
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-neutral-600 underline underline-offset-2 hover:text-primary">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

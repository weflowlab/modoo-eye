// 메인 페이지 "출처" 블록. 접힌 <details> 안에 참고 링크 목록.
// 레퍼런스: 요약 섹션 맨 아래 details (summary "출처 (n)")
import { clinic } from "@/lib/mock";

// 병원 단위 출처. 문구/링크는 플레이스홀더.
const sources = [
  { label: `${clinic.name} 공식 홈페이지`, href: clinic.homepageUrl },
  { label: `${clinic.name} 병원·의료진 소개`, href: "#" },
  { label: "질환 안내 1", href: "#" },
  { label: "질환 안내 2", href: "#" },
  { label: "질환 안내 3", href: "#" },
];

export function SourcesSection() {
  return (
    <details className="mt-4 rounded-lg border border-neutral-200 px-4 py-3 md:px-6">
      <summary className="cursor-pointer text-sm font-semibold text-neutral-700">출처 ({sources.length})</summary>
      <ul className="mt-3 space-y-1 text-sm">
        {sources.map((s) => (
          <li key={s.label}>
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

// 의료진 상세 왼쪽 프로필 영역: 사진(4:5) + 이름/직함 + 전문분야 배지 + 섹션 목차.
// 모바일에서는 본문 위에 전체 폭, lg 이상에서는 왼쪽 25rem 고정폭 sticky.
import type { Doctor } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";
import { Badge } from "@/components/ui/Badge";
import { DoctorSectionNav, type SectionNavItem } from "./DoctorSectionNav";

type Props = { doctor: Doctor; sections: SectionNavItem[] };

export function DoctorProfile({ doctor, sections }: Props) {
  return (
    // 레퍼런스: lg:w-100 lg:sticky lg:top-24
    <aside className="w-full lg:w-100 lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
      {/* 프로필 사진 (레퍼런스: padding-bottom 125% = 4:5) */}
      <div className="relative w-full overflow-hidden rounded-[4px] bg-muted">
        {doctor.photo ? (
          <div className="relative aspect-[4/5] w-full">
            <MediaImage image={doctor.photo} sizes="(min-width: 1024px) 400px, 100vw" priority />
          </div>
        ) : (
          <Placeholder label={`${doctor.name} 프로필`} className="aspect-[4/5] w-full" />
        )}
      </div>

      {/* 이름 + 직함 + 배지 */}
      <div className="mt-4 flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-neutral-800 md:text-3xl">{doctor.name}</h1>
          <span className="text-lg text-neutral-400 font-medium">{doctor.title}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {doctor.specialties.map((s) => (
            <Badge key={s} className="rounded-[2px] bg-neutral-800 text-white py-1 px-3 text-xs md:text-sm h-auto">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* 섹션 목차 (lg 이상) */}
      <DoctorSectionNav items={sections} />
    </aside>
  );
}

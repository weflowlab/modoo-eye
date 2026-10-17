// 의료진 카드(공통). 메인 의료진 슬라이더와 /doctors 목록에서 사용.
// 사진 → 이름+직함 → 전문분야 배지 → 한 줄 소개. 클릭 시 /doctors/[slug].
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";
import { Badge } from "@/components/ui/Badge";

type Props = { doctor: Doctor; className?: string };

export function DoctorCard({ doctor, className = "" }: Props) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className={`group block ${className}`}>
      {/* 레퍼런스: 1:1 비율, rounded-[4px], hover 시 사진 1.05배 확대 */}
      <div className="relative w-full overflow-hidden rounded-[4px] bg-muted">
        {doctor.photo ? (
          <div className="relative aspect-square w-full">
            <MediaImage
              image={doctor.photo}
              sizes="(min-width: 1024px) 320px, 50vw"
              className="transition-transform duration-300 group-hover:scale-[1.05]"
            />
          </div>
        ) : (
          <Placeholder
            label={`${doctor.name} 프로필`}
            className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.05]"
          />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {/* 이름 + 직함 (hover 시 이름이 primary 색으로) */}
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-semibold text-neutral-800 md:text-2xl group-hover:text-primary transition-colors duration-300">
            {doctor.name}
          </h3>
          <span className="text-base md:text-xl text-neutral-400 font-medium">{doctor.title}</span>
        </div>

        {/* 전문분야 배지 — 레퍼런스: rounded-[2px] bg-neutral-800 text-white py-1 px-3 */}
        <div className="flex flex-wrap gap-1">
          {doctor.specialties.map((s) => (
            <Badge key={s} className="rounded-[2px] bg-neutral-800 text-white py-1 px-3 text-xs md:text-sm h-auto">
              {s}
            </Badge>
          ))}
        </div>

        {/* 한 줄 소개 (3줄 말줄임) */}
        <p className="line-clamp-3 text-sm text-neutral-600 md:text-base mt-2">{doctor.bio}</p>
      </div>
    </Link>
  );
}

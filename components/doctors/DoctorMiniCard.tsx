// 의료진 상세 하단 "의료진 더보기" 슬라이더용 작은 카드. DoctorCard 보다 글자/배지가 작고 소개문이 없다.
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = { doctor: Doctor };

export function DoctorMiniCard({ doctor }: Props) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className="group block">
      {/* 레퍼런스: 1:1 사진, hover 확대 */}
      <div className="relative w-full overflow-hidden rounded-[4px] bg-muted">
        {doctor.photo ? (
          <div className="relative aspect-square w-full">
            <MediaImage
              image={doctor.photo}
              sizes="(min-width: 768px) 33vw, 80vw"
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
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-semibold text-neutral-800 md:text-lg group-hover:text-primary transition-colors">
            {doctor.name}
          </h3>
          <span className="text-sm text-neutral-400 font-medium md:text-base">{doctor.title}</span>
        </div>
        {/* 레퍼런스: 작은 배지 px-2 py-1 text-xs */}
        <div className="mt-1 flex flex-wrap gap-1">
          {doctor.specialties.map((s) => (
            <span
              key={s}
              className="inline-flex w-fit items-center rounded-[2px] bg-neutral-800 px-2 py-1 text-xs font-medium text-white"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

// 글 하단 작성자(의료진) 프로필 카드. 해시태그 아래에 배치. 카드 전체가 의료진 상세로 가는 링크.
// 레퍼런스: 정사각 사진(216px) + "이름 직함 프로필 소개" + 한 줄 소개, 모바일 세로 / md 이상 가로, hover 시 테두리 강조.
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = { doctor: Doctor; className?: string };

export function AuthorCard({ doctor, className = "" }: Props) {
  return (
    <Link
      href={`/doctors/${doctor.slug}`}
      className={`mt-7 flex flex-col gap-8 border border-neutral-200 bg-background p-4 transition-all duration-300 hover:border-primary md:flex-row md:p-8 ${className}`}
    >
      {/* 레퍼런스: w-54(13.5rem) 정사각, rounded-sm, 회색 바탕 */}
      <div className="relative w-54 shrink-0">
        {doctor.photo ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-neutral-300">
            <MediaImage image={doctor.photo} sizes="216px" />
          </div>
        ) : (
          <Placeholder label={`${doctor.name} 프로필`} className="aspect-square w-full rounded-sm bg-neutral-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-bold text-foreground">
          {doctor.name} {doctor.title} 프로필 소개
        </p>
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{doctor.bio}</p>
      </div>
    </Link>
  );
}

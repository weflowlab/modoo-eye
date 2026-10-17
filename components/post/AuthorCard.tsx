// 글 하단 작성자(의료진) 프로필 카드. 해시태그 아래에 배치.
// 의료진 별도 페이지는 두지 않으므로(고객 요청) 링크 없이 정보만 보여준다. 전문 분야 배지 + 한 줄 소개.
// 레퍼런스: 정사각 사진(216px) + "이름 직함 프로필 소개" + 한 줄 소개, 모바일 세로 / md 이상 가로.
import type { Doctor } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";
import { Badge } from "@/components/ui/Badge";

type Props = { doctor: Doctor; className?: string };

export function AuthorCard({ doctor, className = "" }: Props) {
  return (
    <section
      aria-label="작성자 소개"
      className={`mt-7 flex flex-col gap-8 border border-neutral-200 bg-background p-4 md:flex-row md:p-8 ${className}`}
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
        <p className="text-sm font-medium text-muted-foreground">이 글을 쓴 의료진</p>
        <p className="mt-1 text-xl font-bold text-foreground">
          {doctor.name} {doctor.title}
        </p>
        {/* 전문 분야 배지 */}
        {doctor.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        )}
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{doctor.bio}</p>
      </div>
    </section>
  );
}

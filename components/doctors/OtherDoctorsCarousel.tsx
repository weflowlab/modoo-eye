// 의료진 상세 "의료진 더보기" 섹션: 현재 의료진을 제외한 나머지를 작은 카드 슬라이더로 표시.
import type { Doctor } from "@/lib/types";
import { DoctorMiniCard } from "./DoctorMiniCard";
import { CardCarousel } from "./CardCarousel";

type Props = { doctors: Doctor[] };

export function OtherDoctorsCarousel({ doctors }: Props) {
  return (
    <section id="other-doctors" className="scroll-mt-24">
      <CardCarousel
        title="의료진 더보기"
        emptyText="등록된 의료진이 없습니다."
        items={doctors.map((d) => (
          <DoctorMiniCard key={d.slug} doctor={d} />
        ))}
      />
    </section>
  );
}

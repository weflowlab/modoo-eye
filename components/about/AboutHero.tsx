// About 페이지 상단 대형 이미지(8:3). 병원 전경/대표 이미지 자리.
import { Placeholder } from "@/components/ui/Placeholder";

export function AboutHero() {
  return (
    // 레퍼런스: aspect-[8/3] rounded-md bg-muted
    <div className="relative w-full overflow-hidden rounded-md bg-muted">
      <Placeholder label="About 대표 이미지" className="aspect-[8/3] w-full" />
    </div>
  );
}

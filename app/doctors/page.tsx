// /doctors — 의료진 목록. 브레드크럼 + 제목 + DoctorCard 그리드.
import type { Metadata } from "next";
import { doctors } from "@/lib/mock";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageTitle } from "@/components/posts/PageTitle";
import { DoctorCard } from "@/components/doctors/DoctorCard";

export const metadata: Metadata = { title: "의료진" };

export default function DoctorsPage() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb className="mb-4" items={[{ label: "홈", href: "/" }, { label: "의료진" }]} />

      {/* 제목: 아래에서 올라오는 등장 애니메이션 */}
      <PageTitle title="의료진" />

      {/* 레퍼런스: 1열 → sm 2열 → lg 4열, 세로 간격 3rem */}
      <div className="mt-10 md:mt-14">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d) => (
            <DoctorCard key={d.slug} doctor={d} />
          ))}
        </div>
      </div>
    </div>
  );
}

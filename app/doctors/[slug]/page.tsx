// /doctors/[slug] — 의료진 상세. 왼쪽 프로필(sticky) + 오른쪽 연혁/진료 이야기/관련 콘텐츠/의료진 더보기.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { doctors, getDoctor, posts } from "@/lib/mock";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DoctorProfile } from "@/components/doctors/DoctorProfile";
import { DoctorCareer } from "@/components/doctors/DoctorCareer";
import { DoctorStory } from "@/components/doctors/DoctorStory";
import { DoctorRelatedArticles } from "@/components/doctors/DoctorRelatedArticles";
import { OtherDoctorsCarousel } from "@/components/doctors/OtherDoctorsCarousel";

// 목 데이터의 의료진 slug 를 빌드 시 미리 생성
export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/doctors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) return { title: "의료진" };
  return {
    title: `${doctor.name} ${doctor.title}`,
    description: `${doctor.name} ${doctor.title} — 전문분야: ${doctor.specialties.join(", ")}. ${doctor.bio}`,
  };
}

// params 를 최상위에서 읽어 없는 의료진은 진짜 404 상태코드를 돌려준다 (SEO). instant 검증(개발 경고)만 끔.
export const instant = false;

export default async function DoctorDetailPage({ params }: PageProps<"/doctors/[slug]">) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) notFound();

  // 이 의료진이 쓴 글 / 나머지 의료진
  const authored = posts.filter((p) => p.author === slug);
  const others = doctors.filter((d) => d.slug !== slug);

  // 섹션 목차: 내용이 있는 섹션만 (레퍼런스: 글이 없으면 '관련 콘텐츠' 항목 생략)
  const sections = [
    { id: "career", label: "프로필" },
    { id: "story", label: "진료 이야기" },
    ...(authored.length > 0 ? [{ id: "related-articles", label: "관련 콘텐츠" }] : []),
    ...(others.length > 0 ? [{ id: "other-doctors", label: "의료진 더보기" }] : []),
  ];

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb
        className="mb-6"
        items={[{ label: "홈", href: "/" }, { label: "의료진", href: "/doctors" }, { label: doctor.name }]}
      />

      {/* 모바일: 프로필 위 / 본문 아래. lg 이상: 좌우 배치, 간격 6.25rem (레퍼런스 lg:gap-x-25) */}
      <div className="flex flex-col gap-y-10 lg:flex-row lg:gap-x-25">
        <DoctorProfile doctor={doctor} sections={sections} />

        <div className="flex min-w-0 flex-1 flex-col gap-y-16 md:gap-y-24">
          <DoctorCareer doctor={doctor} />
          <DoctorStory doctor={doctor} />
          {authored.length > 0 && <DoctorRelatedArticles posts={authored} />}
          {others.length > 0 && <OtherDoctorsCarousel doctors={others} />}
        </div>
      </div>
    </div>
  );
}

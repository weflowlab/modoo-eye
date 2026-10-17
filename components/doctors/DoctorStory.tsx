// 의료진 상세 "진료 이야기" 섹션. 의료진이 전하는 인사말을 본문 스타일(prose-content)로 표시.
import type { Doctor } from "@/lib/types";
import { DoctorSectionTitle } from "./DoctorSectionTitle";
import { RichTextContent } from "@/components/post/RichTextContent";

type Props = { doctor: Doctor };

// Payload 의 "진료 이야기" 리치텍스트가 비어 있을 때 쓰는 플레이스홀더 문단
const STORY_PLACEHOLDER = [
  "진료 이야기 문단 플레이스홀더입니다. 환자마다 눈의 상태와 생활환경이 다른 만큼 검사 결과를 세밀하게 살피고 현재 상태에 맞는 진료 방향을 안내합니다.",
  "진료 이야기 문단 플레이스홀더입니다. 꾸준한 연구와 진료 경험을 토대로 신뢰할 수 있는 진료를 이어가겠습니다.",
];

// 리치텍스트에 실제 내용(자식 노드)이 있는지
function hasStory(story: unknown): boolean {
  const root = (story as { root?: { children?: unknown[] } } | undefined)?.root;
  return !!root?.children?.length;
}

export function DoctorStory({ doctor }: Props) {
  return (
    <section id="story" className="scroll-mt-24">
      <DoctorSectionTitle>
        {doctor.name} {doctor.title}이 전하는 진료 이야기
      </DoctorSectionTitle>
      <div className="flex flex-col gap-y-10 mt-6 md:mt-8">
        {/* 레퍼런스: prose-content text-base md:text-lg */}
        <div className="prose-content text-base md:text-lg">
          {/* 관리자가 쓴 진료 이야기(리치텍스트)가 있으면 그걸, 없으면 한 줄 소개 + 플레이스홀더 */}
          {hasStory(doctor.story) ? (
            <RichTextContent content={doctor.story} />
          ) : (
            <>
              <p>{doctor.bio}</p>
              {STORY_PLACEHOLDER.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

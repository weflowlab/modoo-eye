// 글 상세 본문. prose-content 래퍼 안에 상단 슬라이드 → 리드 문단 → 섹션(h2 + HTML) → FAQ 순으로 렌더.
// 섹션 중간에 레퍼런스 위치(1번 섹션 끝 자가진단 격자 사진, 3번 섹션 끝 치료 전후 비교)에 이미지 자리표시를 넣는다.
import type { Post } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { Badge } from "@/components/ui/Badge";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PostImageSlider } from "./PostImageSlider";

export const FAQ_SECTION_ID = "faq";

type Props = { post: Post };

// 캡션 있는 단일 이미지 (레퍼런스: kmac-figure — 12px 모서리, 테두리, 아래 가운데 캡션)
function CaptionedFigure({ label, caption }: { label: string; caption: string }) {
  return (
    <figure className="my-6">
      <Placeholder label={label} className="aspect-[16/9] w-full rounded-[12px] border border-border" />
      <figcaption className="mt-2.5 text-center text-sm text-neutral-500">{caption}</figcaption>
    </figure>
  );
}

// 치료 전후 비교 2단 카드 (레퍼런스: kmac-duo — 모바일 1열, 데스크톱 2열, 카드 안 이미지 + 태그 + 설명)
function BeforeAfter() {
  const cards = [
    { tag: "치료 전", label: "치료 전 망막 단면", text: "치료 전 망막 상태 설명 플레이스홀더입니다." },
    { tag: "치료 후", label: "치료 후 망막 단면", text: "치료 후 변화 설명 플레이스홀더입니다. 반응 정도는 개인차가 있습니다." },
  ];
  return (
    <>
      <div className="my-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.tag} className="rounded-[12px] border border-border bg-white p-5">
            <Placeholder label={c.label} className="mb-3.5 aspect-[4/3] w-full rounded-lg" />
            <Badge className="mb-2">{c.tag}</Badge>
            <p className="m-0! text-[15.5px] leading-[1.75]">{c.text}</p>
          </div>
        ))}
      </div>
      <p className="text-[14.5px] leading-[1.7] text-neutral-500">
        위 이미지는 치료 경과 이해를 돕기 위한 예시이며, 모든 환자에게 동일한 결과가 나타나는 것은 아닙니다.
      </p>
    </>
  );
}

export function PostBody({ post }: Props) {
  return (
    <div className="prose-content mt-8">
      {/* 본문 상단 이미지 슬라이드 */}
      <PostImageSlider />

      {/* 리드 문단 (레퍼런스: kmac-lead — 굵고 큰 도입 문단). 목 데이터엔 전용 필드가 없어 summary 를 사용 */}
      <p className="mb-[22px] text-[17.5px] font-semibold leading-[1.72] text-foreground md:text-xl">{post.summary}</p>

      {/* 섹션 반복: h2(id) + CMS HTML */}
      {post.sections.map((section, i) => (
        <section key={section.id} className="mt-[42px] md:mt-[52px]">
          <h2 id={section.id}>{section.heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.html }} />
          {/* 레퍼런스 위치: 01 섹션 끝 자가진단 격자(안저) 사진, 03 섹션 끝 치료 전후 비교 */}
          {i === 0 && (
            <CaptionedFigure label="안저 사진 (자가진단 격자)" caption="자가검사 안내 – 한쪽 눈씩 가리고 중앙 점을 응시합니다" />
          )}
          {i === 2 && <BeforeAfter />}
        </section>
      ))}

      {/* FAQ: 레퍼런스는 본문 마지막 번호 섹션(06) 으로 배치 */}
      <section className="mt-[42px] md:mt-[52px]">
        <h2 id={FAQ_SECTION_ID}>자주 묻는 질문</h2>
        <FaqAccordion items={post.faq} className="mt-[22px]" />
      </section>
    </div>
  );
}

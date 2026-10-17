// 글 상세 본문. prose-content 래퍼 안에 상단 슬라이드 → 리드 문단 → 본문 → FAQ 순으로 렌더.
// 본문은 Payload 리치텍스트(post.content)가 있으면 RichTextContent 로, 없으면(목 데이터) sections HTML 로 그린다.
import type { Post } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { Badge } from "@/components/ui/Badge";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PostImageSlider } from "./PostImageSlider";
import { RichTextContent } from "./RichTextContent";

export const FAQ_SECTION_ID = "faq";

type Props = { post: Post };

// 캡션 있는 단일 이미지 자리표시 (목 데이터 전용. 레퍼런스: kmac-figure)
function CaptionedFigure({ label, caption }: { label: string; caption: string }) {
  return (
    <figure className="my-6">
      <Placeholder label={label} className="aspect-[16/9] w-full rounded-[12px] border border-border" />
      <figcaption className="mt-2.5 text-center text-sm text-neutral-500">{caption}</figcaption>
    </figure>
  );
}

// 치료 전후 비교 2단 카드 자리표시 (목 데이터 전용. 레퍼런스: kmac-duo)
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

// 목 데이터(sections HTML) 렌더
function SectionsBody({ post }: Props) {
  return post.sections.map((section, i) => (
    <section key={section.id} className="mt-[42px] md:mt-[52px]">
      <h2 id={section.id}>{section.heading}</h2>
      <div dangerouslySetInnerHTML={{ __html: section.html }} />
      {i === 0 && <CaptionedFigure label="안저 사진 (자가진단 격자)" caption="자가검사 안내 – 한쪽 눈씩 가리고 중앙 점을 응시합니다" />}
      {i === 2 && <BeforeAfter />}
    </section>
  ));
}

export function PostBody({ post }: Props) {
  return (
    <div className="prose-content mt-8">
      {/* 본문 상단 이미지 슬라이드 (CMS 이미지 없으면 자리표시) */}
      <PostImageSlider images={post.images} />

      {/* 리드 문단 (레퍼런스: kmac-lead — 굵고 큰 도입 문단). 요약을 그대로 사용 */}
      <p className="mb-[22px] text-[17.5px] font-semibold leading-[1.72] text-foreground md:text-xl">{post.summary}</p>

      {/* 본문: Payload 리치텍스트 우선, 없으면 섹션 HTML */}
      {post.content ? (
        <div className="mt-[42px] md:mt-[52px]">
          <RichTextContent content={post.content} />
        </div>
      ) : (
        <SectionsBody post={post} />
      )}

      {/* FAQ: 레퍼런스는 본문 마지막 번호 섹션으로 배치 */}
      {post.faq.length > 0 && (
        <section className="mt-[42px] md:mt-[52px]">
          <h2 id={FAQ_SECTION_ID}>자주 묻는 질문</h2>
          <FaqAccordion items={post.faq} className="mt-[22px]" />
        </section>
      )}
    </div>
  );
}

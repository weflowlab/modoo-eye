// 의료진 상세 "관련 콘텐츠" 섹션: 이 의료진이 쓴 글을 카드 슬라이더로 표시.
import type { Post } from "@/lib/types";
import { PostCard } from "@/components/posts/PostCard";
import { CardCarousel } from "./CardCarousel";

type Props = { posts: Post[] };

export function DoctorRelatedArticles({ posts }: Props) {
  return (
    <section id="related-articles" className="scroll-mt-24">
      <CardCarousel
        title="관련 콘텐츠"
        emptyText="관련 콘텐츠가 없습니다."
        items={posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      />
    </section>
  );
}

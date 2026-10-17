// 글 카드 공통 컴포넌트. 카테고리/전체글 그리드, 메인 인기글(rank)·최신글, 글 상세 관련글 등 모든 글 목록에서 사용.
// rank 가 있으면 레퍼런스 "가장 많이 읽은 글" 카드(모바일 세로 / md 이상 가로 + 요약) 레이아웃으로 렌더.
import Link from "next/link";
import type { Post } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = {
  post: Post;
  rank?: number; // 인기글 순위 (1부터)
  showSummary?: boolean; // 요약 1~2줄 표시
  className?: string;
};

export function PostCard({ post, rank, showSummary = false, className = "" }: Props) {
  const href = `/${post.category}/${post.slug}`;

  // 순위 카드: 레퍼런스 메인 인기글 (모바일 세로형, md 이상 가로형)
  if (rank !== undefined) {
    return (
      <>
        {/* 모바일: 썸네일 위 + 순위 배지 + 제목 */}
        <Link href={href} className={`group block md:hidden ${className}`}>
          <Thumb post={post} rounded="rounded-[4px]" hover="transition-transform duration-300 group-hover:scale-[1.08]" />
          <div className="mt-4 flex flex-col gap-2">
            <RankBadge rank={rank} size="sm" />
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-neutral-800">{post.title}</h3>
          </div>
        </Link>
        {/* md 이상: 썸네일 46% 폭 + 오른쪽 순위/제목/요약 (레퍼런스: gap-[5%], min-w-[240px]) */}
        <Link href={href} className={`group hidden gap-[5%] md:flex ${className}`}>
          <div className="relative w-[46%] min-w-[240px] shrink-0">
            <Thumb post={post} rounded="rounded-[4px]" hover="transition-transform duration-300 group-hover:scale-[1.08]" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-start gap-2.5 pt-6">
            <RankBadge rank={rank} size="md" />
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-800 transition-colors duration-300 group-hover:text-primary sm:text-xl">
              {post.title}
            </h3>
            {showSummary && <p className="line-clamp-1 text-lg text-neutral-600">{post.summary}</p>}
          </div>
        </Link>
      </>
    );
  }

  // 기본 카드: 레퍼런스 카테고리/전체글 그리드 카드 (정사각 썸네일 + 제목 2줄)
  return (
    <Link href={href} className={`group block ${className}`}>
      <Thumb post={post} rounded="rounded-xs" hover="transition group-hover:scale-[1.02]" />
      <div className="mt-3">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{post.title}</h3>
        {showSummary && <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{post.summary}</p>}
      </div>
    </Link>
  );
}

// 정사각 썸네일 (레퍼런스: aspect-ratio 래퍼 padding-bottom:100% + overflow-hidden). 썸네일이 있으면 이미지, 없으면 Placeholder.
function Thumb({ post, rounded, hover }: { post: Post; rounded: string; hover: string }) {
  return (
    <div className="relative w-full pb-[100%]">
      <div className={`absolute inset-0 overflow-hidden bg-muted ${rounded}`}>
        {post.thumbnail ? (
          <MediaImage image={post.thumbnail} sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw" className={hover} />
        ) : (
          <Placeholder label={`썸네일 · ${post.title}`} className={`h-full w-full ${hover}`} />
        )}
      </div>
    </div>
  );
}

// 순위 배지 (레퍼런스: 검정 원형, 모바일 size-6 / 데스크톱 size-7)
function RankBadge({ rank, size }: { rank: number; size: "sm" | "md" }) {
  const cls = size === "sm" ? "size-6 text-xs" : "size-7 text-sm";
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-neutral-900 font-semibold text-white ${cls}`}
      aria-label={`${rank}위`}
    >
      {rank}
    </span>
  );
}

// 404 페이지. 존재하지 않는 카테고리/글/경로에서 표시. (레퍼런스 404 는 클라이언트 렌더라 마크업 없음 → 검색 결과 없음 상태와 같은 스타일로 구성)
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-20">
      <div className="flex flex-col items-center gap-7.5 py-12 text-center md:py-20">
        <div className="flex flex-col gap-1 text-xl font-semibold leading-snug text-neutral-800 md:text-3xl">
          <p>
            <span className="text-brand-primary">404</span>
            <span> 페이지를 찾을 수 없습니다.</span>
          </p>
          <p>다른 이야기도 살펴볼까요?</p>
        </div>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-7 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-primary hover:text-primary-foreground md:text-lg"
        >
          다른 이야기 보러가기
          <IconArrowRight className="size-5" />
        </Link>
      </div>
    </div>
  );
}

// 글 목록 빈 상태. 카테고리/전체글 페이지에서 글이 0건일 때 (시드 전·발행 글 없음) 표시.
type Props = { message?: string; className?: string };

export function EmptyPosts({ message = "아직 등록된 글이 없습니다.", className = "" }: Props) {
  return (
    <p className={`py-16 text-center text-base text-muted-foreground md:py-24 md:text-lg ${className}`}>{message}</p>
  );
}

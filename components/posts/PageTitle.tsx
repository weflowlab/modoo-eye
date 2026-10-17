// 목록 페이지 제목 (h1). 카테고리/전체글보기 상단에서 사용. 레퍼런스의 아래에서 올라오는 등장 애니메이션 포함.
type Props = { title: string; className?: string };

export function PageTitle({ title, className = "" }: Props) {
  return (
    // 레퍼런스: overflow-hidden 안에서 animate-reveal-up (0.6s)
    <div className={`overflow-hidden ${className}`}>
      <div className="animate-reveal-up" style={{ animationDelay: "0s", animationDuration: "0.6s" }}>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      </div>
    </div>
  );
}

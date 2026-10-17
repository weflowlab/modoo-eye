// 이미지 자리표시 컴포넌트. 실제 이미지 연결 전까지 모든 이미지는 이걸로 표시.
// label 에 "어떤 이미지가 들어갈 자리인지" 적는다. (예: "배너 1", "의료진 프로필")
type Props = {
  label: string;
  className?: string; // 크기/비율/모서리는 호출부에서 지정 (예: "aspect-[16/9] rounded-m")
};

export function Placeholder({ label, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={`${label} 이미지 자리`}
      className={`flex items-center justify-center bg-neutral-200 text-neutral-500 text-sm select-none overflow-hidden ${className}`}
    >
      <span className="px-3 text-center leading-snug">
        🖼 {label}
      </span>
    </div>
  );
}

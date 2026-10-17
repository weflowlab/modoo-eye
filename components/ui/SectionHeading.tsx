// 섹션 제목 블록. 홈의 "의료진 소개", "가장 많이 읽은 글" 등 섹션 상단에 사용.
// title 안의 **텍스트** 는 브랜드색 강조(span.text-brand-primary) 로 렌더 (레퍼런스 uiStrings 패턴과 동일).
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

// "**강조**" 구문을 브랜드색 span 으로 변환
function renderTitle(title: string): ReactNode[] {
  return title.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <span key={i} className="text-brand-primary">
        {part.slice(2, -2)}
      </span>
    ) : (
      part
    ),
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left", className = "" }: Props) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col ${alignCls} ${className}`}>
      {/* 작은 라벨 (레퍼런스에는 없음 — 옵션) */}
      {eyebrow && <p className="mb-2 text-sm font-semibold text-brand-primary md:text-base">{eyebrow}</p>}
      {/* 레퍼런스: overflow-hidden + 아래에서 올라오는 reveal 애니메이션, h2 text-xl md:text-3xl lg:text-4xl */}
      <div className="overflow-hidden">
        <h2 className="animate-reveal-up text-xl font-bold leading-tight md:text-3xl lg:text-4xl">
          {renderTitle(title)}
        </h2>
      </div>
      {description && (
        <div className="overflow-hidden">
          {/* 레퍼런스: mt-4 text-sm text-neutral-600 md:text-xl */}
          <p className="animate-reveal-up mt-4 text-sm text-neutral-600 md:text-xl" style={{ animationDelay: "0.15s" }}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

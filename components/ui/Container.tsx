// 페이지 가로폭 래퍼. 레퍼런스의 Container(size) 와 동일한 클래스. 모든 섹션/헤더/푸터에서 사용.
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  size?: "2xl" | "3xl" | "4xl";
};

// 레퍼런스: mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-{size}
const sizeClass = {
  "2xl": "max-w-site-2xl",
  "3xl": "max-w-site-3xl",
  "4xl": "max-w-site-4xl",
};

export function Container({ children, className = "", size = "4xl" }: Props) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClass[size]} ${className}`}>
      {children}
    </div>
  );
}

// 문구 안의 "|" 를 모바일(md 미만)에서만 줄바꿈으로 바꿔 준다. 실제 줄바꿈(\n)은 모든 화면에서 유지(whitespace-pre-line).
// 예: "대전 둔산동|망막·녹내장·백내장 전문 안과" → 모바일 두 줄, 데스크톱 한 줄("대전 둔산동 망막·…"처럼 띄어쓰기 유지)
import { Fragment } from "react";

export function MobileBreaks({ text }: { text: string }) {
  const parts = text.split("|");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {/* 데스크톱에서 br이 숨겨져도 앞뒤 글이 붙지 않게 공백을 둠 (줄 끝 공백은 모바일에서 보이지 않음) */}
          {i < parts.length - 1 && (
            <>
              {" "}
              <br className="md:hidden" />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
}

// 문자열에서 모바일 줄바꿈 표시("|")를 공백으로 (타이핑 효과 등 순수 문자열이 필요할 때)
export const stripMobileBreaks = (text: string) => text.replace(/\s*\|\s*/g, " ");

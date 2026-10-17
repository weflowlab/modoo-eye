"use client";
// 글 제목 오른쪽의 공유 / 링크 복사 원형 버튼 2개. 글 상세 헤더에서 사용.
// 레퍼런스: 40px 원형, 연회색 배경, hover 시 강조색 배경 + 흰 아이콘.
import { useState } from "react";
import { IconLink, IconShare } from "@tabler/icons-react";

type Props = { title: string };

const buttonClass =
  "group inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 hover:bg-primary";
const iconClass = "size-4 text-neutral-700 transition-colors group-hover:text-white";

export function ShareButtons({ title }: Props) {
  const [copied, setCopied] = useState(false);

  // 현재 주소를 클립보드에 복사하고 잠시 안내 문구 표시
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 클립보드 권한이 없으면 조용히 무시 */
    }
  };

  // 공유: Web Share API 가 있으면 사용, 없으면 링크 복사로 대체
  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        /* 사용자가 취소한 경우 */
      }
      return;
    }
    copyLink();
  };

  return (
    <div className="relative flex items-center gap-2">
      <button type="button" aria-label="공유" onClick={share} className={buttonClass}>
        <IconShare className={iconClass} stroke={1.75} />
      </button>
      <button type="button" aria-label="링크 복사" onClick={copyLink} className={buttonClass}>
        <IconLink className={iconClass} stroke={1.75} />
      </button>
      {/* 복사 완료 안내 (짧게 표시) */}
      <span
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1 text-xs text-white transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        링크가 복사되었습니다
      </span>
    </div>
  );
}

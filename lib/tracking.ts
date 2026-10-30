// 방문 추적 공용 로직 (서버·관리자 집계가 같이 쓴다). 브라우저 쪽은 components/PageTracker.tsx.
// 유입 소스 판별 순서: UTM(utm_source) → 인앱 브라우저(User-Agent) → 리퍼러 도메인 → 직접 방문.

export type Device = "mobile" | "tablet" | "desktop";

/** User-Agent → 기기 */
export function detectDevice(ua: string): Device {
  const s = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobile|iphone|ipod|android/.test(s)) return "mobile";
  return "desktop";
}

/** 검색엔진·SNS 봇은 세지 않는다 */
export function isBot(ua: string): boolean {
  return /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|headless|lighthouse|yeti|kakaotalk-scrap/i.test(ua);
}

/** 인앱 브라우저는 리퍼러를 숨기므로 User-Agent 로 어디서 열렸는지 본다 */
export function detectAppSource(ua: string): string {
  const s = ua.toLowerCase();
  if (s.includes("barcelona")) return "threads";
  if (s.includes("instagram")) return "instagram";
  if (/fban|fbav|fb_iab|fbios/.test(s)) return "facebook";
  if (s.includes("kakaotalk")) return "kakao";
  if (/\bband\//.test(s)) return "band";
  if (s.includes("naver")) return "naver";
  if (/line\//.test(s)) return "line";
  if (s.includes("daumapps")) return "daum";
  return "";
}

/** 리퍼러 도메인 → 유입 소스 이름. 우리 사이트 안 이동이면 direct */
export function normalizeSource(referrer: string, ownHost: string): string {
  if (!referrer) return "direct";
  let h = "";
  try {
    h = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  const own = ownHost.split(":")[0].toLowerCase();
  if (own && (h === own || h.endsWith("." + own))) return "direct";
  if (h.includes("modooeye.kr")) return "homepage"; // 병원 홈페이지에서 넘어온 경우
  if (h.includes("kakao")) return "kakao";
  if (h.includes("naver")) return "naver";
  if (h.includes("threads")) return "threads";
  if (h.includes("instagram")) return "instagram";
  if (h.includes("facebook")) return "facebook";
  if (h.includes("google")) return "google";
  if (h.includes("daum")) return "daum";
  if (h.includes("bing")) return "bing";
  if (h === "t.co" || h.includes("twitter") || h.includes("x.com")) return "twitter";
  if (h.includes("youtube")) return "youtube";
  if (h.includes("chatgpt") || h.includes("openai")) return "chatgpt";
  if (h.includes("perplexity")) return "perplexity";
  return h.replace(/^www\./, "");
}

/** 관리자 화면 표기 */
export const SOURCE_LABEL: Record<string, string> = {
  direct: "직접 방문",
  homepage: "병원 홈페이지",
  naver: "네이버",
  google: "구글",
  daum: "다음",
  bing: "빙",
  kakao: "카카오",
  instagram: "인스타그램",
  facebook: "페이스북",
  threads: "스레드",
  twitter: "X(트위터)",
  youtube: "유튜브",
  band: "밴드",
  line: "라인",
  chatgpt: "ChatGPT",
  perplexity: "퍼플렉시티",
};
export const SEARCH_ENGINES = new Set(["naver", "google", "daum", "bing"]);
export const DEVICE_LABEL: Record<string, string> = { mobile: "모바일", tablet: "태블릿", desktop: "데스크톱" };
export const CLICK_LABEL: Record<string, string> = {
  tel: "전화 걸기",
  "naver-talk": "네이버 톡톡",
  kakao: "카카오채널",
  homepage: "홈페이지 바로가기",
};

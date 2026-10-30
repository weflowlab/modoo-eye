// 유입 관리 집계. 방문 기록(page-views) 배열을 받아 화면에 그릴 숫자로 바꾼다. 순수 함수라 DB 없이 테스트할 수 있다.
// 한 "방문" = sessionId (기기당 하루). 유입 소스는 그 방문의 첫 페이지 기준, 단 같은 날 광고 클릭이 있으면 광고로 센다.
import { SEARCH_ENGINES } from "./tracking";

export type PageViewRow = {
  sessionId: string;
  path: string;
  source?: string | null;
  medium?: string | null;
  keyword?: string | null;
  query?: string | null;
  device?: string | null;
  event?: string | null;
  label?: string | null;
  durationMs?: number | null;
  maxScroll?: number | null;
  createdAt: string;
};

export type PeriodKey = "today" | "7d" | "30d" | "month" | "all";
export const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "today", label: "오늘" },
  { key: "7d", label: "최근 7일" },
  { key: "30d", label: "최근 30일" },
  { key: "month", label: "이번 달" },
  { key: "all", label: "전체" },
];

const DAY = 86400000;
const KST = 9 * 3600 * 1000;
const kstDayKey = (ms: number) => new Date(ms + KST).toISOString().slice(0, 10);
const kstDayStart = (ms: number) => Math.floor((ms + KST) / DAY) * DAY - KST;

export function periodStart(key: PeriodKey, now = Date.now()): number {
  const today = kstDayStart(now);
  if (key === "today") return today;
  if (key === "7d") return today - 6 * DAY;
  if (key === "30d") return today - 29 * DAY;
  if (key === "month") {
    const d = new Date(now + KST);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - KST;
  }
  return 0;
}

type Count = Record<string, number>;
const inc = (m: Count, k: string, n = 1) => {
  m[k] = (m[k] || 0) + n;
};
const sorted = (m: Count) => Object.entries(m).sort((a, b) => b[1] - a[1]);

export type TrafficStats = {
  sessions: number;
  pageViews: number;
  mobileShare: number; // %
  bounced: number; // 한 페이지만 보고 나간 방문 수
  bounceRate: number; // %
  avgDurationSec: number;
  sources: [string, number][]; // 유입 소스별 방문 (광고는 "naver-ad" 식)
  topPaths: [string, number][]; // 많이 본 글 (페이지뷰 기준, 글 페이지만)
  pathCounts: Record<string, number>; // 글 경로별 페이지뷰 전체 (전체 글 목록용)
  exitPages: [string, number][]; // 마지막으로 보고 떠난 페이지 (방문 기준)
  landingBySearch: { source: string; rows: [string, number][] }[]; // 검색엔진별 착지 글 (방문 기준)
  queries: [string, number][]; // 블로그 안 검색어
  adKeywords: [string, number][]; // 광고 키워드별 방문
  clicks: [string, number][]; // 상담 버튼 클릭
  daily: { day: string; label: string; sessions: number }[]; // 최근 14일 방문 추이 (기간과 무관)
  devices: [string, number][];
};

/** @param isPost 글 페이지 경로인지 (많이 본 글은 글만 센다. 목록·메인은 제외) */
export function computeTrafficStats(all: PageViewRow[], period: PeriodKey, now = Date.now(), isPost: (path: string) => boolean = () => true): TrafficStats {
  const start = periodStart(period, now);
  const rows = all.filter((r) => new Date(r.createdAt).getTime() >= start);
  const views = rows.filter((r) => (r.event ?? "view") === "view");
  const clicksRows = rows.filter((r) => r.event === "click");

  // 방문(세션) 묶기 — createdAt 오름차순 가정
  const bySession = new Map<string, PageViewRow[]>();
  for (const v of views) {
    const arr = bySession.get(v.sessionId);
    if (arr) arr.push(v);
    else bySession.set(v.sessionId, [v]);
  }
  const sessions = [...bySession.values()];

  const sources: Count = {};
  const adKeywords: Count = {};
  const devices: Count = {};
  const landing: Record<string, Count> = {};
  const exits: Count = {};
  let durSum = 0;
  let durN = 0;
  let mobile = 0;
  let bounced = 0;
  for (const s of sessions) {
    const entry = s[0];
    inc(exits, s[s.length - 1].path);
    if (s.length === 1) bounced++;
    const paid = s.filter((v) => v.medium === "cpc" || v.medium === "paid");
    if (paid.length) {
      new Set(paid.map((v) => `${v.source || "ad"}-ad`)).forEach((k) => inc(sources, k));
      new Set(paid.map((v) => v.keyword).filter(Boolean)).forEach((k) => inc(adKeywords, k as string));
    } else {
      inc(sources, entry.source || "direct");
    }
    const src = entry.source || "direct";
    if (SEARCH_ENGINES.has(src)) inc((landing[src] ||= {}), entry.path);
    inc(devices, entry.device || "desktop");
    if (entry.device === "mobile") mobile++;
    const dur = s.reduce((a, v) => a + (v.durationMs || 0), 0);
    if (dur > 0) {
      durSum += dur;
      durN++;
    }
  }

  const paths: Count = {};
  const queries: Count = {};
  for (const v of views) {
    if (isPost(v.path)) inc(paths, v.path);
    if (v.query) inc(queries, v.query.trim().toLowerCase());
  }
  const clicks: Count = {};
  for (const c of clicksRows) inc(clicks, c.label || "기타");

  // 최근 14일 방문 추이 (기간 선택과 무관, 전체 데이터)
  const todayStart = kstDayStart(now);
  const daily: TrafficStats["daily"] = [];
  const dayIdx: Record<string, number> = {};
  for (let n = 13; n >= 0; n--) {
    const ms = todayStart - n * DAY;
    const key = kstDayKey(ms);
    dayIdx[key] = daily.length;
    const d = new Date(ms + KST);
    daily.push({ day: key, label: `${d.getUTCMonth() + 1}/${d.getUTCDate()}`, sessions: 0 });
  }
  const seenDay = new Set<string>();
  for (const v of all) {
    if ((v.event ?? "view") !== "view") continue;
    const key = kstDayKey(new Date(v.createdAt).getTime());
    const sk = `${key}|${v.sessionId}`;
    if (key in dayIdx && !seenDay.has(sk)) {
      seenDay.add(sk);
      daily[dayIdx[key]].sessions++;
    }
  }

  return {
    sessions: sessions.length,
    pageViews: views.length,
    mobileShare: sessions.length ? Math.round((mobile / sessions.length) * 100) : 0,
    bounced,
    bounceRate: sessions.length ? Math.round((bounced / sessions.length) * 100) : 0,
    avgDurationSec: durN ? Math.round(durSum / durN / 1000) : 0,
    sources: sorted(sources),
    topPaths: sorted(paths).slice(0, 10),
    pathCounts: paths,
    // 많이 본 글만 상위 10편, 나머지(나간 페이지·첫 번째로 연 글·검색어)는 개수 제한 없이 전부
    exitPages: sorted(exits),
    landingBySearch: Object.entries(landing)
      .sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0))
      .map(([source, m]) => ({ source, rows: sorted(m) })),
    queries: sorted(queries),
    adKeywords: sorted(adKeywords),
    clicks: sorted(clicks),
    daily,
    devices: sorted(devices),
  };
}

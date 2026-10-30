"use client";
// 방문 추적 스크립트 (프론트 레이아웃에 한 번). 페이지를 볼 때마다 /next/v 에 기록하고,
// 나갈 때 체류시간·스크롤 도달률을 보낸다. 상담 버튼(전화·톡톡·카카오·홈페이지) 클릭도 기록한다.
// - 한 방문 = 기기당 하루 (localStorage 의 기기 id + 한국시간 날짜)
// - localhost 와 관리자 미리보기(draft 모드)는 세지 않는다. 주소 뒤에 ?track=1 을 붙이면 로컬에서도 기록(테스트용)
// - 개인정보는 보내지 않는다 (경로·리퍼러·UTM·기기 종류만)
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// 주소에 "track" 이 들어가면 광고 차단 확장 프로그램이 요청을 막아 PC 방문이 집계에서 빠지므로 중립적인 이름을 쓴다
const ENDPOINT = "/next/v";
const DID_KEY = "modoo_did";
const NOTRACK_KEY = "modoo_notrack";
const TRACK_KEY = "modoo_track"; // 로컬(localhost)에서 기록을 켠 표시 (?track=1 로 한 번 켬)

const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* 프라이빗 모드 등 */
    }
  },
  del: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* 무시 */
    }
  },
};

function getSessionId(): string {
  let did = store.get(DID_KEY);
  if (!did) {
    did = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    store.set(DID_KEY, did);
  }
  const day = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10); // KST 날짜
  return `${did}-${day}`;
}

function trackingDisabled(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.get("notrack") === "1") {
    store.set(NOTRACK_KEY, "1");
    store.del(TRACK_KEY);
  }
  if (params.get("track") === "1") {
    store.del(NOTRACK_KEY);
    store.set(TRACK_KEY, "1"); // 로컬에서도 한 번 켜 두면 다음 페이지부터 주소에 안 붙여도 기록된다
  }
  if (store.get(NOTRACK_KEY) === "1") return true;
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal && store.get(TRACK_KEY) !== "1";
}

function send(body: Record<string, unknown>, beacon = false) {
  const json = JSON.stringify(body);
  if (beacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([json], { type: "application/json" }));
    return;
  }
  fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: json, keepalive: true }).catch(() => {});
}

// 상담 버튼 판별: 링크 주소로 구분한다 (컴포넌트마다 코드를 넣지 않아도 되게)
function clickLabel(a: HTMLAnchorElement): string {
  const href = a.getAttribute("href") || "";
  if (href.startsWith("tel:")) return "tel";
  if (href.includes("talk.naver.com")) return "naver-talk";
  if (href.includes("pf.kakao.com")) return "kakao";
  if (href.includes("modooeye.kr")) return "homepage";
  return "";
}

export function PageTracker({ disabled = false }: { disabled?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString(); // /search 에서 검색어만 바뀌어도(경로는 그대로) 새 페이지 보기로 기록하려고 의존성에 넣는다
  const current = useRef<{ id: number; entry: number; flushed: boolean } | null>(null);
  const maxScroll = useRef(0);

  const measureScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct = scrollable <= 0 ? 100 : Math.round(((window.scrollY || doc.scrollTop) / scrollable) * 100);
    maxScroll.current = Math.max(maxScroll.current, Math.max(0, Math.min(pct, 100)));
  };

  const flush = () => {
    const c = current.current;
    if (!c || c.flushed) return;
    c.flushed = true;
    measureScroll();
    send({ type: "duration", id: c.id, durationMs: Math.round(performance.now() - c.entry), maxScroll: maxScroll.current }, true);
  };

  // 페이지 보기
  useEffect(() => {
    // /next/* 는 미리보기 안내·내부 라우트라 방문자가 보는 페이지가 아니다
    if (disabled || !pathname || pathname.startsWith("/next/") || trackingDisabled()) return;
    flush();
    maxScroll.current = 0;

    const params = new URLSearchParams(search);
    // 광고 클릭은 UTM 이 없어도 소스·매체를 채운다 (네이버 파워링크 n_*, 구글 gclid)
    const isNaverAd = !!(params.get("n_media") || params.get("n_keyword") || params.get("n_query") || params.get("n_ad"));
    const adSource = isNaverAd ? "naver" : params.get("gclid") ? "google" : "";
    const keyword = params.get("n_query") || params.get("n_keyword") || params.get("utm_term") || params.get("kw") || "";
    const body = {
      sessionId: getSessionId(),
      path: pathname,
      referrer: document.referrer,
      utmSource: params.get("utm_source") || adSource || (params.get("fbclid") ? "facebook" : ""),
      utmMedium: params.get("utm_medium") || (adSource ? "cpc" : ""),
      keyword,
      query: pathname === "/search" ? (params.get("q") || "").trim() : "",
    };
    let active = true;
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.id) current.current = { id: d.id, entry: performance.now(), flushed: false };
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search, disabled]);

  // 스크롤 도달률 + 체류시간 마감 + 상담 버튼 클릭
  useEffect(() => {
    if (disabled) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        measureScroll();
        ticking = false;
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else if (current.current) {
        current.current.entry = performance.now();
        current.current.flushed = false;
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || trackingDisabled()) return;
      const label = clickLabel(a as HTMLAnchorElement);
      if (label) send({ type: "click", sessionId: getSessionId(), path: window.location.pathname, label }, true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("click", onClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return null;
}

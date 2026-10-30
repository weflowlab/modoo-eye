// 관리자 "유입 관리" 화면 (/admin/traffic). payload.config admin.components.views.traffic 에 등록.
// 방문 기록(page-views) 최근 90일을 읽어 lib/trafficStats 로 집계하고, Payload 관리자 틀(DefaultTemplate) 안에 그린다.
// 스타일은 app/(payload)/custom.scss 의 .traffic* 클래스.
import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import { computeTrafficStats, PERIODS, type PageViewRow, type PeriodKey } from "@/lib/trafficStats";
import { CLICK_LABEL, DEVICE_LABEL, SOURCE_LABEL } from "@/lib/tracking";

const DAYS = 90;

function sourceLabel(key: string): string {
  if (key.endsWith("-ad")) return `${SOURCE_LABEL[key.slice(0, -3)] ?? key.slice(0, -3)} 광고`;
  return SOURCE_LABEL[key] ?? key;
}

function fmtDuration(sec: number): string {
  if (sec < 60) return `${sec}초`;
  return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
}

// 가로 막대 목록 (라벨 · 수 · 비율)
function Bars({ rows, labelOf, unit = "회" }: { rows: [string, number][]; labelOf?: (k: string) => string; unit?: string }) {
  if (rows.length === 0) return <p className="traffic__empty">아직 데이터가 없습니다.</p>;
  const max = Math.max(1, ...rows.map((r) => r[1]));
  const total = rows.reduce((a, r) => a + r[1], 0);
  return (
    <ul className="traffic__bars">
      {rows.map(([k, n]) => (
        <li key={k}>
          <span className="traffic__bar-label" title={k}>
            {labelOf ? labelOf(k) : k}
          </span>
          <span className="traffic__bar-track">
            <span className="traffic__bar-fill" style={{ width: `${(n / max) * 100}%` }} />
          </span>
          <span className="traffic__bar-value">
            {n.toLocaleString()}
            {unit} <small>({Math.round((n / total) * 100)}%)</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

export async function TrafficView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult;
  const { payload } = req;
  if (!req.user) redirect(`${payload.config.routes.admin}/login?redirect=${encodeURIComponent("/admin/traffic")}`);

  const periodParam = String(searchParams?.period ?? "7d");
  const period: PeriodKey = (PERIODS.find((p) => p.key === periodParam)?.key ?? "7d") as PeriodKey;

  // 서버 컴포넌트라 요청마다 새로 실행된다. 렌더 중 현재 시각을 읽는 것이 의도 (react-hooks/purity 는 클라이언트 기준 규칙)
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const since = new Date(now - DAYS * 86400000).toISOString();
  const [views, posts, categories] = await Promise.all([
    payload.find({ collection: "page-views", where: { createdAt: { greater_than_equal: since } }, pagination: false, depth: 0, sort: "createdAt" }),
    payload.find({ collection: "posts", pagination: false, depth: 1, select: { title: true, slug: true, category: true } }),
    payload.find({ collection: "categories", pagination: false, depth: 0 }),
  ]);
  const stats = computeTrafficStats(views.docs as PageViewRow[], period, now);

  // 경로 → 사람이 읽는 이름 (글 제목, 카테고리 이름)
  const pathName = new Map<string, string>([
    ["/", "메인 페이지"],
    ["/posts", "전체 글 목록"],
    ["/search", "검색 페이지"],
  ]);
  for (const c of categories.docs) pathName.set(`/${c.slug}`, `${c.name} 목록`);
  for (const p of posts.docs) {
    const cat = typeof p.category === "object" && p.category ? p.category.slug : null;
    if (cat && p.slug) pathName.set(`/${cat}/${p.slug}`, p.title);
  }
  const nameOf = (path: string) => {
    try {
      return pathName.get(decodeURIComponent(path)) ?? decodeURIComponent(path);
    } catch {
      return path;
    }
  };
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.sessions));
  const hasData = views.docs.length > 0;

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
      viewType="dashboard"
    >
      <Gutter className="traffic">
        <div className="traffic__head">
          <h1>유입 관리</h1>
          <nav className="traffic__periods" aria-label="기간">
            {PERIODS.map((p) => (
              <a key={p.key} href={`/admin/traffic?period=${p.key}`} className={p.key === period ? "is-on" : ""}>
                {p.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="traffic__note">
          방문자가 어느 페이지를 어디서 와서 봤는지 집계합니다. 개인을 식별하는 정보는 저장하지 않습니다. 한 방문 = 같은 기기의 하루.
          관리자 미리보기와 봇은 세지 않습니다.
        </p>

        {!hasData && <div className="traffic__card traffic__empty-card">아직 수집된 방문 기록이 없습니다. 사이트에 방문이 생기면 여기에 표시됩니다.</div>}

        {/* 요약 */}
        <div className="traffic__stats">
          {[
            ["방문", `${stats.sessions.toLocaleString()}회`],
            ["페이지뷰", `${stats.pageViews.toLocaleString()}회`],
            ["모바일 비율", `${stats.mobileShare}%`],
            ["평균 체류", fmtDuration(stats.avgDurationSec)],
          ].map(([label, value]) => (
            <div key={label} className="traffic__stat">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        {/* 최근 14일 추이 */}
        <section className="traffic__card">
          <h2>최근 14일 방문 추이</h2>
          <div className="traffic__daily">
            {stats.daily.map((d) => (
              <div key={d.day} className="traffic__day" title={`${d.day} · ${d.sessions}회`}>
                <span className="traffic__day-bar" style={{ height: `${Math.max(2, (d.sessions / maxDaily) * 100)}%` }} />
                <span className="traffic__day-value">{d.sessions || ""}</span>
                <span className="traffic__day-label">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="traffic__grid">
          <section className="traffic__card">
            <h2>어디서 들어왔나 (유입 경로)</h2>
            <Bars rows={stats.sources} labelOf={sourceLabel} />
          </section>
          <section className="traffic__card">
            <h2>많이 본 글 Top 10</h2>
            <Bars rows={stats.topPaths} labelOf={nameOf} />
          </section>
          <section className="traffic__card">
            <h2>검색엔진에서 어떤 글로 들어왔나</h2>
            <p className="traffic__hint">네이버·구글은 검색어를 알려주지 않아서, 검색에서 처음 연 글로 대신 봅니다.</p>
            {stats.landingBySearch.length === 0 && <p className="traffic__empty">아직 검색 유입이 없습니다.</p>}
            {stats.landingBySearch.map(({ source, rows }) => (
              <div key={source} className="traffic__sub">
                <h3>{SOURCE_LABEL[source] ?? source}</h3>
                <Bars rows={rows} labelOf={nameOf} />
              </div>
            ))}
          </section>
          <section className="traffic__card">
            <h2>방문자가 블로그에서 검색한 말</h2>
            <p className="traffic__hint">검색창에 친 단어입니다. 자주 나오는데 글이 없으면 다음 글감으로.</p>
            <Bars rows={stats.queries} />
          </section>
          <section className="traffic__card">
            <h2>상담 버튼 클릭</h2>
            <p className="traffic__hint">전화·네이버 톡톡·카카오채널·홈페이지 바로가기 버튼을 누른 횟수.</p>
            <Bars rows={stats.clicks} labelOf={(k) => CLICK_LABEL[k] ?? k} />
          </section>
          <section className="traffic__card">
            <h2>기기</h2>
            <Bars rows={stats.devices} labelOf={(k) => DEVICE_LABEL[k] ?? k} />
          </section>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}

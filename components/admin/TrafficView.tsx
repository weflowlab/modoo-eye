// 관리자 "유입 관리" 화면 (/admin/traffic). payload.config admin.components.views.traffic 에 등록.
// 방문 기록(page-views) 최근 90일을 읽어 lib/trafficStats 로 집계하고, Payload 관리자 틀(DefaultTemplate) 안에 그린다.
// 문구·카드 구성은 weflow 관리자 "유입 관리" 탭을 따른다. 스타일은 app/(payload)/custom.scss 의 .traffic* 클래스.
import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import { computeTrafficStats, PERIODS, type PageViewRow, type PeriodKey } from "@/lib/trafficStats";
import { CLICK_LABEL, DEVICE_LABEL, SOURCE_LABEL } from "@/lib/tracking";
import {
  IconUsers,
  IconEye,
  IconDoorExit,
  IconClock,
  IconCalendarWeek,
  IconMapPin,
  IconDeviceMobile,
  IconArticle,
  IconSearch,
  IconPhoneCall,
  IconLogout,
  IconFileSearch,
  IconTrendingUp,
  type Icon as TablerIcon,
} from "@tabler/icons-react";

const DAYS = 90;

function sourceLabel(key: string): string {
  if (key.endsWith("-ad")) return `${SOURCE_LABEL[key.slice(0, -3)] ?? key.slice(0, -3)} 광고`;
  return SOURCE_LABEL[key] ?? key;
}

function fmtDuration(sec: number): string {
  if (sec < 60) return `${sec}초`;
  return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
}

// 카드: 제목 + 한 줄 설명 + 내용
function Card({
  title,
  desc,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  desc?: string;
  icon?: TablerIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`traffic__card ${className}`}>
      <h2>
        {Icon && <Icon className="traffic__card-icon" stroke={1.8} />}
        {title}
      </h2>
      {desc && <p className="traffic__desc">{desc}</p>}
      {children}
    </section>
  );
}

// 가로 막대 목록 (라벨 · 수 · 비율)
function Bars({ rows, labelOf, unit = "회" }: { rows: [string, number][]; labelOf?: (k: string) => string; unit?: string }) {
  if (rows.length === 0) return <p className="traffic__empty">데이터 없음</p>;
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

  const periodParam = String(searchParams?.period ?? "today");
  const period: PeriodKey = (PERIODS.find((p) => p.key === periodParam)?.key ?? "today") as PeriodKey;

  // 서버 컴포넌트라 요청마다 새로 실행된다. 렌더 중 현재 시각을 읽는 것이 의도 (react-hooks/purity 는 클라이언트 기준 규칙)
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const since = new Date(now - DAYS * 86400000).toISOString();
  const [views, posts, categories] = await Promise.all([
    // 같은 초에 들어온 기록은 id 순으로 — 방문 안에서 첫 페이지·마지막 페이지 판정이 흔들리지 않게
    payload.find({ collection: "page-views", where: { createdAt: { greater_than_equal: since } }, pagination: false, depth: 0, sort: ["createdAt", "id"] }),
    // 발행된 글만 (초안·임시 글은 목록에 안 올린다)
    payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      pagination: false,
      depth: 1,
      select: { title: true, slug: true, category: true },
    }),
    payload.find({ collection: "categories", pagination: false, depth: 0 }),
  ]);

  // 경로 → 사람이 읽는 이름 (글 제목, 카테고리 이름)
  const pathName = new Map<string, string>([
    ["/", "메인 페이지"],
    ["/posts", "전체 글 목록"],
    ["/search", "검색 페이지"],
  ]);
  const postPaths = new Set<string>();
  for (const c of categories.docs) pathName.set(`/${c.slug}`, `${c.name} 목록`);
  for (const p of posts.docs) {
    const cat = typeof p.category === "object" && p.category ? p.category.slug : null;
    if (cat && p.slug) {
      pathName.set(`/${cat}/${p.slug}`, p.title);
      postPaths.add(`/${cat}/${p.slug}`);
    }
  }
  const decode = (path: string) => {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  };
  const nameOf = (path: string) => pathName.get(path) ?? path;
  // 한글 URL 은 기록에 인코딩된 채(%EB…) 들어오므로 집계 전에 전부 풀어서 글 목록 경로와 같은 모양으로 맞춘다
  const rows = (views.docs as PageViewRow[]).map((r) => ({ ...r, path: decode(r.path) }));
  const stats = computeTrafficStats(rows, period, now, (path) => postPaths.has(path));
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.sessions));
  const topSource = stats.sources[0];

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

        {views.docs.length === 0 && (
          <div className="traffic__card traffic__empty-card">아직 수집된 방문 데이터가 없습니다. 방문이 기록되면 여기에 유입·이탈 통계가 표시됩니다.</div>
        )}

        {/* 요약 */}
        <div className="traffic__stats">
          {(
            [
              [IconUsers, "#0ea5e9", "방문자 수", `${stats.sessions.toLocaleString()}명`, "선택 기간 방문 고객"],
              [IconEye, "#6366f1", "본 페이지 수", `${stats.pageViews.toLocaleString()}회`, "고객들이 열어본 페이지"],
              [IconDoorExit, "#f59e0b", "즉시 이탈률", `${stats.bounceRate}%`, `한 페이지만 보고 이탈 (${stats.bounced.toLocaleString()}명)`],
              [IconClock, "#22c55e", "평균 머문 시간", fmtDuration(stats.avgDurationSec), "한 명이 머문 평균 시간"],
            ] as [TablerIcon, string, string, string, string][]
          ).map(([Icon, tint, label, value, sub]) => (
            <div key={label} className="traffic__stat" style={{ borderTopColor: tint }}>
              <span>
                <i className="traffic__stat-icon" style={{ background: `${tint}1f`, color: tint }}>
                  <Icon size={20} stroke={2} />
                </i>
                {label}
              </span>
              <strong>{value}</strong>
              <em>{sub}</em>
            </div>
          ))}
        </div>

        {topSource && stats.sessions > 0 && (
          <p className="traffic__lead">
            <IconTrendingUp className="traffic__lead-icon" stroke={2} />
            {/* 문장은 한 덩어리로 묶는다 (모바일에서 flex 로 아이콘 옆에 세울 때 조각나지 않게) */}
            <span className="traffic__lead-text">
              고객이 가장 많이 들어온 곳은 <strong>{sourceLabel(topSource[0])}</strong>이에요 — 전체 방문자의{" "}
              <strong>{Math.round((topSource[1] / stats.sessions) * 100)}%</strong>
            </span>
          </p>
        )}

        <div className="traffic__grid">
          <Card icon={IconMapPin} title="어디서 들어왔나요?" desc="고객들이 우리 블로그를 찾은 경로">
            <Bars rows={stats.sources} labelOf={sourceLabel} unit="명" />
          </Card>
          <Card icon={IconDeviceMobile} title="무엇으로 봤나요?" desc="휴대폰·컴퓨터 등 접속 기기">
            <Bars rows={stats.devices} labelOf={(k) => DEVICE_LABEL[k] ?? k} unit="명" />
          </Card>
        </div>

        <Card icon={IconCalendarWeek} title="날짜별 방문자" desc="최근 14일 동안 하루에 몇 명이 왔는지">
          {/* 좁은 화면에서는 가로로 밀어 본다 (최근 날짜가 먼저 보이도록 오른쪽 끝에서 시작) */}
          <div className="traffic__daily-scroll">
          <div className="traffic__daily">
            {stats.daily.map((d) => (
              <div key={d.day} className="traffic__day" title={`${d.day} · ${d.sessions}명`}>
                <span className="traffic__day-bar" style={{ height: `${Math.max(2, (d.sessions / maxDaily) * 100)}%` }} />
                <span className="traffic__day-value">{d.sessions || ""}</span>
                <span className="traffic__day-label">{d.label}</span>
              </div>
            ))}
          </div>
          </div>
        </Card>

        <div className="traffic__grid">
          <Card icon={IconArticle} title="많이 본 글" desc="고객들이 가장 많이 읽은 글">
            <Bars rows={stats.topPaths} labelOf={nameOf} />
            {/* 전체 글: 0회인 글까지 조회수 순으로 */}
            <details className="traffic__all">
              <summary>전체 글 보기 ({postPaths.size}편)</summary>
              <ol>
                {[...postPaths]
                  .map((p) => [p, stats.pathCounts[p] ?? 0] as [string, number])
                  .sort((a, b) => b[1] - a[1] || nameOf(a[0]).localeCompare(nameOf(b[0]), "ko"))
                  .map(([p, n]) => (
                    <li key={p}>
                      <span>{nameOf(p)}</span>
                      <strong>{n.toLocaleString()}회</strong>
                    </li>
                  ))}
              </ol>
            </details>
          </Card>
          <Card icon={IconFileSearch} title="방문자가 첫 번째로 연 글" desc="네이버·구글 검색으로 들어온 고객이 처음 연 글">
            {stats.landingBySearch.length === 0 && <p className="traffic__empty">데이터 없음</p>}
            {stats.landingBySearch.map(({ source, rows }) => (
              <div key={source} className="traffic__sub">
                <h3>{SOURCE_LABEL[source] ?? source}</h3>
                <Bars rows={rows} labelOf={nameOf} unit="명" />
              </div>
            ))}
          </Card>
          <Card icon={IconSearch} title="무엇을 검색했나요?" desc="방문자가 웹블로그 검색창에 친 단어입니다">
            <Bars rows={stats.queries} />
          </Card>
          <Card icon={IconPhoneCall} title="상담으로 이어졌나요?" desc="전화·네이버 톡톡·카카오채널·홈페이지 버튼을 누른 횟수">
            <Bars rows={stats.clicks} labelOf={(k) => CLICK_LABEL[k] ?? k} />
          </Card>
          <Card icon={IconLogout} title="어느 페이지에서 나갔나요?" desc="고객이 마지막으로 보고 떠난 페이지">
            <Bars rows={stats.exitPages} labelOf={nameOf} unit="명" />
          </Card>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}

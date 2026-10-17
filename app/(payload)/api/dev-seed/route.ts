// 개발 전용 시드: lib/mock.ts 의 데이터를 Payload 에 넣는다 (카테고리, 의료진, 글, 병원 정보, 메인 페이지, 첫 관리자 계정).
// 사용: 개발 서버 실행 중 `npm run seed` (GET /api/dev-seed). 이미 데이터가 있으면 건너뛴다. `?force=1` 이면 글/의료진/카테고리를 지우고 다시 넣는다.
// 운영 DB 에는 절대 실행하지 않는다 (NODE_ENV=production 이면 404).
import { getPayload } from "payload";
import config from "@payload-config";
import { clinic, categories, doctors, posts, popularKeywords } from "@/lib/mock";
import { htmlSectionsToLexical } from "@/lib/lexical";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@modooeye.kr";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "modoo1234!";

export async function GET(req: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const force = new URL(req.url).searchParams.get("force") === "1";
  const payload = await getPayload({ config });
  const context = { disableRevalidate: true }; // 시드 중 페이지 재생성 폭주 방지
  const log: string[] = [];

  // 1) 첫 관리자 계정
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    await payload.create({ collection: "users", data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "관리자" } });
    log.push(`관리자 계정 생성: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // 2) 병원 정보 글로벌
  await payload.updateGlobal({
    slug: "clinic",
    context,
    data: {
      name: clinic.name,
      nameEn: clinic.nameEn,
      homepageUrl: clinic.homepageUrl,
      address: clinic.address,
      phone: clinic.phone,
      fax: clinic.fax,
      businessNumber: clinic.businessNumber,
      representatives: clinic.representatives.map((value) => ({ value })),
      stats: clinic.stats,
      statsNote: clinic.statsNote,
      hours: clinic.hours,
      directions: clinic.directions,
      parking: clinic.parking.map((value) => ({ value })),
      mapLinks: clinic.mapLinks,
      consultUrl: clinic.consultUrl,
      kakaoChannelUrl: clinic.kakaoChannelUrl,
      sns: clinic.sns,
      legalLinks: clinic.legalLinks,
      homepageMenu: clinic.homepageMenu,
    },
  });
  log.push("병원 정보 저장");

  // 3) 메인 페이지 글로벌 (문구는 비워두면 컴포넌트 기본값이 쓰인다. 키워드만 채움)
  await payload.updateGlobal({
    slug: "home",
    context,
    draft: false,
    data: { _status: "published", popularKeywords: popularKeywords.map((value) => ({ value })) },
  });
  log.push("메인 페이지 저장");

  // 4) 카테고리 / 의료진 / 글 (이미 있으면 건너뜀, force 면 재생성)
  const existing = await payload.count({ collection: "posts" });
  if (existing.totalDocs > 0 && !force) {
    log.push(`글 ${existing.totalDocs}건이 이미 있어 콘텐츠 시드는 건너뜀 (?force=1 로 재생성)`);
    return new Response(log.join("\n"));
  }
  if (force) {
    for (const collection of ["posts", "doctors", "categories"] as const) {
      await payload.delete({ collection, where: { id: { exists: true } }, context });
    }
    log.push("기존 글/의료진/카테고리 삭제");
  }

  const categoryIds = new Map<string, number>();
  for (const [i, c] of categories.entries()) {
    const doc = await payload.create({
      collection: "categories",
      context,
      data: { name: c.name, slug: c.slug, description: c.description, order: i },
    });
    categoryIds.set(c.slug, doc.id);
  }
  log.push(`카테고리 ${categories.length}개`);

  const doctorIds = new Map<string, number>();
  for (const [i, d] of doctors.entries()) {
    const doc = await payload.create({
      collection: "doctors",
      context,
      data: {
        name: d.name,
        slug: d.slug,
        title: d.title,
        bio: d.bio,
        specialties: d.specialties.map((value) => ({ value })),
        career: d.career.map((value) => ({ value })),
        order: i,
      },
    });
    doctorIds.set(d.slug, doc.id);
  }
  log.push(`의료진 ${doctors.length}명`);

  // 글: 먼저 전부 만들고, 관련 글은 id 가 생긴 뒤 연결
  const postIds = new Map<string, number>();
  for (const p of posts) {
    const doc = await payload.create({
      collection: "posts",
      context,
      draft: false,
      data: {
        _status: "published",
        title: p.title,
        slug: p.slug,
        category: categoryIds.get(p.category)!,
        author: doctorIds.get(p.author)!,
        publishedAt: p.publishedAt,
        summary: p.summary,
        content: htmlSectionsToLexical(p.sections) as never,
        faq: p.faq,
        sources: p.sources,
        tags: p.tags.map((tag) => ({ tag })),
        views: p.views,
      },
    });
    postIds.set(p.slug, doc.id);
  }
  for (const p of posts) {
    const related = p.related.map((s) => postIds.get(s)).filter((id): id is number => id !== undefined);
    await payload.update({ collection: "posts", id: postIds.get(p.slug)!, context, draft: false, data: { related } });
  }
  log.push(`글 ${posts.length}건 (발행 상태)`);

  return new Response(log.join("\n"));
}

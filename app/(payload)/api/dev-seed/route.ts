// 개발 전용 시드: 병원 정보·메인 페이지 기본 문구, 카테고리·의료진(lib/mock.ts), 글 10편(lib/articles.ts)과 블록 샘플 글(lib/samplePost.ts), 첫 관리자 계정.
// 사용: 개발 서버 실행 중 `npm run seed` (GET /api/dev-seed). 여러 번 실행해도 안전하다:
//   - 카테고리·의료진은 없을 때만 만들고, 글은 slug 로 찾아 본문·FAQ·출처만 덮어쓴다 (사진·조회수·발행일 유지).
//   - 병원 정보·메인 페이지는 비어 있는 문구만 채운다.
// 운영 DB 에는 절대 실행하지 않는다 (NODE_ENV=production 이면 404).
import { getPayload } from "payload";
import config from "@payload-config";
import { clinic, categories, doctors, popularKeywords } from "@/lib/mock";
import { articles } from "@/lib/articles";
import * as homeDefaults from "@/lib/homeDefaults";
import * as clinicDefaults from "@/lib/clinicDefaults";
import { samplePost, SAMPLE_POST_SLUG } from "@/lib/samplePost";
import type { Payload } from "payload";
import path from "path";
import fs from "fs/promises";
import mediaManifest from "@/lib/mediaManifest.media.json";
import mediaLinks from "@/lib/mediaManifest.links.json";

// ── 이미지: public/media 의 스톡 사진 목록(lib/mediaManifest.media.json)과 "어느 글·의료진·배너에 붙어 있었는지"(lib/mediaManifest.links.json) ──
type MediaLink = { kind: string; key: string; field: string; filename: string; ord: number };
const linkFiles = (kind: string, key: string, field: string) =>
  (mediaLinks as MediaLink[])
    .filter((l) => l.kind === kind && l.key === key && l.field === field)
    .sort((a, b) => a.ord - b.ord)
    .map((l) => l.filename);

// 파일명으로 이미지를 찾고, 없으면 public/media 의 원본을 올린다 (Blob 토큰이 있으면 Blob 으로 올라간다). filename → id
async function importMedia(payload: Payload, context: Record<string, unknown>): Promise<{ ids: Map<string, number>; created: number }> {
  const ids = new Map<string, number>();
  let created = 0;
  for (const m of mediaManifest as { filename: string; alt: string }[]) {
    const found = await payload.find({ collection: "media", where: { filename: { equals: m.filename } }, limit: 1, depth: 0 });
    if (found.docs[0]) {
      ids.set(m.filename, found.docs[0].id);
      continue;
    }
    try {
      // 주의: context 객체는 호출마다 새로 만든다. Blob 플러그인이 업로드 뒤 req.context 에 skipCloudStorage 표시를 남기는데,
      // 같은 객체를 돌려쓰면 두 번째 장부터 업로드를 건너뛴다 (문서만 생기고 파일은 없음).
      const filePath = path.resolve(process.cwd(), "public/media", m.filename);
      const data = await fs.readFile(filePath);
      const doc = await payload.create({
        collection: "media",
        context: { ...context },
        file: { data, name: m.filename, mimetype: "image/webp", size: data.byteLength },
        data: { alt: m.alt || m.filename },
      });
      if (doc.filename !== m.filename) payload.logger.warn(`이미지 파일명이 바뀜: ${m.filename} → ${doc.filename}`);
      ids.set(m.filename, doc.id);
      created++;
    } catch (e) {
      payload.logger.warn(`이미지 올리기 실패: ${m.filename} — ${(e as Error).message}`);
    }
  }
  return { ids, created };
}

// 블록을 전부 쓴 샘플 글(lib/samplePost.ts)을 넣거나 갱신한다. 카테고리·의료진이 있어야 하므로 콘텐츠 시드 뒤에 부른다.
async function upsertSamplePost(payload: Payload, context: Record<string, unknown>): Promise<string> {
  const [cat, doc] = await Promise.all([
    payload.find({ collection: "categories", where: { slug: { equals: samplePost.categorySlug } }, limit: 1, depth: 0 }),
    payload.find({ collection: "doctors", where: { slug: { equals: samplePost.authorSlug } }, limit: 1, depth: 0 }),
  ]);
  const category = cat.docs[0]?.id;
  const author = doc.docs[0]?.id;
  if (!category || !author) return "샘플 글 건너뜀 (카테고리/의료진 없음)";

  // 관련 글: 같은 카테고리의 다른 글 2개
  const others = await payload.find({
    collection: "posts",
    where: { and: [{ category: { equals: category } }, { slug: { not_equals: SAMPLE_POST_SLUG } }] },
    limit: 2,
    depth: 0,
    sort: "-publishedAt",
  });
  const data = {
    _status: "published" as const,
    title: samplePost.title,
    slug: samplePost.slug,
    category,
    author,
    publishedAt: new Date().toISOString(),
    summary: samplePost.summary,
    keyPoints: samplePost.keyPoints.map((text) => ({ text })),
    content: samplePost.content as never,
    faq: samplePost.faq,
    sources: samplePost.sources,
    tags: samplePost.tags.map((tag) => ({ tag })),
    views: 120,
  };
  // 관련 글(related)은 자기 자신을 제외하는 filterOptions 때문에 id 가 생긴 뒤 update 로 넣는다 (create 시점엔 id 가 없어 검증 실패)
  const related = others.docs.map((p) => p.id);
  const existing = (await payload.find({ collection: "posts", where: { slug: { equals: SAMPLE_POST_SLUG } }, limit: 1, depth: 0 })).docs[0];

  // 스톡 사진 (없을 때만 붙인다). 이미지 문서가 지워져 image 가 빈 슬라이드 행은 없는 것으로 친다
  const mediaIdByFile = async (filename: string) =>
    (await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0 })).docs[0]?.id;
  const [thumb, ...slides] = await Promise.all(
    ["pexels-2440264-800x800.webp", "pexels-39647079-800x800.webp", "pexels-5752281-800x800.webp", "pexels-5752293-800x800.webp"].map(mediaIdByFile),
  );
  const photos = {
    ...(existing?.thumbnail || !thumb ? {} : { thumbnail: thumb }),
    ...((existing?.images ?? []).some((i) => i.image) ? {} : { images: slides.filter((id): id is number => id !== undefined).map((image) => ({ image })) }),
  };

  if (existing) {
    await payload.update({ collection: "posts", id: existing.id, context, draft: false, data: { ...data, ...photos, related } });
    return `샘플 글 갱신: /${samplePost.categorySlug}/${SAMPLE_POST_SLUG}`;
  }
  const created = await payload.create({ collection: "posts", context, draft: false, data: { ...data, ...photos } });
  await payload.update({ collection: "posts", id: created.id, context, draft: false, data: { related } });
  return `샘플 글 생성: /${samplePost.categorySlug}/${SAMPLE_POST_SLUG}`;
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@modooeye.kr";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "modoo1234!";

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const payload = await getPayload({ config });
  const context = { disableRevalidate: true, seed: true }; // 페이지 재생성 폭주 방지 + 발행일 과거 검증 건너뛰기
  const log: string[] = [];

  // 1) 첫 관리자 계정
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    await payload.create({ collection: "users", data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "관리자" } });
    log.push(`관리자 계정 생성: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // 1-1) 이미지 (새 DB 면 public/media 의 스톡 사진을 올린다)
  const { ids: mediaIds, created: mediaCreated } = await importMedia(payload, context);
  const mediaId = (filename?: string) => (filename ? mediaIds.get(filename) : undefined);
  log.push(`이미지 ${mediaIds.size}장 (새로 올린 것 ${mediaCreated})`);

  // 2) 병원 정보 글로벌 (글 하단 문구 3개는 비어 있을 때만 기본 문구로 채운다)
  const savedClinic = await payload.findGlobal({ slug: "clinic", depth: 0 });
  await payload.updateGlobal({
    slug: "clinic",
    context,
    data: {
      disclaimerText: savedClinic.disclaimerText || clinicDefaults.DISCLAIMER_TEXT,
      ctaTitle: savedClinic.ctaTitle || clinicDefaults.CTA_TITLE,
      ctaText: savedClinic.ctaText || clinicDefaults.ctaText(clinic.name),
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

  // 3) 메인 페이지 글로벌: 비어 있는 문구만 기본 문구(lib/homeDefaults.ts)로 채운다.
  //    관리자가 이미 고친 값과 배너 이미지는 그대로 둔다. 그래야 관리자 화면에 "지금 사이트에 보이는 글"이 미리 써 있다.
  const home = await payload.findGlobal({ slug: "home", depth: 0 });
  // 배너 이미지가 비어 있으면 원래 붙어 있던 스톡 사진을 연결한다
  const bannerImage = (field: "image" | "mobileImage", i: number) => mediaId(linkFiles("home", "banner", field)[i]) ?? null;
  const banners = (home.banners?.length ? home.banners : homeDefaults.BANNERS.map((b) => ({ ...b, image: null, mobileImage: null }))).map(
    (b, i) => {
      const d = homeDefaults.BANNERS[i % homeDefaults.BANNERS.length];
      return {
        ...b,
        label: b.label || d.label,
        text: b.text || d.text,
        image: b.image ?? bannerImage("image", i),
        mobileImage: b.mobileImage ?? bannerImage("mobileImage", i),
      };
    },
  );
  await payload.updateGlobal({
    slug: "home",
    context,
    draft: false,
    data: {
      _status: "published",
      heroImage: home.heroImage ?? mediaId(linkFiles("home", "home", "heroImage")[0]),
      heroTitle: home.heroTitle || homeDefaults.heroTitle(clinic),
      heroText: home.heroText || homeDefaults.HERO_TEXT,
      searchPlaceholder: home.searchPlaceholder || homeDefaults.SEARCH_PLACEHOLDER,
      popularKeywords: home.popularKeywords?.length ? home.popularKeywords : popularKeywords.map((value) => ({ value })),
      banners,
      summaryTitle: home.summaryTitle || homeDefaults.SUMMARY_TITLE,
      summaryText: home.summaryText || homeDefaults.summaryText(clinic),
      keyPoints: home.keyPoints?.length ? home.keyPoints : homeDefaults.KEY_POINTS.map(({ title, text }) => ({ title, value: text })),
      faq: home.faq?.length ? home.faq : homeDefaults.faq(clinic),
    },
  });
  log.push("메인 페이지 저장 (비어 있던 문구를 기본 문구로 채움)");

  // 4) 카테고리 / 의료진: slug 로 찾아 없을 때만 만든다 (관리자가 고친 내용과 사진은 보존)
  const categoryIds = new Map<string, number>();
  let newCategories = 0;
  for (const [i, c] of categories.entries()) {
    const found = await payload.find({ collection: "categories", where: { slug: { equals: c.slug } }, limit: 1, depth: 0 });
    let id = found.docs[0]?.id;
    if (!id) {
      id = (await payload.create({ collection: "categories", context, data: { name: c.name, slug: c.slug, description: c.description, order: i } })).id;
      newCategories++;
    }
    categoryIds.set(c.slug, id);
  }
  const doctorIds = new Map<string, number>();
  let newDoctors = 0;
  for (const [i, d] of doctors.entries()) {
    const found = await payload.find({ collection: "doctors", where: { slug: { equals: d.slug } }, limit: 1, depth: 0 });
    const photo = mediaId(linkFiles("doctor", d.slug, "photo")[0]); // 원래 붙어 있던 프로필 사진
    let id = found.docs[0]?.id;
    if (!id) {
      id = (
        await payload.create({
          collection: "doctors",
          context,
          data: {
            name: d.name,
            slug: d.slug,
            title: d.title,
            bio: d.bio,
            photo,
            specialties: d.specialties.map((value) => ({ value })),
            career: d.career.map((value) => ({ value })),
            order: i,
          },
        })
      ).id;
      newDoctors++;
    } else if (!found.docs[0].photo && photo) {
      await payload.update({ collection: "doctors", id, context, data: { photo } });
    }
    doctorIds.set(d.slug, id);
  }
  log.push(`카테고리 ${categories.length}개 (새로 만든 것 ${newCategories}), 의료진 ${doctors.length}명 (새로 만든 것 ${newDoctors})`);

  // 5) 글 10편 (lib/articles.ts): 새 slug 또는 예전 slug 로 찾아 내용을 덮어쓴다 (썸네일·슬라이드 사진·조회수·발행일 유지). 없으면 새로 만든다.
  //    관련 글(related)은 자기 자신을 제외하는 filterOptions 때문에 모든 글의 id 가 확정된 뒤 2차로 넣는다.
  const postIds = new Map<string, number>();
  let created = 0;
  for (const [i, a] of articles.entries()) {
    const slugs = [a.slug, ...(a.legacySlug ? [a.legacySlug] : [])];
    const found = await payload.find({ collection: "posts", where: { slug: { in: slugs } }, limit: 1, depth: 0 });
    const existing = found.docs[0];
    // 원래 붙어 있던 썸네일·슬라이드 사진 (새 slug 또는 예전 slug 기준)
    const photoKey = slugs.find((s) => linkFiles("post", s, "thumbnail").length || linkFiles("post", s, "images").length) ?? a.slug;
    const thumbnail = mediaId(linkFiles("post", photoKey, "thumbnail")[0]);
    const images = linkFiles("post", photoKey, "images")
      .map((f) => mediaId(f))
      .filter((id): id is number => id !== undefined)
      .map((image) => ({ image }));
    const data = {
      _status: "published" as const,
      title: a.title,
      slug: a.slug,
      category: categoryIds.get(a.categorySlug)!,
      author: doctorIds.get(a.authorSlug)!,
      summary: a.summary,
      keyPoints: a.keyPoints.map((text) => ({ text })),
      content: a.content as never,
      faq: a.faq,
      sources: a.sources,
      tags: a.tags.map((tag) => ({ tag })),
    };
    if (existing) {
      // 사진이 비어 있을 때만 채운다 (관리자가 바꾼 사진은 유지). 이미지 문서가 지워져 image 가 빈 슬라이드 행은 없는 것으로 친다
      const existingImages = (existing.images ?? []).filter((i) => i.image);
      const photos = {
        ...(existing.thumbnail || !thumbnail ? {} : { thumbnail }),
        ...(existingImages.length || !images.length ? {} : { images }),
      };
      await payload.update({ collection: "posts", id: existing.id, context, draft: false, data: { ...data, ...photos } });
      postIds.set(a.slug, existing.id);
    } else {
      const publishedAt = new Date(Date.now() - (i + 1) * 86400000).toISOString(); // 하루씩 간격을 둔 발행일
      const doc = await payload.create({
        collection: "posts",
        context,
        draft: false,
        data: { ...data, publishedAt, views: a.views, thumbnail, images },
      });
      postIds.set(a.slug, doc.id);
      created++;
    }
  }
  log.push(`글 ${articles.length}편 저장 (새로 만든 것 ${created}, 나머지는 내용만 갱신)`);

  // 6) 블록 샘플 글 (스톡 사진 연결 포함)
  log.push(await upsertSamplePost(payload, context));
  const sample = await payload.find({ collection: "posts", where: { slug: { equals: SAMPLE_POST_SLUG } }, limit: 1, depth: 0 });
  if (sample.docs[0]) postIds.set(SAMPLE_POST_SLUG, sample.docs[0].id);

  // 7) 관련 글 연결 (2차)
  for (const a of articles) {
    const related = a.related.map((s) => postIds.get(s)).filter((id): id is number => id !== undefined);
    await payload.update({ collection: "posts", id: postIds.get(a.slug)!, context, draft: false, data: { related } });
  }
  log.push("관련 글 연결");

  return new Response(log.join("\n"));
}

// 프론트 데이터 계층. 서버 컴포넌트에서만 import 한다.
// Payload 로컬 API 로 문서를 읽고 lib/types.ts 모양으로 변환한다.
// 관리자 미리보기(draft 모드)에서는 발행 전 초안도 읽는다.
import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import type { Category as PCategory, Doctor as PDoctor, Media, Post as PPost } from "@/payload-types";
import type { Category, ClinicInfo, Doctor, HomeContent, ImageRef, Post, SiteData } from "./types";
import { clinic as fallbackClinic, categories as fallbackCategories, popularKeywords as fallbackKeywords } from "./mock";
import { mediaUrl } from "./mediaUrl";

const getClient = () => getPayload({ config });

// draft 모드 여부. generateStaticParams 등 요청 밖에서는 false.
async function isDraft(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

// ── 변환 함수 ──────────────────────────────────────────────

function mapImage(m: Media | number | null | undefined): ImageRef | null {
  if (!m || typeof m !== "object" || !m.url) return null;
  return { url: mediaUrl(m.url), alt: m.alt ?? "", width: m.width ?? undefined, height: m.height ?? undefined };
}

function mapCategory(c: PCategory): Category {
  return { slug: c.slug, name: c.name, description: c.description ?? undefined };
}

function mapDoctor(d: PDoctor): Doctor {
  return {
    slug: d.slug ?? String(d.id),
    name: d.name,
    title: d.title,
    specialties: (d.specialties ?? []).map((s) => s.value),
    bio: d.bio ?? "",
    career: (d.career ?? []).map((c) => c.value),
    photo: mapImage(d.photo),
    story: d.story ?? undefined,
  };
}

// relationship 필드는 depth 에 따라 id 또는 문서 객체. 객체일 때만 slug 를 꺼낸다.
const relSlug = (r: number | { slug?: string | null } | null | undefined) =>
  r && typeof r === "object" ? (r.slug ?? "") : "";

function mapPost(p: PPost): Post {
  const category = typeof p.category === "object" ? p.category : null;
  const author = typeof p.author === "object" ? p.author : null;
  return {
    id: p.id,
    slug: p.slug ?? String(p.id),
    category: category?.slug ?? "",
    categoryName: category?.name,
    title: p.title,
    summary: p.summary,
    publishedAt: p.publishedAt ?? p.createdAt,
    author: author?.slug ?? "",
    authorName: author?.name,
    tags: (p.tags ?? []).map((t) => t.tag),
    views: p.views ?? 0,
    content: p.content,
    sections: [],
    thumbnail: mapImage(p.thumbnail),
    images: (p.images ?? []).map((i) => mapImage(i.image)).filter((i): i is ImageRef => !!i),
    faq: (p.faq ?? []).map(({ question, answer }) => ({ question, answer })),
    sources: (p.sources ?? []).map(({ label, href }) => ({ label, href })),
    related: (p.related ?? []).map(relSlug).filter(Boolean),
  };
}

// 발행된 글만 (draft 모드면 초안 포함)
async function publishedWhere(): Promise<Where> {
  return (await isDraft()) ? {} : { _status: { equals: "published" } };
}

// ── 조회 함수 (React cache 로 요청 단위 중복 제거) ──────────

export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "categories", sort: "order", limit: 50, depth: 0 });
  return docs.length ? docs.map(mapCategory) : fallbackCategories; // 시드 전에는 목 데이터
});

export const getCategory = cache(async (slug: string): Promise<Category | undefined> => {
  return (await getCategories()).find((c) => c.slug === slug);
});

export const getDoctors = cache(async (): Promise<Doctor[]> => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "doctors", sort: "order", limit: 50, depth: 1 });
  return docs.map(mapDoctor);
});

export const getDoctor = cache(async (slug: string): Promise<Doctor | undefined> => {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "doctors", where: { slug: { equals: slug } }, limit: 1, depth: 1 });
  return docs[0] ? mapDoctor(docs[0]) : undefined;
});

type PostQuery = { where?: Where; sort?: string; limit?: number };

async function findPosts({ where = {}, sort = "-publishedAt", limit = 100 }: PostQuery): Promise<Post[]> {
  const payload = await getClient();
  const draft = await isDraft();
  const { docs } = await payload.find({
    collection: "posts",
    where: { and: [await publishedWhere(), where] },
    sort,
    limit,
    depth: 1,
    draft,
  });
  return docs.map(mapPost);
}

export const getAllPosts = cache(() => findPosts({}));

export const getPostsByCategory = cache((slug: string) => findPosts({ where: { "category.slug": { equals: slug } } }));

export const getPostsByAuthor = cache((slug: string) => findPosts({ where: { "author.slug": { equals: slug } } }));

export const getPopularPosts = cache((n = 4) => findPosts({ sort: "-views", limit: n }));

export const getLatestPosts = cache((n = 6) => findPosts({ sort: "-publishedAt", limit: n }));

export const getPostsBySlugs = cache(async (slugs: string[]): Promise<Post[]> => {
  if (!slugs.length) return [];
  const posts = await findPosts({ where: { slug: { in: slugs } } });
  return slugs.map((s) => posts.find((p) => p.slug === s)).filter((p): p is Post => !!p);
});

export const getPost = cache(async (category: string, slug: string): Promise<Post | undefined> => {
  const posts = await findPosts({ where: { and: [{ slug: { equals: slug } }, { "category.slug": { equals: category } }] }, limit: 1 });
  return posts[0];
});

// 제목/요약/태그 부분 일치 검색
export const searchPosts = cache(async (q: string): Promise<Post[]> => {
  const term = q.trim();
  if (!term) return getAllPosts();
  return findPosts({
    where: { or: [{ title: { like: term } }, { summary: { like: term } }, { "tags.tag": { like: term } }] },
  });
});

// 조회수 +1. 버전(초안) 생성을 피하려고 DB 어댑터로 직접 갱신한다.
export async function incrementViews(id: number): Promise<void> {
  const payload = await getClient();
  const doc = await payload.findByID({ collection: "posts", id, depth: 0 });
  await payload.db.updateOne({ collection: "posts", id, data: { views: (doc.views ?? 0) + 1 } });
}

// ── 글로벌 ─────────────────────────────────────────────────

export const getClinic = cache(async (): Promise<ClinicInfo> => {
  const payload = await getClient();
  const g = await payload.findGlobal({ slug: "clinic", depth: 0 });
  if (!g?.name) return fallbackClinic; // 시드 전에는 목 데이터
  const links = (arr?: { label: string; href: string }[] | null) => (arr ?? []).map(({ label, href }) => ({ label, href }));
  return {
    name: g.name,
    nameEn: g.nameEn ?? "",
    homepageUrl: g.homepageUrl,
    address: g.address,
    phone: g.phone,
    fax: g.fax ?? "",
    businessNumber: g.businessNumber ?? "",
    representatives: (g.representatives ?? []).map((r) => r.value),
    hours: (g.hours ?? []).map(({ label, value }) => ({ label, value })),
    directions: g.directions ?? "",
    parking: (g.parking ?? []).map((p) => p.value),
    mapLinks: links(g.mapLinks),
    sns: links(g.sns),
    legalLinks: links(g.legalLinks),
    homepageMenu: links(g.homepageMenu),
    consultUrl: g.consultUrl,
    kakaoChannelUrl: g.kakaoChannelUrl ?? "",
    stats: (g.stats ?? []).map(({ label, value }) => ({ label, value })),
    statsNote: g.statsNote ?? "",
  };
});

export const getHome = cache(async (): Promise<HomeContent> => {
  const payload = await getClient();
  const draft = await isDraft();
  const g = await payload.findGlobal({ slug: "home", depth: 1, draft });
  return {
    heroImage: mapImage(g?.heroImage),
    heroTitle: g?.heroTitle ?? "",
    heroText: g?.heroText ?? "",
    searchPlaceholder: g?.searchPlaceholder ?? "",
    popularKeywords: (g?.popularKeywords ?? []).map((k) => k.value),
    banners: (g?.banners ?? []).map((b) => ({
      image: mapImage(b.image),
      mobileImage: mapImage(b.mobileImage),
      label: b.label ?? "",
      text: b.text ?? "",
    })),
    introLabel: g?.introLabel ?? "",
    introText: g?.introText ?? "",
    summaryTitle: g?.summaryTitle ?? "",
    summaryText: g?.summaryText ?? "",
    keyPoints: (g?.keyPoints ?? []).map((k) => k.value),
    faq: (g?.faq ?? []).map(({ question, answer }) => ({ question, answer })),
    sources: (g?.sources ?? []).map(({ label, href }) => ({ label, href })),
  };
});

// 헤더/푸터/퀵메뉴가 쓰는 공통 데이터
export const getSiteData = cache(async (): Promise<SiteData> => {
  const [clinic, categories, home] = await Promise.all([getClinic(), getCategories(), getHome()]);
  return { clinic, categories, popularKeywords: home.popularKeywords.length ? home.popularKeywords : fallbackKeywords };
});

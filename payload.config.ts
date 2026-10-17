// Payload CMS 설정. 관리자(/admin)와 REST API(/api)는 Next.js 안에서 함께 동작한다.
// DB: 개발은 로컬 SQLite 파일, 운영은 DATABASE_URI 로 Turso(libSQL) 등에 연결.
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ko } from "@payloadcms/translations/languages/ko";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Doctors } from "./collections/Doctors";
import { Posts } from "./collections/Posts";
import { Clinic } from "./globals/Clinic";
import { HomePage } from "./globals/HomePage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // 관리자 UI
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " | 모두의안과 블로그 관리자" },
    // 미리보기 창 기기 크기 (글 작성 중 미리보기)
    livePreview: {
      breakpoints: [
        { label: "모바일", name: "mobile", width: 390, height: 844 },
        { label: "태블릿", name: "tablet", width: 820, height: 1180 },
        { label: "데스크톱", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  // 관리자 UI 한국어
  i18n: { supportedLanguages: { ko }, fallbackLanguage: "ko" },
  collections: [Posts, Categories, Doctors, Media, Users],
  globals: [Clinic, HomePage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  // 프론트/미리보기에서 쓰는 공개 URL
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
});

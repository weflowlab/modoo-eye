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
    meta: {
      titleSuffix: " | 모두의안과 블로그 관리자",
      icons: [{ rel: "icon", type: "image/png", url: "/logo.png" }],
    },
    // 로그인 화면 로고 / 왼쪽 메뉴 로고를 병원 로고로 교체 (스타일은 app/(payload)/custom.scss)
    components: {
      graphics: {
        Logo: "@/components/admin/Logo#Logo",
        Icon: "@/components/admin/Icon#Icon",
      },
    },
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
  // 이메일 발송은 쓰지 않는다 (비밀번호 변경은 관리자 계정 메뉴에서, 분실 시 개발자가 재설정).
  // 어댑터를 비워 두면 매 요청마다 경고가 찍히므로 아무것도 보내지 않는 어댑터를 둔다.
  email: () => ({
    name: "none",
    defaultFromAddress: "noreply@modooeye.kr",
    defaultFromName: "모두의안과 블로그",
    sendEmail: async () => undefined,
  }),
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

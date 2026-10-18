// Payload CMS 설정. 관리자(/admin)와 REST API(/api)는 Next.js 안에서 함께 동작한다.
// DB: 개발은 로컬 SQLite 파일, 운영은 DATABASE_URI 로 Turso(libSQL) 등에 연결.
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
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
      icons: [{ rel: "icon", type: "image/x-icon", url: "/favicon.ico" }], // 메인 페이지(app/icon.png)와 같은 원형 심볼
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
  // 관리자 UI 한국어. 기본 번역에서 조사가 어색한 문구("글를")는 조사가 필요 없는 형태로 바꾼다
  i18n: {
    supportedLanguages: { ko },
    fallbackLanguage: "ko",
    translations: {
      ko: {
        general: {
          aboutToDelete: "{{label}} <1>{{title}}</1> 항목을 삭제하려고 합니다. 계속하시겠습니까?",
          aboutToDeleteCount_one: "{{label}} {{count}}개를 삭제하려고 합니다.",
          aboutToDeleteCount_many: "{{label}} {{count}}개를 삭제하려고 합니다.",
          aboutToDeleteCount_other: "{{label}} {{count}}개를 삭제하려고 합니다.",
          deletedCountSuccessfully: "{{label}} {{count}}개를 삭제했습니다.",
        },
      },
    },
  },
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
  // DB: DATABASE_URI 가 Postgres 주소(Neon)면 Postgres, 없으면 로컬 SQLite 파일(payload.db).
  db: process.env.DATABASE_URI?.startsWith("postgres")
    ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URI || "file:./payload.db", authToken: process.env.DATABASE_AUTH_TOKEN },
        // SQLite 는 쓰기 잠금이 하나뿐이라, 요청 하나가 트랜잭션 안에서 실패하면 잠금이 풀리지 않고 서버 전체가 멈추는 일이 있었다.
        transactionOptions: false,
      }),
  // 이미지 저장소: BLOB_READ_WRITE_TOKEN 이 있으면 Vercel Blob, 없으면 public/media (로컬 개발용)
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          // 공개 블로그라 접근 제어가 필요 없으니 이미지 주소를 Blob CDN 주소로 바로 쓴다 (Payload 서버를 거치지 않음)
          collections: { media: { disablePayloadAccessControl: true } },
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }),
      ]
    : [],
  sharp,
  // 프론트/미리보기에서 쓰는 공개 URL
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
});

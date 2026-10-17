# 모두의안과 웹블로그

대전 둔산동 모두의안과(modooeye.kr)의 병원 웹블로그. 의료진이 쓰는 안과 질환 정보를 검색엔진과 AI 검색에 노출하는 것이 목적이다.
서비스 주소는 `blog.modooeye.kr` (서브도메인) 로 예정.

- **프론트**: Next.js 16 App Router, Tailwind v4, Pretendard
- **관리자(CMS)**: Payload CMS 3 — 같은 프로젝트 안의 `/admin`
- **DB**: 개발은 SQLite 파일(`payload.db`), 운영은 Turso(libSQL) 등 `DATABASE_URI` 로 연결

## 시작하기

```bash
cp .env.example .env     # PAYLOAD_SECRET, PREVIEW_SECRET 을 임의의 긴 문자열로 바꾼다
npm install
npm run dev              # http://localhost:3000
npm run seed             # (dev 서버 실행 중) 샘플 데이터 + 첫 관리자 계정 생성
```

시드가 만드는 관리자 계정은 `admin@modooeye.kr / modoo1234!` (환경변수 `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` 로 변경). **운영 전 반드시 바꿀 것.**
`npm run seed -- ?force=1` 대신 `curl "http://localhost:3000/api/dev-seed?force=1"` 로 글/의료진/카테고리를 지우고 다시 넣을 수 있다.

## 관리자 사용 흐름

1. `/admin` 로그인
2. **글** 작성: 제목·카테고리·작성 의료진·요약·본문(리치텍스트)·FAQ·출처·해시태그·관련 글. 저장하면 **초안**, "발행" 버튼으로 공개.
3. 글 편집 화면 오른쪽 **미리보기** 탭에서 실제 페이지가 보이고, 자동저장될 때마다 갱신된다(초안 상태도 보임).
4. **병원 정보**, **메인 페이지** 글로벌에서 푸터·퀵메뉴·히어로 문구·배너·FAQ 를 수정한다.

발행/수정 시 관련 페이지는 자동으로 다시 생성된다(`revalidatePath`).

## 구조

```
app/(frontend)/        블로그 페이지 (메인, 카테고리, 글 상세, 검색, rss, sitemap)
app/(payload)/         Payload 관리자(/admin)와 REST API(/api)
collections/, globals/ Payload 스키마 (글, 카테고리, 의료진(작성자 카드용), 이미지, 관리자 / 병원 정보, 메인 페이지)
lib/payload.ts         프론트 데이터 계층 (Payload 문서 → lib/types.ts 타입)
lib/mock.ts            시드 데이터 + 시드 전 폴백
components/            UI (레퍼런스 blog.kimsretina.com 레이아웃 기반)
app/globals.css        디자인 토큰. 브랜드 색은 --brand-primary / --brand-secondary 만 바꾸면 전체 반영
```

## 개발 메모

- **Payload CLI(`payload generate:types`)가 이 환경(Node 22 + tsx)에서 깨진다.** 스키마를 바꾼 뒤에는 dev 서버를 띄우고 `npm run payload:generate` 로 `payload-types.ts` 와 `app/(payload)/admin/importMap.js` 를 다시 만든다.
- `cacheComponents` 는 꺼 두었다(Payload 관리자·미리보기와 충돌). 글/의료진 페이지는 `generateStaticParams` 로 정적 생성된다.
- 미리보기는 `/next/preview?path=&previewSecret=` → 관리자 로그인 확인 → draft 모드. `/next/exit-preview` 로 종료.
- 이미지 업로드는 `public/media` 에 저장된다. Vercel 등 디스크가 유지되지 않는 환경에 배포할 때는 S3/Vercel Blob 스토리지 어댑터로 교체해야 한다.

## 배포 전 할 일

- [ ] 카페24 DNS 에 `blog` CNAME 추가 (Vercel 안내값)
- [ ] `NEXT_PUBLIC_SERVER_URL=https://blog.modooeye.kr`, `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `DATABASE_URI`(+`DATABASE_AUTH_TOKEN`) 설정
- [ ] 관리자 비밀번호 변경, 시드 샘플 글 삭제 또는 실제 글로 교체
- [ ] 이미지 스토리지 어댑터 연결
- [ ] 기존 홈페이지 메뉴에 블로그 링크 추가 요청

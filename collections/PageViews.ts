// 방문 기록 컬렉션. 사이트 방문자 브라우저가 /next/v 로 보내는 "어느 페이지를, 어디서 와서, 어떤 기기로 봤는지"를 쌓는다.
// 관리자 메뉴에는 보이지 않고, "유입 관리" 화면(components/admin/TrafficView)이 집계해서 보여 준다.
// 개인을 식별하는 정보(IP·이름 등)는 저장하지 않는다. sessionId 는 기기당 하루 단위 임의 문자열.
import type { CollectionConfig } from "payload";

export const PageViews: CollectionConfig = {
  slug: "page-views",
  labels: { singular: "방문 기록", plural: "방문 기록" },
  admin: { hidden: true },
  // 쓰기는 /next/v 라우트가 Local API 로만 한다. 관리자만 읽고 지울 수 있다
  access: {
    read: ({ req }) => !!req.user,
    create: () => false,
    update: () => false,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: "sessionId", type: "text", required: true, index: true }, // 기기 id + 날짜 (한 방문 = 기기당 하루)
    { name: "path", type: "text", required: true, index: true }, // 본 페이지 경로
    { name: "referrer", type: "text" }, // 들어오기 직전 페이지 주소
    { name: "source", type: "text", index: true }, // 유입 소스: naver / google / kakao / instagram / direct / 도메인
    { name: "medium", type: "text" }, // utm_medium (cpc·paid 면 광고)
    { name: "keyword", type: "text" }, // 광고 키워드 (네이버 파워링크 n_query, utm_term 등)
    { name: "query", type: "text" }, // 블로그 안 검색어 (/search?q=)
    {
      name: "device",
      type: "select",
      options: [
        { label: "모바일", value: "mobile" },
        { label: "태블릿", value: "tablet" },
        { label: "데스크톱", value: "desktop" },
      ],
    },
    {
      name: "event",
      type: "select",
      defaultValue: "view",
      options: [
        { label: "페이지 보기", value: "view" },
        { label: "버튼 클릭", value: "click" },
      ],
    },
    { name: "label", type: "text" }, // 버튼 클릭이면 무엇을 눌렀는지: tel / naver-talk / kakao / homepage
    { name: "durationMs", type: "number" }, // 체류 시간 (페이지를 나갈 때 갱신)
    { name: "maxScroll", type: "number" }, // 스크롤 최대 도달률 %
  ],
};

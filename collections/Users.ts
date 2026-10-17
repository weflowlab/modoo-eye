// 관리자 계정 컬렉션. 병원 담당자가 /admin 에 로그인할 때 사용.
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "관리자", plural: "관리자" },
  auth: true,
  admin: { useAsTitle: "email", group: "설정" },
  fields: [
    { name: "name", label: "이름", type: "text" },
    // email / password 는 auth: true 가 자동 추가
  ],
};

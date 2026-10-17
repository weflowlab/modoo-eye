/* Payload 관리자(/admin)와 API(/api) 전용 루트 레이아웃. 프론트 블로그 레이아웃과 분리된다. */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import "@payloadcms/next/css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "./admin/importMap.js";
import "./custom.scss";

type Args = { children: React.ReactNode };

// 관리자 UI 가 호출하는 서버 함수 엔트리
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;

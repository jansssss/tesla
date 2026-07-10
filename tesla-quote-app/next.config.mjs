import { MERGED_REDIRECTS } from "./lib/mergedGuides.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // 통합된 중복 가이드 → canonical 글로 301 영구 리다이렉트
    const guideRedirects = MERGED_REDIRECTS.map((r) => ({
      source: `/guides/${r.from}`,
      destination: `/guides/${r.to}`,
      permanent: true,
    }));
    // 대표 계산기 URL은 홈(/)으로 통일 — 중복 계산기 페이지를 301로 흡수
    const canonicalRedirects = [
      { source: "/calc/tesla-subsidy", destination: "/", permanent: true },
    ];
    return [...guideRedirects, ...canonicalRedirects];
  },
};

export default nextConfig;

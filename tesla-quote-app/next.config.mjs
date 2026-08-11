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
    // 대표 계산기 URL은 /subsidy 로 통일 — 중복 계산기 페이지를 301로 흡수.
    // (이전에는 홈(/)이 대표였으나, 홈을 랜딩으로 바꾸면서 계산기를 /subsidy로 분리했다)
    const canonicalRedirects = [
      { source: "/calc/tesla-subsidy", destination: "/subsidy", permanent: true },
    ];
    return [...guideRedirects, ...canonicalRedirects];
  },
};

export default nextConfig;

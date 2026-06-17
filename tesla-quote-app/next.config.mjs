import { MERGED_REDIRECTS } from "./lib/mergedGuides.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // 통합된 중복 가이드 → canonical 글로 301 영구 리다이렉트
    return MERGED_REDIRECTS.map((r) => ({
      source: `/guides/${r.from}`,
      destination: `/guides/${r.to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

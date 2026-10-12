import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const regionPage = source("app/subsidy/[region]/page.js");

describe("지역 구매 안내 회귀 검사", () => {
  it("모든 지역 프리셋을 조건을 읽는 보조금 계산기로 보낸다", () => {
    const presets = regionPage.slice(regionPage.indexOf("const presets = ["), regionPage.indexOf("// JSON-LD BreadcrumbList"));
    const urls = [...presets.matchAll(/url: `([^`]+)`/g)].map((match) =>
      new URL(match[1].replace("${repCode}", "1100"), "https://www.paytesla.kr")
    );
    expect(urls).toHaveLength(3);
    expect(urls.map((url) => url.searchParams.get("trim"))).toEqual(["m3-rwd", "m3-lr", "my-rwd"]);
    for (const url of urls) {
      expect(url.pathname).toBe("/subsidy");
      expect(url.searchParams.get("region")).toBe("1100");
      expect(url.searchParams.get("months")).toBe("60");
      expect(url.searchParams.get("rate")).toBe("3.6");
    }
    expect(regionPage).not.toContain("`/?");
    expect(source("components/seo/RegionDistrictSelector.js")).toContain("router.push(`/subsidy?region=${code}&model=model3&trim=m3-rwd`)");
  });

  it("자료 날짜를 지역 표와 FAQ까지 전달하고 최신이라고 단정하지 않는다", () => {
    for (const component of ["RegionHero", "RegionSubsidyTable", "RegionFAQ", "RegionDecisionGuide"]) {
      expect(regionPage).toMatch(new RegExp(`<${component}[^>]+dataDate=\\{snapshot.dataDate\\}`));
    }
    expect(regionPage).not.toContain("최신 데이터");
    expect(source("components/seo/RegionHero.js")).not.toContain("5종");
    expect(source("components/seo/RegionHero.js")).toContain("stats.statsByModel.filter((s) => s.max > 0).length");
  });

  it("홈·도구·FAQ는 현재 예산을 조회한다고 주장하지 않는다", () => {
    for (const file of ["components/home/HomeHero.js", "app/subsidy/page.js", "components/seo/RegionFAQ.js"]) {
      expect(source(file)).toContain("실시간");
      expect(source(file)).toContain("잔여 예산");
    }
    expect(source("components/seo/RegionFAQ.js")).not.toContain("REGION_CONTEXT");
  });

  it("확인 가능한 공식 출처와 왕복 탐색 경로를 유지한다", () => {
    const guide = source("components/seo/RegionDecisionGuide.js");
    expect(guide).toContain("https://news.seoul.go.kr/env/archives/570727");
    expect(guide).toContain("https://www.tesla.com/ko_KR/support/faq");
    expect(guide).toContain('href="/guides"');
    for (const file of ["components/home/HomeHero.js", "app/guides/page.js", "app/subsidy/page.js"]) {
      expect(source(file)).toContain('href="/subsidy/seoul#decision-guide"');
    }
  });
});

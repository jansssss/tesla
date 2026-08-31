import { describe, expect, it } from "vitest";
import { isGuideNew, NEW_GUIDE_WINDOW_DAYS } from "../lib/guideFreshness.js";

const NOW = new Date("2026-08-31T03:00:00Z"); // 한국 시각 2026-08-31 정오

describe("가이드 NEW 표시", () => {
  it("발행 당일부터 21일 동안 표시한다", () => {
    expect(NEW_GUIDE_WINDOW_DAYS).toBe(21);
    expect(isGuideNew({ publishedAt: "2026-08-31" }, NOW)).toBe(true);
    expect(isGuideNew({ publishedAt: "2026-08-11" }, NOW)).toBe(true);
  });

  it("발행 후 21일이 지나면 표시하지 않는다", () => {
    expect(isGuideNew({ publishedAt: "2026-08-10" }, NOW)).toBe(false);
    expect(isGuideNew({ publishedAt: "2025-08-31" }, NOW)).toBe(false);
  });

  it("재검토일이나 기존 isNew 값으로 신규 글을 가장하지 않는다", () => {
    expect(
      isGuideNew(
        { publishedAt: "2026-06-24", updatedAt: "2026-08-28", isNew: true },
        NOW
      )
    ).toBe(false);
  });

  it("Supabase 날짜 필드도 같은 기준으로 판정한다", () => {
    expect(isGuideNew({ published_at: "2026-08-30T00:00:00.000Z" }, NOW)).toBe(true);
  });

  it("미래 날짜, 누락 값, 잘못된 날짜는 표시하지 않는다", () => {
    expect(isGuideNew({ publishedAt: "2026-09-01" }, NOW)).toBe(false);
    expect(isGuideNew({}, NOW)).toBe(false);
    expect(isGuideNew({ publishedAt: "2026-02-31" }, NOW)).toBe(false);
  });
});

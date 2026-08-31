const DAY_MS = 24 * 60 * 60 * 1000;

export const NEW_GUIDE_WINDOW_DAYS = 21;

function parseDateStamp(value) {
  if (typeof value !== "string") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const stamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(stamp);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return stamp;
}

function getSeoulTodayStamp(now) {
  const date = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
}

/** 실제 발행일을 기준으로 한국 날짜상 21일 동안만 NEW를 표시한다. */
export function isGuideNew(guide, now = new Date()) {
  const publishedStamp = parseDateStamp(guide?.publishedAt || guide?.published_at);
  const todayStamp = getSeoulTodayStamp(now);
  if (publishedStamp === null || todayStamp === null) return false;

  const ageInDays = Math.floor((todayStamp - publishedStamp) / DAY_MS);
  return ageInDays >= 0 && ageInDays < NEW_GUIDE_WINDOW_DAYS;
}

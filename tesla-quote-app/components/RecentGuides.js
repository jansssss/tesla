import Link from "next/link";
import { fetchRecentGuides } from "@/lib/supabase-server";
import { normalizeCategory } from "@/lib/categories";

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${year}.${String(parseInt(month)).padStart(2, "0")}.${String(parseInt(day)).padStart(2, "0")}`;
}

const CATEGORY_COLORS = {
  "보조금": "bg-violet-50 text-violet-700",
  "충전": "bg-amber-50 text-amber-700",
  "모델·비교": "bg-rose-50 text-rose-700",
  "구매 가이드": "bg-sky-50 text-sky-700",
  "구매·금융": "bg-blue-50 text-blue-700",
  "유지비·세제": "bg-emerald-50 text-emerald-700",
  "총소유비용": "bg-teal-50 text-teal-700",
  "FSD·자율주행": "bg-indigo-50 text-indigo-700",
  "가격 전략": "bg-orange-50 text-orange-700",
  "소유·관리": "bg-slate-100 text-slate-700",
};

export default async function RecentGuides() {
  const guides = await fetchRecentGuides(6);

  if (!guides || guides.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            최근 게시물
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            새로 올라온 전기차·자동차 가이드
          </h2>
        </div>
        <Link
          href="/guides"
          className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
        >
          전체 보기
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
                  CATEGORY_COLORS[normalizeCategory(guide.category)] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {normalizeCategory(guide.category)}
              </span>
              <span className="text-xs text-slate-400">
                {guide.published_at ? formatDate(guide.published_at) : ""}
              </span>
            </div>
            <h3 className="mt-3 text-base font-black leading-snug tracking-tight text-slate-950 transition group-hover:text-blue-700">
              {guide.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {guide.description}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {guide.read_time}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RecentGuidesSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-7">
        <div className="h-4 w-24 rounded-full bg-slate-100" />
        <div className="mt-3 h-8 w-64 rounded-xl bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-[24px] border border-slate-100 bg-white p-5">
            <div className="flex justify-between">
              <div className="h-5 w-16 rounded-full bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-100" />
            </div>
            <div className="mt-3 h-5 w-full rounded bg-slate-100" />
            <div className="mt-1 h-5 w-4/5 rounded bg-slate-100" />
            <div className="mt-2 h-4 w-full rounded bg-slate-50" />
            <div className="mt-1 h-4 w-3/4 rounded bg-slate-50" />
            <div className="mt-4 h-4 w-12 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

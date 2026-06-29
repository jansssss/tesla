import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGuides, getGuideBySlug, isArchivedStaticSlug } from "@/lib/guides";
import { isArchivedSupabaseSlug } from "@/lib/archivedGuides";
import { fetchGuideBySlug } from "@/lib/supabase-server";
import AdminEditButton from "@/components/AdminEditButton";
import AuthorBio from "@/components/AuthorBio";
import { calcCtaForCategory } from "@/lib/calcLinks";
import { normalizeCategory } from "@/lib/categories";


const SITE_URL = "https://paytesla.kr";

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

function ChevronLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export async function generateStaticParams() {
  // 자동생성 글은 전부 archived → 정적 생성하지 않는다.
  //  - 정적 guides.js: 전부 archived (getAllStaticGuides()는 빈 배열)
  //  - Supabase: content_html(사람 작성)이 있는 글만 생성. content_html 없는 자동생성 글은 제외.
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/guides?select=slug&content_html=not.is.null&order=created_at.desc`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (res.ok) {
        const rows = await res.json();
        return rows
          .filter((r) => !isArchivedSupabaseSlug(r.slug))
          .map((r) => ({ slug: r.slug }));
      }
    }
  } catch {}

  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const staticGuide = getGuideBySlug(slug);
  const guide = staticGuide ?? await fetchGuideBySlug(slug);

  // 자동생성 글은 archived → 404 처리하므로 메타도 noindex 404로 통일:
  //  (1) 정적 guides.js 글 (전부 자동생성)
  //  (2) Supabase 자동생성 글(content_html 없음)
  const isArchived =
    !guide ||
    isArchivedStaticSlug(slug) ||
    isArchivedSupabaseSlug(slug) ||
    (!staticGuide && !guide.contentHtml);

  if (isArchived) {
    return {
      title: "가이드를 찾을 수 없습니다 - 하우머치 테슬라",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${guide.title} - 하우머치 테슬라`,
    description: guide.description,
  };
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const staticGuide = getGuideBySlug(slug);
  const guide = staticGuide ?? await fetchGuideBySlug(slug);

  // 자동생성 글은 archived → 본문 노출 없이 404.
  //  (1) 정적 guides.js 글 (전부 자동생성)
  //  (2) Supabase 자동생성 글(content_html 없음)
  if (
    !guide ||
    isArchivedStaticSlug(slug) ||
    isArchivedSupabaseSlug(slug) ||
    (!staticGuide && !guide.contentHtml)
  ) {
    notFound();
  }

  // 관련글: 공개 가이드(getAllGuides)만 — archived 글로는 링크하지 않는다.
  const allGuides = getAllGuides();
  const total = allGuides.length;
  let relatedGuides = [];
  if (total > 0) {
    const currentIdx = allGuides.findIndex((g) => g.slug === guide.slug);
    if (guide.relatedSlugs && guide.relatedSlugs.length > 0) {
      relatedGuides = guide.relatedSlugs
        .map((s) => allGuides.find((g) => g.slug === s))
        .filter(Boolean)
        .filter((g) => g.slug !== guide.slug)
        .slice(0, 3);
    } else if (currentIdx >= 0) {
      relatedGuides = [
        allGuides[(currentIdx + Math.floor(total / 4)) % total],
        allGuides[(currentIdx + Math.floor(total / 2)) % total],
        allGuides[(currentIdx + Math.floor((3 * total) / 4)) % total]
      ].filter((g) => g && g.slug !== guide.slug);
    }
  }

  // 카테고리에 맞는 계산기로 연결하는 맥락 딥링크 CTA
  const calcCta = calcCtaForCategory(guide.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    url: `${SITE_URL}/guides/${guide.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/${guide.slug}`
    },
    author: {
      "@type": "Person",
      name: "jans",
      url: `${SITE_URL}/about`
    },
    publisher: {
      "@type": "Organization",
      name: "하우머치 테슬라",
      url: SITE_URL
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 md:px-8">
      <div className="grid gap-8">
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <header className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_46%,#2563eb_100%)] px-6 py-10 text-white md:px-10 md:py-14">
            <div className="flex items-center justify-between">
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-200 transition hover:text-white"
              >
                <ChevronLeft />
                정보성 가이드 목록
              </Link>
              <AdminEditButton slug={guide.slug} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{normalizeCategory(guide.category)}</span>
              <span className="text-blue-300">{formatDate(guide.updatedAt)}</span>
              <span className="text-blue-300">{guide.readTime}</span>
            </div>
            <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
              {guide.description}
            </p>
          </header>

          <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10">
            {/* 목차 */}
            {!guide.contentHtml && guide.sections && guide.sections.length > 1 && (
              <nav className="rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-label="목차">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">목차</p>
                <ol className="space-y-2">
                  {guide.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-blue-700 transition-colors group"
                      >
                        <span className="shrink-0 text-[11px] font-mono text-slate-400 group-hover:text-blue-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* 인아티클 계산기 CTA — 자동생성(sections) 글에만. 직접작성 글은 본문 우선 + 하단 CTA로 충분 */}
            {!guide.contentHtml && (
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shrink-0">
                  🧮
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">직접 계산해보세요</p>
                  <p className="text-xs text-blue-600">가이드 내용을 내 조건으로 확인</p>
                </div>
              </div>
              <Link
                href={calcCta.href}
                className="flex items-center justify-between p-3.5 bg-white border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {calcCta.button}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{calcCta.desc}</p>
                </div>
                <ArrowRight />
              </Link>
            </div>
            )}

            {guide.contentHtml ? (
              /* 관리자가 HTML 편집한 경우 */
              <div
                className="guide-html-content"
                dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
              />
            ) : (
              <div className="grid gap-10">
                {guide.sections.map((section, index) => (
                  <section key={`${section.title}-${index}`} id={`section-${index}`} className="scroll-mt-20">
                    <div className="flex items-baseline gap-3">
                      <span className="shrink-0 font-black tabular-nums text-blue-400" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{section.title}</h2>
                    </div>
                    <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 md:text-base">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.bullets ? (
                      <ul className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700 md:text-base">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3">
                            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.table ? (
                      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-950 text-white">
                              {section.table.headers.map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                {row.map((cell, j) => (
                                  <td key={j} className={`px-4 py-3 ${j === 0 ? "font-semibold text-slate-900" : "text-slate-600"}`}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    {section.callout ? (
                      <div className="mt-5 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-5 text-sm leading-7 text-slate-700 md:text-base">
                        {section.callout}
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>
            )}

            {guide.sources && guide.sources.length > 0 ? (
              <section className="border-t border-slate-100 pt-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">참고 출처</h2>
                <ul className="mt-3 space-y-2">
                  {guide.sources.map((source) => (
                    <li key={source.url} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {source.name}
                      </a>
                      {source.accessedAt ? (
                        <span className="text-slate-400">({formatDate(source.accessedAt)} 기준)</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </article>

        <AuthorBio />

        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] md:p-10">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            {calcCta.shortLabel} 계산기
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
            {calcCta.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-200 md:text-base">
            {calcCta.desc}
          </p>
          <Link
            href={calcCta.href}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
          >
            {calcCta.button}
            <ArrowRight />
          </Link>
        </section>

        {relatedGuides.length > 0 && (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                다음 읽을 글
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                함께 보면 연결되는 가이드
              </h2>
            </div>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              전체 가이드 보기
              <ChevronRight />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedGuides.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {normalizeCategory(item.category)}
                </span>
                <h3 className="mt-2.5 text-base font-black leading-snug text-slate-950 transition group-hover:text-blue-700">{item.title}</h3>
                <p className="mt-2.5 text-xs leading-6 text-slate-500">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
        )}
      </div>{/* grid */}
      </div>{/* max-w-4xl */}
    </main>
  );
}

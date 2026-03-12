import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    slug: guide.slug
  }));
}

export function generateMetadata({ params }) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: "가이드를 찾을 수 없습니다 - 하우머치 테슬라"
    };
  }

  return {
    title: `${guide.title} - 하우머치 테슬라`,
    description: guide.description
  };
}

export default function GuideDetailPage({ params }) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getAllGuides()
    .filter((item) => item.slug !== guide.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 md:px-8">
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <header className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_46%,#2563eb_100%)] px-6 py-10 text-white md:px-10 md:py-14">
            <Link href="/guides" className="text-sm font-semibold text-blue-100 transition hover:text-white">
              ← 정보성 가이드 목록
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
              <span className="rounded-full bg-white/10 px-3 py-1">{guide.category}</span>
              <span>{guide.updatedAt}</span>
              <span>{guide.readTime}</span>
            </div>
            <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
              {guide.description}
            </p>
          </header>

          <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10">
            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black text-slate-950 md:text-xl">핵심 요약</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700 md:text-base">
                {guide.keyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-5">
              {guide.sections.map((section, index) => (
                <section
                  key={`${section.title}-${index}`}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">{section.title}</h2>
                  </div>
                  <div className="mt-5 space-y-4 text-sm leading-8 text-slate-700 md:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-5 space-y-3 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 md:text-base">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-slate-950" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {section.callout ? (
                    <div className="mt-5 rounded-3xl bg-[linear-gradient(135deg,#1d4ed8_0%,#4338ca_100%)] p-5 text-sm leading-7 text-white md:text-base">
                      {section.callout}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </article>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                다음 읽을 글
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                함께 보면 연결되는 가이드
              </h2>
            </div>
            <Link href="/guides" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              전체 가이드 보기
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedGuides.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {item.category}
                </span>
                <h3 className="mt-3 text-xl font-black leading-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

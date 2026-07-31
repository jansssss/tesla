import Link from "next/link";
import { relatedCalculators } from "@/lib/calculators";

/**
 * 계산기 페이지 본문 렌더러.
 *
 * 기존 CalcArticle은 모든 계산기에 '계산기 소개 / 입력 항목 / 계산 공식 / 예시 계산 /
 * FAQ / 출처'라는 동일한 H2 6개를 강제했다. 7개 페이지가 같은 골격을 반복하면
 * 검색엔진에는 자동생성 콘텐츠로 읽힌다.
 *
 * 이 컴포넌트는 골격을 고정하지 않는다. 페이지가 자기만의 섹션 제목과 블록 구성을
 * 직접 정의하고, 여기서는 블록 종류별 렌더링만 담당한다.
 *
 * @typedef {Object} Block
 * @property {"text"|"list"|"steps"|"table"|"callout"|"formula"|"compare"|"faq"} type
 *
 * @param {Object} props
 * @param {Array<{heading:string, lead?:string, blocks:Block[]}>} props.sections
 * @param {string} props.currentHref  현재 계산기 경로(관련 계산기에서 제외)
 * @param {string} [props.dataDate]   데이터 기준일(YYYY-MM-DD)
 * @param {string} [props.dataNote]   기준일 옆 보충 설명(페이지별로 다르게 쓴다)
 * @param {Array<{name:string, url?:string, note?:string}>} [props.sources]
 * @param {string} [props.relatedHeading] 관련 계산기 섹션 제목(페이지별로 다르게 쓴다)
 */
export default function CalcContent({
  sections = [],
  currentHref,
  dataDate,
  dataNote,
  sources = [],
  relatedHeading = "함께 계산하면 좋은 항목",
}) {
  const related = relatedCalculators(currentHref);

  // FAQ 블록이 있으면 FAQPage 구조화 데이터를 만든다.
  const faqItems = sections.flatMap((s) =>
    s.blocks.filter((b) => b.type === "faq").flatMap((b) => b.items)
  );
  const faqJsonLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 pb-16 space-y-6">
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      {sections.map((section) => (
        <section
          key={section.heading}
          className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8"
        >
          <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-950">
            {section.heading}
          </h2>
          {section.lead ? (
            <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">{section.lead}</p>
          ) : null}
          <div className="mt-5 space-y-5">
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </section>
      ))}

      {/* 데이터 기준일 · 출처 */}
      {dataDate || sources.length ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
            데이터 기준일 · 출처
          </h2>
          {dataDate ? (
            <p className="mt-3 text-sm text-slate-600">
              데이터 기준일: <strong className="text-slate-900">{dataDate}</strong>
            </p>
          ) : null}
          {dataNote ? (
            <p className="mt-1.5 text-xs leading-6 text-slate-500">{dataNote}</p>
          ) : null}
          {sources.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {sources.map((s) => (
                <li key={s.name} className="text-sm text-slate-600">
                  <span className="mr-1.5 inline-block h-1 w-1 -translate-y-[3px] rounded-full bg-slate-300" />
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {s.name}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-700">{s.name}</span>
                  )}
                  {s.note ? <span className="text-slate-500"> — {s.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* 관련 계산기 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-950 mb-4">
          {relatedHeading}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((c) => (
            <Link
              key={c.href + c.label}
              href={c.href}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white"
            >
              <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
                {c.label}
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-slate-500">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── 블록 렌더러 ─────────────────────────────────────────── */

function Block({ block }) {
  switch (block.type) {
    case "text":
      return (
        <div className="space-y-3 text-sm md:text-base leading-7 text-slate-600">
          {block.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      );

    case "list":
      return (
        <div>
          {block.title ? (
            <h3 className="mb-2.5 text-sm md:text-base font-bold text-slate-900">{block.title}</h3>
          ) : null}
          <ul className="space-y-2">
            {block.items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-sm leading-7 text-slate-600">
                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "steps":
      return (
        <div>
          {block.title ? (
            <h3 className="mb-3 text-sm md:text-base font-bold text-slate-900">{block.title}</h3>
          ) : null}
          <ol className="space-y-3">
            {block.items.map((it, i) => (
              <li key={it} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-7 text-slate-600">{it}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "table":
      return (
        <div>
          {block.title ? (
            <h3 className="mb-3 text-sm md:text-base font-bold text-slate-900">{block.title}</h3>
          ) : null}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {block.headers.map((h) => (
                    <th
                      key={h}
                      className="border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-100 last:border-0">
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-3 leading-6 ${
                          ci === 0 ? "font-semibold text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note ? (
            <p className="mt-2.5 text-xs leading-6 text-slate-500">{block.note}</p>
          ) : null}
        </div>
      );

    case "callout":
      return (
        <div
          className={`rounded-xl border-l-4 p-4 text-sm leading-7 ${
            block.tone === "warn"
              ? "border-amber-400 bg-amber-50 text-amber-900"
              : block.tone === "danger"
                ? "border-red-400 bg-red-50 text-red-900"
                : "border-blue-500 bg-blue-50 text-slate-800"
          }`}
        >
          {block.title ? <strong className="block mb-1">{block.title}</strong> : null}
          {block.text}
        </div>
      );

    case "formula":
      return (
        <div>
          {block.title ? (
            <h3 className="mb-3 text-sm md:text-base font-bold text-slate-900">{block.title}</h3>
          ) : null}
          <div className="overflow-x-auto rounded-xl bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100">
            {block.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          {block.note ? (
            <p className="mt-2.5 text-xs leading-6 text-slate-500">{block.note}</p>
          ) : null}
        </div>
      );

    case "compare":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.columns.map((col) => (
            <div
              key={col.title}
              className={`rounded-xl border p-4 ${
                col.tone === "good"
                  ? "border-emerald-200 bg-emerald-50"
                  : col.tone === "bad"
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <h3
                className={`text-sm font-black ${
                  col.tone === "good"
                    ? "text-emerald-900"
                    : col.tone === "bad"
                      ? "text-red-900"
                      : "text-slate-900"
                }`}
              >
                {col.title}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {col.items.map((it) => (
                  <li key={it} className="text-sm leading-6 text-slate-600">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((f) => (
            <div key={f.q} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-sm md:text-base font-bold text-slate-900">{f.q}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

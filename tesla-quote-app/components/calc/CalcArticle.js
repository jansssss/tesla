import Link from "next/link";
import { relatedCalculators } from "@/lib/calculators";

/**
 * 계산기 페이지 공용 SEO 본문 템플릿 (서버 컴포넌트)
 * 구성: 1) 계산기 소개 2) 입력 항목 설명 3) 계산 공식 4) 예시 계산
 *       5) 자주 묻는 질문(FAQPage JSON-LD) 6) 데이터 기준일·출처 7) 관련 계산기
 *
 * @param {Object} props
 * @param {string} props.currentHref      현재 계산기 경로(관련 계산기에서 제외)
 * @param {string} props.intro            계산기 소개 문단(여러 문단은 \n\n로 구분)
 * @param {Array<{name:string, desc:string}>} props.inputs   입력 항목 설명
 * @param {string[]} props.formula        계산 공식(코드/수식 라인)
 * @param {{lead:string, steps:string[], result:string}} props.example  예시 계산
 * @param {Array<{q:string, a:string}>} props.faqs           FAQ
 * @param {string} props.dataDate         데이터 기준일(YYYY-MM-DD)
 * @param {Array<{name:string, url?:string}>} props.sources  데이터 출처
 */
export default function CalcArticle({
  currentHref,
  intro,
  inputs = [],
  formula = [],
  example,
  faqs = [],
  dataDate,
  sources = [],
}) {
  const related = relatedCalculators(currentHref);
  const introParas = (intro || "").split("\n\n").filter(Boolean);

  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 pb-16 space-y-8">
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      {/* 1. 계산기 소개 */}
      {introParas.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">계산기 소개</h2>
          <div className="space-y-3 text-sm md:text-base leading-7 text-slate-600">
            {introParas.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {/* 2. 입력 항목 설명 */}
      {inputs.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">입력 항목 설명</h2>
          <dl className="space-y-3">
            {inputs.map((it) => (
              <div key={it.name} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <dt className="text-sm font-bold text-slate-900">{it.name}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600">{it.desc}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* 3. 계산 공식 */}
      {formula.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">계산 공식</h2>
          <div className="rounded-xl bg-slate-950 p-5 text-sm leading-7 text-slate-100 font-mono overflow-x-auto">
            {formula.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 4. 예시 계산 */}
      {example ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">예시 계산</h2>
          <p className="text-sm md:text-base leading-7 text-slate-600">{example.lead}</p>
          <ul className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {example.steps.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm font-semibold text-slate-800">
            {example.result}
          </div>
        </section>
      ) : null}

      {/* 5. 자주 묻는 질문 */}
      {faqs.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">자주 묻는 질문</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="text-sm md:text-base font-bold text-slate-900">{f.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 6. 데이터 기준일·출처 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 mb-3">
          데이터 기준일 · 출처
        </h2>
        {dataDate ? (
          <p className="text-sm text-slate-600">
            데이터 기준일: <strong className="text-slate-900">{dataDate}</strong>
          </p>
        ) : null}
        <p className="mt-1 text-xs leading-6 text-slate-500">
          본 계산기의 기본값은 공개 자료를 바탕으로 한 가정값이며 실제 비용과 다를 수 있습니다.
          충전 단가·보험료·세금은 사용자 조건에 따라 직접 조정해 사용하세요.
        </p>
        {sources.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {sources.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {s.name}
                  </a>
                ) : (
                  <span>{s.name}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* 7. 관련 계산기 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">관련 계산기</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((c) => (
            <Link
              key={c.href}
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

import Link from "next/link";
import { Block } from "@/components/calc/CalcContent";
import { CALCULATORS } from "@/lib/calculators";

const CALC_BY_HREF = Object.fromEntries(CALCULATORS.map((c) => [c.href, c]));

/**
 * 답변 페이지 본문 렌더러.
 *
 * 계산기 페이지(CalcContent)와 블록 스키마를 공유하되, 골격은 다르다.
 * - 상단에 '핵심 답변' 요약 — 검색자가 스크롤 없이 결론을 본다
 * - 본문 중간에 맥락형 내부링크 3개 — 단순 '다음 글' 하나만 두지 않는다
 * - 하단에 여정의 다음 지점 — 30번 다음은 1번으로 돌아오는 폐쇄형 구조
 *
 * @param {Object} props
 * @param {import("@/lib/answers").ANSWERS[number]} props.answer
 * @param {{label:string, href:string, note?:string}|null} props.nextStop
 * @param {{label:string, href:string, note?:string}|null} props.prevStop
 */
export default function AnswerArticle({ answer, nextStop, prevStop }) {
  const {
    sections = [],
    contextLinks = [],
    sources = [],
    dataNote,
    calcCta,
  } = answer;

  const cta = calcCta ? CALC_BY_HREF[calcCta] : null;

  // 본문 중간 삽입 위치 — 두 번째 섹션 뒤(내용을 어느 정도 읽은 시점)
  const insertAfter = Math.min(1, Math.max(sections.length - 2, 0));

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 pb-16 space-y-6">
      {sections.map((section, si) => (
        <div key={section.heading} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-950">
              {section.heading}
            </h2>
            {section.lead ? (
              <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">{section.lead}</p>
            ) : null}
            <div className="mt-5 space-y-5">
              {section.blocks.map((block, bi) => (
                <Block key={bi} block={block} />
              ))}
            </div>
          </section>

          {si === insertAfter && contextLinks.length > 0 ? (
            <ContextLinks links={contextLinks} />
          ) : null}
        </div>
      ))}

      {/* 대표 계산기 CTA */}
      {cta ? (
        <section className="rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-6 md:p-8 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            숫자로 확인하기
          </p>
          <h2 className="mt-3 text-lg md:text-xl font-black">{cta.label}</h2>
          <p className="mt-2 text-sm leading-7 text-blue-100/80">{cta.desc}</p>
          <Link
            href={cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
          >
            {cta.shortLabel} 계산기 열기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      ) : null}

      {/* 데이터 기준일 · 출처 */}
      {dataNote || sources.length ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
            데이터 기준 · 출처
          </h2>
          {dataNote ? (
            <p className="mt-3 text-xs leading-6 text-slate-500">{dataNote}</p>
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

      {/* 여정 이동 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-950">
          다음으로 많이 확인하는 내용
        </h2>
        {nextStop ? (
          <Link
            href={nextStop.href}
            className="group mt-4 block rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-white"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
              다음 단계
            </span>
            <h3 className="mt-2 text-base font-black text-slate-900 group-hover:text-blue-700">
              {nextStop.label}
            </h3>
            {nextStop.note ? (
              <p className="mt-1.5 text-xs leading-6 text-slate-500">{nextStop.note}</p>
            ) : null}
          </Link>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {prevStop ? (
            <Link
              href={prevStop.href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              이전: {prevStop.label}
            </Link>
          ) : null}
          <Link
            href="/answers"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            전체 질문 목록 보기
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── 맥락형 내부링크 ───────────────────────────────────────── */

function ContextLinks({ links }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
        여기서 함께 확인하면 좋은 것
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="group rounded-xl border border-blue-100 bg-white p-4 transition hover:border-blue-300"
          >
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
              {l.label}
            </h3>
            {l.why ? (
              <p className="mt-1.5 text-xs leading-6 text-slate-500">{l.why}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

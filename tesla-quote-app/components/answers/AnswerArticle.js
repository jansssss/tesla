import Link from "next/link";
import { Block } from "@/components/calc/CalcContent";
import { CALCULATORS } from "@/lib/calculators";

const CALC_BY_HREF = Object.fromEntries(CALCULATORS.map((c) => [c.href, c]));

/**
 * 답변 페이지 본문 렌더러.
 *
 * 골격은 '먼저 묻고, 그다음 답한다'는 순서를 그대로 화면에 옮긴 것이다.
 *  1. 이 글이 답하는 질문 목록 — 목차이자 검색자의 의도 확인 지점
 *  2. 질문 단위 본문 — 각 섹션에 Q 번호와 앵커를 붙여 목록과 1:1로 연결
 *  3. 본문 중간 맥락형 내부링크 3개
 *  4. 계산기 CTA → 출처 → 같은 주제의 다른 질문 → 여정의 다음 지점
 *
 * 섹션 제목이 서술형인 글도 있으므로, 질문 문장을 따로 쓰고 싶으면
 * 콘텐츠에서 section.ask 를 채우면 된다(없으면 heading을 그대로 쓴다).
 *
 * @param {Object} props
 * @param {import("@/lib/answers").ANSWERS[number]} props.answer
 * @param {{label:string, href:string, note?:string}|null} props.nextStop
 * @param {{label:string, href:string, note?:string}|null} props.prevStop
 * @param {Array<{slug:string, question:string, heroSub?:string}>} [props.siblings]
 * @param {string} [props.groupLabel]
 */
export default function AnswerArticle({
  answer,
  nextStop,
  prevStop,
  siblings = [],
  groupLabel,
}) {
  const {
    sections = [],
    contextLinks = [],
    sources = [],
    dataNote,
    calcCta,
  } = answer;

  const cta = calcCta ? CALC_BY_HREF[calcCta] : null;

  // 목차용 질문 목록 — 콘텐츠가 ask를 채우지 않았으면 섹션 제목을 쓴다.
  const asks = sections.map((s, i) => ({
    id: `q-${i + 1}`,
    label: s.ask ?? s.heading,
  }));

  // 본문에 흩어진 faq 블록 — 개수만 목차에 안내한다(본문 위치는 그대로 둔다).
  const faqCount = sections.reduce(
    (n, s) => n + s.blocks.filter((b) => b.type === "faq").reduce((m, b) => m + b.items.length, 0),
    0
  );

  // 본문 중간 삽입 위치 — 두 번째 섹션 뒤(내용을 어느 정도 읽은 시점)
  const insertAfter = Math.min(1, Math.max(sections.length - 2, 0));

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 md:px-8">
      {/* ── 이 글이 답하는 질문 ── */}
      {asks.length > 0 ? (
        <nav
          aria-label="이 글이 답하는 질문"
          className="rounded-2xl border border-tesla-line bg-white p-6 md:p-8"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-blue">
            이 글이 답하는 질문
          </p>
          <ol className="mt-4 space-y-1.5">
            {asks.map((a, i) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className="group flex items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-tesla-mist"
                >
                  <span className="mt-[3px] shrink-0 text-[11px] font-black tabular-nums text-slate-300 group-hover:text-tesla-blue">
                    Q{i + 1}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-tesla-ink group-hover:text-tesla-blue">
                    {a.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          {faqCount > 0 ? (
            <p className="mt-3 border-t border-tesla-line pt-3 text-xs text-slate-400">
              본문 안에 짧게 답하는 추가 질문 {faqCount}개가 함께 들어 있습니다.
            </p>
          ) : null}
        </nav>
      ) : null}

      {/* ── 질문 단위 본문 ── */}
      {sections.map((section, si) => (
        <div key={section.heading} className="space-y-6">
          <section
            id={`q-${si + 1}`}
            className="scroll-mt-24 rounded-2xl border border-tesla-line bg-white p-6 md:p-8"
          >
            <p className="text-[11px] font-black tracking-[0.2em] text-tesla-blue">Q{si + 1}</p>
            <h2 className="mt-2 text-lg font-black tracking-tight text-tesla-ink md:text-xl">
              {section.ask ?? section.heading}
            </h2>
            {section.lead ? (
              <p className="mt-3 text-sm leading-7 text-tesla-ink70 md:text-base">{section.lead}</p>
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
        <section className="rounded-2xl bg-tesla-ink p-6 text-white md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            숫자로 확인하기
          </p>
          <h2 className="mt-3 text-lg font-black md:text-xl">{cta.label}</h2>
          <p className="mt-2 text-sm leading-7 text-white/70">{cta.desc}</p>
          <Link
            href={cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-tesla-ink transition hover:bg-tesla-blueSoft"
          >
            {cta.shortLabel} 계산기 열기
            <ArrowRight />
          </Link>
        </section>
      ) : null}

      {/* 데이터 기준일 · 출처 */}
      {dataNote || sources.length ? (
        <section className="rounded-2xl border border-tesla-line bg-tesla-mist/60 p-6 md:p-8">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
            데이터 기준 · 출처
          </h2>
          {dataNote ? <p className="mt-3 text-xs leading-6 text-slate-500">{dataNote}</p> : null}
          {sources.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {sources.map((s) => (
                <li key={s.name} className="text-sm text-tesla-ink70">
                  <span className="mr-1.5 inline-block h-1 w-1 -translate-y-[3px] rounded-full bg-slate-300" />
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-tesla-blue hover:underline"
                    >
                      {s.name}
                    </a>
                  ) : (
                    <span className="font-medium text-tesla-ink">{s.name}</span>
                  )}
                  {s.note ? <span className="text-slate-500"> — {s.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* 같은 주제에서 이어서 묻는 질문 */}
      {siblings.length > 0 ? (
        <section className="rounded-2xl border border-tesla-line bg-white p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {groupLabel ? `${groupLabel} · 이어지는 질문` : "이어지는 질문"}
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/answers/${s.slug}`}
                className="group rounded-xl border border-tesla-line bg-tesla-mist/50 p-4 transition hover:border-tesla-blue hover:bg-white"
              >
                <span className="block text-sm font-bold leading-snug text-tesla-ink group-hover:text-tesla-blue">
                  {s.question}
                </span>
                {s.heroSub ? (
                  <span className="mt-1.5 block text-xs leading-6 text-slate-500">{s.heroSub}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 여정 이동 */}
      <section className="rounded-2xl border border-tesla-line bg-white p-6 md:p-8">
        <h2 className="text-lg font-black tracking-tight text-tesla-ink md:text-xl">
          다음으로 많이 확인하는 내용
        </h2>
        {nextStop ? (
          <Link
            href={nextStop.href}
            className="group mt-4 block rounded-xl border border-tesla-line bg-tesla-mist/50 p-5 transition hover:border-tesla-blue hover:bg-white"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-blue">
              다음 단계
            </span>
            <h3 className="mt-2 text-base font-black text-tesla-ink group-hover:text-tesla-blue">
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
              className="inline-flex items-center gap-1.5 rounded-md border border-tesla-line bg-white px-4 py-2 text-xs font-semibold text-tesla-ink70 transition hover:border-tesla-ink hover:text-tesla-ink"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              이전: {prevStop.label}
            </Link>
          ) : null}
          <Link
            href="/answers"
            className="inline-flex items-center gap-1.5 rounded-md border border-tesla-line bg-white px-4 py-2 text-xs font-semibold text-tesla-ink70 transition hover:border-tesla-ink hover:text-tesla-ink"
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
    <section className="rounded-2xl border border-tesla-blue/20 bg-tesla-blueSoft p-6 md:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-blue">
        여기서 함께 확인하면 좋은 것
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="group rounded-xl border border-tesla-blue/20 bg-white p-4 transition hover:border-tesla-blue"
          >
            <h3 className="text-sm font-black text-tesla-ink group-hover:text-tesla-blue">
              {l.label}
            </h3>
            {l.why ? <p className="mt-1.5 text-xs leading-6 text-slate-500">{l.why}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

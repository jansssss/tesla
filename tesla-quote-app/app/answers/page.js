import Link from "next/link";
import {
  JOURNEY_STOPS,
  ANSWER_GROUPS,
  answersByGroup,
  ANSWERS,
  ANSWERS_UPDATED_AT,
} from "@/lib/answers";

const BASE = "https://www.paytesla.kr";

export const metadata = {
  title: "테슬라 구매 질문 30 — 살까부터 중고·FSD까지 순서대로",
  description:
    "테슬라를 사기 전후로 이어서 궁금해지는 질문 30개를 검색 순서대로 묶었습니다. 모델 선택·보조금·충전·주행거리·배터리·수리비·중고차까지, 각 질문마다 계산기로 바로 이어집니다.",
  openGraph: {
    title: "테슬라 구매 질문 30 — 순서대로 확인하기",
    description: "모델 선택부터 중고차·FSD까지, 구매 의사결정 순서대로 정리한 질문 30개.",
    url: `${BASE}/answers`,
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: `${BASE}/answers` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "테슬라 구매 질문 30",
      itemListElement: JOURNEY_STOPS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.label,
        url: `${BASE}${s.href === "/" ? "" : s.href}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: BASE },
        { "@type": "ListItem", position: 2, name: "질문과 답변", item: `${BASE}/answers` },
      ],
    },
  ],
};

export default function AnswersHubPage() {
  const answerCount = ANSWERS.length;
  const externalCount = JOURNEY_STOPS.length - answerCount;

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1d4ed8_100%)] py-14 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            구매 의사결정 순서
          </span>
          <h1 className="mt-4 text-2xl font-black leading-tight md:text-4xl">
            테슬라 구매 질문 30
            <span className="mt-2 block text-base font-normal text-blue-200 md:text-xl">
              살까 고민부터 중고차·FSD까지, 검색하는 순서대로
            </span>
          </h1>
          <p className="mt-5 text-xs text-blue-200/70">
            답변 페이지 {answerCount}개 · 계산기·비교 페이지 {externalCount}개 · 최종 갱신 {ANSWERS_UPDATED_AT}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 md:px-8 md:py-14">
        {/* 전체 여정 */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              전체 흐름
            </span>
          </div>

          <ol className="space-y-2">
            {JOURNEY_STOPS.map((stop) => (
              <li key={stop.href + stop.n}>
                <Link
                  href={stop.href}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)]"
                >
                  <span
                    className={`mt-0.5 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      stop.kind === "answer"
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {stop.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-700">
                      {stop.label}
                    </span>
                    {stop.note ? (
                      <span className="mt-1 block text-xs leading-6 text-slate-500">
                        {stop.kind === "external" ? `계산기·비교 페이지 — ${stop.note}` : stop.note}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* 주제별 */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              주제별
            </span>
          </div>
          <h2 className="mb-5 text-lg font-black md:text-xl">궁금한 주제부터 바로 보기</h2>

          <div className="space-y-6">
            {ANSWER_GROUPS.map((g) => {
              const items = answersByGroup(g.id);
              if (items.length === 0) return null;
              return (
                <div key={g.id} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                  <h3 className="text-base font-black text-slate-950">{g.label}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-slate-500">{g.desc}</p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {items.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/answers/${a.slug}`}
                        className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white"
                      >
                        <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {a.question}
                        </span>
                        <span className="mt-1.5 block text-xs leading-6 text-slate-500">
                          {a.heroSub}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 계산기로 */}
        <section className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-8 text-white md:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            숫자가 필요할 때
          </p>
          <h2 className="mt-3 text-lg font-black md:text-xl">읽는 것보다 계산이 빠른 질문들</h2>
          <p className="mt-2 text-sm leading-7 text-blue-100/80">
            보조금·실구매가·월납입금·유지비·충전비는 글로 읽는 것보다 본인 조건을 넣어 계산하는 편이 정확합니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: "/", label: "실구매가·월납입금" },
              { href: "/calc", label: "계산기 전체" },
              { href: "/calc/monthly-real-cost", label: "월 실제 부담금" },
              { href: "/calc/charging", label: "충전비" },
              { href: "/calc/tco", label: "총소유비용" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

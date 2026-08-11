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
    <main className="min-h-screen bg-tesla-mist/40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-tesla-line bg-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <span className="inline-flex rounded-md bg-tesla-blueSoft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-tesla-blue">
            구매 의사결정 순서
          </span>
          <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight text-tesla-ink md:text-4xl">
            테슬라 구매 질문 30
            <span className="mt-2 block text-base font-normal text-tesla-ink70 md:text-xl">
              살까 고민부터 중고차·FSD까지, 검색하는 순서대로
            </span>
          </h1>
          <p className="mt-5 text-xs text-slate-400">
            답변 페이지 {answerCount}개 · 계산기·비교 페이지 {externalCount}개 · 최종 갱신{" "}
            {ANSWERS_UPDATED_AT}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 md:px-8 md:py-14">
        {/* 주제별 — 검색자는 대개 '지금 궁금한 주제'부터 들어온다 */}
        <section>
          <span className="inline-flex rounded-md bg-tesla-mist px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-tesla-ink70">
            주제별
          </span>
          <h2 className="mb-5 mt-4 text-lg font-black text-tesla-ink md:text-xl">
            지금 궁금한 것부터 바로 보기
          </h2>

          <div className="space-y-6">
            {ANSWER_GROUPS.map((g) => {
              const items = answersByGroup(g.id);
              if (items.length === 0) return null;
              return (
                <div
                  key={g.id}
                  className="rounded-2xl border border-tesla-line bg-white p-6 md:p-8"
                >
                  <h3 className="text-base font-black text-tesla-ink">{g.label}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-slate-500">{g.desc}</p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {items.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/answers/${a.slug}`}
                        className="group rounded-xl border border-tesla-line bg-tesla-mist/50 p-4 transition hover:border-tesla-blue hover:bg-white"
                      >
                        <span className="block text-sm font-bold leading-snug text-tesla-ink group-hover:text-tesla-blue">
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

        {/* 전체 여정 */}
        <section>
          <span className="inline-flex rounded-md bg-tesla-mist px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-tesla-ink70">
            전체 흐름
          </span>
          <h2 className="mb-5 mt-4 text-lg font-black text-tesla-ink md:text-xl">
            처음부터 순서대로 따라가기
          </h2>

          <ol className="space-y-2">
            {JOURNEY_STOPS.map((stop) => (
              <li key={stop.href + stop.n}>
                <Link
                  href={stop.href}
                  className="group flex items-start gap-3 rounded-xl border border-tesla-line bg-white p-4 transition hover:border-tesla-blue"
                >
                  <span
                    className={`mt-0.5 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md px-1.5 text-[11px] font-bold ${
                      stop.kind === "answer"
                        ? "bg-tesla-ink text-white"
                        : "border border-tesla-line bg-tesla-mist text-tesla-ink70"
                    }`}
                  >
                    {stop.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-tesla-ink group-hover:text-tesla-blue">
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

        {/* 계산기로 */}
        <section className="rounded-2xl bg-tesla-ink p-8 text-white md:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            숫자가 필요할 때
          </p>
          <h2 className="mt-3 text-lg font-black md:text-xl">읽는 것보다 계산이 빠른 질문들</h2>
          <p className="mt-2 text-sm leading-7 text-white/70">
            보조금·실구매가·월납입금·유지비·충전비는 글로 읽는 것보다 본인 조건을 넣어 계산하는 편이
            정확합니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: "/subsidy", label: "실구매가·월납입금" },
              { href: "/calc", label: "계산기 전체" },
              { href: "/calc/monthly-real-cost", label: "월 실제 부담금" },
              { href: "/calc/charging", label: "충전비" },
              { href: "/calc/tco", label: "총소유비용" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
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

import Link from "next/link";
import { CALCULATORS, CALCULATOR_GROUPS, calculatorsByGroup } from "@/lib/calculators";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { VEHICLE_DATA_VERIFIED_AT } from "@/lib/vehicleData";

export const metadata = {
  title: "테슬라 계산기 모음 — 보조금·유지비·충전비·총소유비용",
  description:
    "테슬라 구매 판단에 필요한 계산기 10종을 한곳에 모았습니다. 지역별 보조금 실구매가, 월 실제 부담금, 유지비, 총소유비용, 충전비·충전 시간·충전기 설치 손익까지 단계별로 계산하세요.",
  openGraph: {
    title: "테슬라 계산기 모음 — 보조금·유지비·충전비·총소유비용",
    description: "테슬라 구매 판단에 필요한 계산기 10종을 한곳에서.",
    url: "https://www.paytesla.kr/calc",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "테슬라 구매 계산기 모음",
      itemListElement: CALCULATORS.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        url: `https://www.paytesla.kr${c.href === "/" ? "" : c.href}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://www.paytesla.kr" },
        { "@type": "ListItem", position: 2, name: "계산기", item: "https://www.paytesla.kr/calc" },
      ],
    },
  ],
};

/** 구매 판단 순서 — 어떤 계산기를 어떤 순서로 쓰면 되는지 안내 */
const FLOW = [
  {
    step: "먼저 확인",
    href: "/calc/ev-purchase-readiness",
    label: "구매 준비도 체크",
    why: "충전 환경이 안 맞으면 나머지 계산은 의미가 없습니다. 여기서 시작하세요.",
  },
  {
    step: "1단계",
    href: "/",
    label: "보조금·실구매가 계산",
    why: "거주 지역 보조금을 적용해 실제로 내는 차값과 월납입금을 확정합니다.",
  },
  {
    step: "2단계",
    href: "/calc/monthly-real-cost",
    label: "월 실제 부담금 확인",
    why: "할부금에 충전비·보험료·자동차세를 더한 진짜 월 지출을 봅니다.",
  },
  {
    step: "3단계",
    href: "/calc/tco",
    label: "총소유비용으로 검증",
    why: "감가상각까지 포함해 보유 기간 전체의 비용이 감당 가능한지 확인합니다.",
  },
];

export default function CalcIndexPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {/* Hero */}
        <header className="mb-10">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            계산기 모음
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            테슬라 구매 계산기 {CALCULATORS.length}종
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            차를 살지 말지 결정하는 데 필요한 숫자는 하나가 아닙니다. 보조금을 적용한 실구매가,
            매달 실제로 나가는 돈, 몇 년 뒤까지의 총비용, 그리고 충전 환경. 이 네 가지를 각각
            계산할 수 있도록 도구를 나눠 두었습니다.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            보조금 데이터 기준일 {CALC_DATA_DATE} · 차량 가격 확인일 {VEHICLE_DATA_VERIFIED_AT}
          </p>
        </header>

        {/* 추천 순서 */}
        <section className="mb-12 rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] p-6 text-white md:p-10">
          <h2 className="text-xl font-black tracking-tight md:text-2xl">
            처음이라면 이 순서로 계산하세요
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-blue-100/80">
            계산기를 아무 순서로나 쓰면 앞뒤가 안 맞는 숫자가 나옵니다. 아래 흐름대로 진행하면
            앞 단계의 결과가 다음 단계의 입력값이 됩니다.
          </p>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {FLOW.map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  className="group block h-full rounded-2xl border border-white/15 bg-white/10 p-5 transition hover:border-white/40 hover:bg-white/15"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
                    {f.step}
                  </span>
                  <h3 className="mt-2 text-base font-black text-white">{f.label} →</h3>
                  <p className="mt-1.5 text-xs leading-6 text-blue-100/75">{f.why}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* 그룹별 계산기 */}
        <div className="space-y-12">
          {CALCULATOR_GROUPS.map((group) => {
            const items = calculatorsByGroup(group.id);
            return (
              <section key={group.id}>
                <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">
                  {group.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{group.desc}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]"
                    >
                      <h3 className="text-base font-black leading-snug text-slate-950 transition group-hover:text-blue-700">
                        {c.label}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{c.desc}</p>
                      <span className="mt-4 text-xs font-bold text-blue-600">계산하기 →</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* 계산기 사용에 대한 안내 */}
        <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-lg font-black tracking-tight text-slate-950 md:text-xl">
            계산 결과를 어떻게 받아들여야 하나
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <p>
              이 사이트의 계산기는 모두 <strong>공개된 데이터와 명시된 가정값</strong>을 바탕으로
              동작합니다. 각 페이지 하단에 데이터 기준일과 출처, 그리고 어떤 가정을 썼는지 적어
              두었습니다. 기본값을 그대로 쓰지 말고 본인 조건으로 바꿔야 결과가 의미를 갖습니다.
            </p>
            <p>
              특히 <strong>보험료</strong>는 개인별 편차가 가장 큰 항목이고,{" "}
              <strong>충전 단가</strong>는 사업자·요금제·시간대에 따라 달라지며,{" "}
              <strong>감가상각률</strong>은 중고 시장 상황에 따라 크게 움직입니다. 이 세 가지는
              반드시 직접 조정해서 쓰세요.
            </p>
            <p>
              계산 결과는 구매 판단을 돕는 참고 자료이며 실제 계약 조건과 다를 수 있습니다.
              보조금 지급 여부와 금액은 예산 잔액·출고일·자격 요건에 따라 달라지므로, 최종
              확인은{" "}
              <a
                href="https://www.ev.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:underline"
              >
                무공해차 통합누리집
              </a>
              과 거주지 지자체 공고에서 하시기 바랍니다.
            </p>
          </div>
        </section>

        {/* 다른 정보 */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-lg font-black tracking-tight text-slate-950">함께 보면 좋은 페이지</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/models/model-3", label: "Model 3 가격·트림" },
              { href: "/models/model-y", label: "Model Y 가격·트림" },
              { href: "/models/model-y-l", label: "Model Y L 상세" },
              { href: "/compare/model-3-vs-model-y", label: "Model 3 vs Model Y" },
              { href: "/compare/rwd-vs-awd", label: "RWD vs AWD" },
              { href: "/subsidy/seoul", label: "서울 보조금" },
              { href: "/subsidy/busan", label: "부산 보조금" },
              { href: "/data-sources", label: "데이터 출처" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

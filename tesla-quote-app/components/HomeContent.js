import Link from "next/link";
import { CALCULATOR_GROUPS, calculatorsByGroup } from "@/lib/calculators";
import { ANSWERS, JOURNEY_STOPS, ANSWERS_UPDATED_AT } from "@/lib/answers";

/**
 * 홈 랜딩 본문.
 *
 * 홈은 더 이상 계산기 페이지가 아니다(계산 도구는 /subsidy). 여기서는
 *  ① 왜 직접 계산해야 하는가(문제 제기)
 *  ② 무엇으로 계산하는가(계산기 8종)
 *  ③ 계산 전후에 무엇을 읽는가(구매 질문 30 여정)
 * 순서로 동선을 만든다. 색은 테슬라 공식 사이트 톤(화이트 + 잉크 블랙 + 블루)을 따른다.
 */

/* ── ① 문제 제기 3열 ── */
const DILEMMAS = [
  {
    title: "지역마다 금액이 다르다",
    desc: "국고보조금은 같아도 지자체 보조금이 달라, 같은 트림도 사는 곳에 따라 실구매가가 벌어집니다.",
    glyph: (
      <>
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.6" />
      </>
    ),
  },
  {
    title: "차값만으로 끝나지 않는다",
    desc: "할부금·충전비·보험료·자동차세가 매달 함께 빠져나갑니다. 차값만 보고 예산을 짜면 어긋납니다.",
    glyph: (
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
        <path d="M3 10h18" />
        <path d="M7 14.5h4" />
      </>
    ),
  },
  {
    title: "정보가 조각나 있다",
    desc: "공고문·커뮤니티·영상에 흩어진 조건을 하나씩 검색해 맞추는 동안 접수 시점이 지나갑니다.",
    glyph: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-4.2-4.2" />
      </>
    ),
  },
];

/* ── ③ 신뢰 근거 4카드 ── */
const PROOFS = [
  {
    title: "공개 데이터 기반",
    desc: "무공해차 통합누리집에 공개된 지자체별 보급 물량·보조금 데이터를 그대로 반영합니다.",
    href: "/data-sources",
    cta: "데이터 출처",
  },
  {
    title: "전국 17개 시·도",
    desc: "특별시·광역시부터 기초자치단체까지, 선택한 지역의 실제 공고값으로 계산합니다.",
    href: "/subsidy",
    cta: "지역 선택하기",
  },
  {
    title: "계산 근거 공개",
    desc: "어떤 값에 어떤 가정이 들어갔는지 각 계산기 하단에 공식과 기준일을 함께 적습니다.",
    href: "/editorial-policy",
    cta: "콘텐츠 정책",
  },
  {
    title: "테슬라와 무관한 독립 서비스",
    desc: "판매·중개를 하지 않습니다. 계약을 유도하는 대신 숫자와 판단 기준만 제공합니다.",
    href: "/about",
    cta: "사이트 소개",
  },
];

/* ── 지역별 보조금 빠른 링크 — 색인 유지 대상(광역시/특별시)만 노출 ── */
const REGIONS = [
  { label: "서울", href: "/subsidy/seoul" },
  { label: "부산", href: "/subsidy/busan" },
  { label: "인천", href: "/subsidy/incheon" },
  { label: "대구", href: "/subsidy/daegu" },
  { label: "대전", href: "/subsidy/daejeon" },
  { label: "광주", href: "/subsidy/gwangju" },
  { label: "울산", href: "/subsidy/ulsan" },
  { label: "세종", href: "/subsidy/sejong" },
  { label: "제주", href: "/subsidy/jeju" },
];

/* ── FAQ ── */
const FAQS = [
  {
    question: "보조금은 언제 신청해야 하나요?",
    answer:
      "차량 계약이 끝났다고 자동으로 보조금이 확보되는 것은 아닙니다. 지역별 공고문에 따라 접수 시점, 제출 서류, 승인 순서가 다르므로 계약 직후 바로 관련 안내를 확인해야 합니다. 예산 소진이 빠른 지역은 접수 타이밍이 실제 수령 가능성을 좌우합니다.",
  },
  {
    question: "법인과 개인 구매는 무엇이 다른가요?",
    answer:
      "개인은 거주지와 자격 요건 중심으로 판단하는 경우가 많고, 법인이나 개인사업자는 등록지·사업 목적·증빙 서류·비용 처리 방식까지 함께 검토해야 합니다. 계산기는 동일하게 사용할 수 있지만 실제 신청 서류와 해석은 다를 수 있습니다.",
  },
  {
    question: "계산 결과와 실제 수령 금액이 다른 이유는?",
    answer:
      "보조금 정책은 연도 중에도 조정될 수 있고, 지자체 예산 잔량·접수 시점·차량 출고 일정·추가 지원금 자격 판단에 따라 실제 결과가 달라질 수 있습니다. 계산값은 현재 기준 비교값으로 보고, 최종 신청 전에 반드시 공고문과 담당 부서 안내를 교차 확인해야 합니다.",
  },
  {
    question: "Model 3와 Model Y 중 어느 쪽이 더 유리한가요?",
    answer:
      "정답은 고정되어 있지 않습니다. 총예산·월 납입금·가족 구성·적재 공간·주행거리·충전 환경을 함께 봐야 합니다. 기본 가격만 보면 Model 3가 가벼워 보일 수 있지만, 장기 보유와 활용도를 감안하면 Model Y가 더 맞는 경우도 많습니다.",
  },
];

function Arrow({ size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function Eyebrow({ children, tone = "blue" }) {
  const toneClass =
    tone === "blue"
      ? "bg-tesla-blueSoft text-tesla-blue"
      : "bg-tesla-mist text-tesla-ink70";
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function HomeContent() {
  // 여정에서 대표 질문 6개 — 답변 페이지가 있는 항목만 홈에 올린다.
  const featuredAnswers = ANSWERS.slice(0, 6);

  return (
    <>
      {/* ── ① 왜 직접 계산해야 하나 ── */}
      <section className="border-b border-tesla-line bg-tesla-mist/50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <Eyebrow tone="mist">구매자가 겪는 문제</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-black leading-snug tracking-tight text-tesla-ink md:text-4xl">
              전기차 가격은 왜 검색해도
              <br className="hidden sm:block" /> 내 금액이 나오지 않을까.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {DILEMMAS.map((d) => (
              <div key={d.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-tesla-line bg-white text-tesla-blue">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {d.glyph}
                  </svg>
                </div>
                <h3 className="mt-5 text-base font-bold text-tesla-ink">{d.title}</h3>
                <p className="mx-auto mt-2.5 max-w-xs text-sm leading-7 text-tesla-ink70">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ② 계산기 허브 ── */}
      <section className="border-b border-tesla-line bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <Eyebrow>하나의 플랫폼</Eyebrow>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-tesla-ink md:text-4xl">
              구매 판단에 필요한 숫자를 한 곳에서.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-tesla-ink70">
              보조금부터 시작해 월 부담금, 유지비, 충전 환경까지 순서대로 이어집니다. 앞 계산기의
              결과가 다음 계산기의 입력이 되도록 설계했습니다.
            </p>
          </div>

          {/* 대표 계산기 패널 */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-tesla-line bg-tesla-mist/60">
            <div className="grid gap-px bg-tesla-line md:grid-cols-[1.15fr_1fr]">
              <div className="bg-tesla-ink p-7 text-white md:p-10">
                <span className="inline-flex rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  1단계 · 대표 도구
                </span>
                <h3 className="mt-5 text-xl font-black leading-snug md:text-2xl">
                  보조금 확인 — 실구매가·월납입금
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                  거주 지역과 트림을 고르면 국고·지자체 보조금이 자동으로 적용됩니다. 선수금과 할부
                  개월 수까지 넣어 매달 나가는 금액을 확정하세요.
                </p>
                <Link
                  href="/subsidy"
                  className="mt-7 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-tesla-ink transition hover:bg-tesla-blueSoft"
                >
                  보조금 확인하기
                  <Arrow />
                </Link>
              </div>

              <div className="bg-white p-7 md:p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  이어지는 계산기
                </p>
                <div className="mt-5 space-y-6">
                  {CALCULATOR_GROUPS.map((group) => {
                    const items = calculatorsByGroup(group.id).filter(
                      (c) => c.href !== "/subsidy"
                    );
                    if (items.length === 0) return null;
                    return (
                      <div key={group.id}>
                        <p className="text-xs font-bold text-tesla-ink">{group.title}</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {items.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              className="inline-flex items-center gap-1 rounded-md border border-tesla-line bg-white px-3 py-1.5 text-xs font-semibold text-tesla-ink70 transition hover:border-tesla-blue hover:text-tesla-blue"
                            >
                              {c.shortLabel}
                              <Arrow size={11} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/calc"
                  className="mt-7 inline-flex items-center gap-1.5 text-xs font-bold text-tesla-blue transition hover:text-tesla-blueDark"
                >
                  계산기 전체 보기
                  <Arrow size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ③ 구매 질문 30 여정 진입점 ── */}
      <section className="border-b border-tesla-line bg-tesla-mist/50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>계산 전후에 읽는 것</Eyebrow>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-tesla-ink md:text-4xl">
                테슬라 구매 질문 30
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-tesla-ink70">
                살까 고민부터 트림·보조금·충전·배터리·수리비·중고차까지, 실제로 검색하게 되는
                순서대로 묶었습니다. 답변 {ANSWERS.length}편 + 계산기{" "}
                {JOURNEY_STOPS.length - ANSWERS.length}개 · 최종 갱신 {ANSWERS_UPDATED_AT}.
              </p>
            </div>
            <Link
              href="/answers"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-tesla-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-tesla-blue"
            >
              여정 전체 보기
              <Arrow />
            </Link>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAnswers.map((a, i) => (
              <Link
                key={a.slug}
                href={`/answers/${a.slug}`}
                className="group flex gap-3 rounded-xl border border-tesla-line bg-white p-5 transition hover:border-tesla-blue"
              >
                <span className="mt-0.5 shrink-0 text-xs font-black tabular-nums text-slate-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-snug text-tesla-ink transition group-hover:text-tesla-blue">
                    {a.question}
                  </span>
                  <span className="mt-1.5 block text-xs leading-6 text-slate-500">{a.heroSub}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ④ 신뢰 근거 ── */}
      <section className="border-b border-tesla-line bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PROOFS.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-xl border border-tesla-line bg-white p-6"
              >
                <div className="h-1 w-8 rounded-full bg-tesla-blue" />
                <h3 className="mt-4 text-sm font-bold text-tesla-ink">{p.title}</h3>
                <p className="mt-2.5 flex-1 text-xs leading-6 text-tesla-ink70">{p.desc}</p>
                <Link
                  href={p.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-tesla-blue transition hover:text-tesla-blueDark"
                >
                  {p.cta}
                  <Arrow size={11} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ⑤ 지역별 보조금 ── */}
      <section className="border-b border-tesla-line bg-tesla-mist/50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="mist">지역별</Eyebrow>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-tesla-ink md:text-3xl">
                내 지역 보조금부터 확인하기
              </h2>
              <p className="mt-3 text-sm leading-7 text-tesla-ink70">
                시·도별 보조금 현황과 기초자치단체 차이를 정리한 페이지입니다.
              </p>
            </div>
            <Link
              href="/subsidy"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-tesla-blue transition hover:text-tesla-blueDark"
            >
              계산기에서 직접 선택
              <Arrow size={13} />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="inline-flex items-center rounded-md border border-tesla-line bg-white px-4 py-2 text-xs font-semibold text-tesla-ink70 transition hover:border-tesla-blue hover:text-tesla-blue"
              >
                {r.label} 보조금
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ⑥ FAQ ── */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Eyebrow tone="mist">자주 묻는 질문</Eyebrow>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-tesla-ink md:text-3xl">
            계산 전에 많이 묻는 것들
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {FAQS.map((item) => (
              <article key={item.question} className="rounded-xl border border-tesla-line bg-white p-6">
                <h3 className="text-sm font-bold text-tesla-ink">{item.question}</h3>
                <p className="mt-2.5 text-xs leading-6 text-tesla-ink70">{item.answer}</p>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-xs leading-6 text-slate-400">
            하우머치 테슬라는 무공해차 통합누리집 공개 데이터와 지자체 보급 공고를 기준으로 지역별
            실구매가를 빠르게 비교하는 계산 플랫폼입니다.
            <br className="hidden sm:block" />
            계산값은 빠른 비교용이며 최종 신청 전 반드시 공고문과 담당 부서 안내를 교차 확인하세요.
          </p>
        </div>
      </section>
    </>
  );
}

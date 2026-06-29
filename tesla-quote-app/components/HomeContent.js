import Link from "next/link";

/* ── 사용자 의도 기반 질문형 진입점 ── */
const QUICK_QUESTIONS = [
  {
    q: "테슬라 사도 될까? 내 상황에 맞을까?",
    hint: "충전환경·주행거리·예산 5문항 점수화",
    href: "/calc/ev-purchase-readiness",
    emoji: "✅",
  },
  {
    q: "할부·충전비·보험료 합치면 월 얼마?",
    hint: "할부금 + 충전비 + 보험료 + 자동차세 합산",
    href: "/calc/monthly-real-cost",
    emoji: "💳",
  },
  {
    q: "지금 차 유지비 vs 테슬라로 바꾸면?",
    hint: "내연기관 월비용 vs 테슬라 전환 후 절감액",
    href: "/calc/switch-to-tesla",
    emoji: "🔄",
  },
  {
    q: "Model 3 vs Model Y, 내 조건엔 뭐가 나아?",
    hint: "가격·주행거리·보조금·상황별 추천 비교",
    href: "/compare/model-3-vs-model-y",
    emoji: "⚖️",
  },
];

/* ── 계산기 사이드 카드 3개 ── */
const SIDE_CALCS = [
  {
    title: "구매 준비도 체크",
    desc: "5문항으로 내 상황 점수화",
    href: "/calc/ev-purchase-readiness",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    emoji: "✅",
  },
  {
    title: "내연기관 → 테슬라 전환 비교",
    desc: "월 절감액·투자금 회수 기간 계산",
    href: "/calc/switch-to-tesla",
    color: "text-violet-600",
    bg: "bg-violet-50",
    emoji: "🔄",
  },
  {
    title: "보조금 포함 실구매가·월납입금",
    desc: "지역별 보조금 자동 반영",
    href: "/",
    color: "text-blue-600",
    bg: "bg-blue-50",
    emoji: "🏷️",
  },
];

/* ── 추가 계산기 pill 목록 ── */
const EXTRA_CALCS = [
  { label: "유지비 계산기", href: "/calc/maintenance" },
  { label: "충전비 계산기", href: "/calc/charging" },
  { label: "총소유비용(TCO) 계산기", href: "/calc/tco" },
  { label: "모델 비교 계산기", href: "/calc/compare" },
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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function HomeContent() {
  return (
    <section className="bg-[linear-gradient(180deg,#f0f4ff_0%,#f8fafc_40%,#ffffff_100%)] py-12 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8">

        {/* ── 1. 질문형 빠른 진입점 ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue-600 rounded-full shrink-0" />
            <h2 className="text-sm font-bold text-gray-900">자주 찾는 질문</h2>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              계산기 포함
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_QUESTIONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 p-4 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl shadow-sm transition-all"
              >
                <span className="text-2xl leading-none mt-0.5 shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug mb-0.5">
                    {item.q}
                  </p>
                  <p className="text-[11px] text-gray-400">{item.hint}</p>
                </div>
                <Arrow className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 2. 계산기 도구 허브 ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue-600 rounded-full shrink-0" />
            <h2 className="text-sm font-bold text-gray-900">계산기 도구</h2>
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              7가지
            </span>
          </div>

          {/* 피처드 + 사이드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* 피처드 카드 (2/5) */}
            <Link
              href="/calc/monthly-real-cost"
              className="md:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 flex flex-col justify-between min-h-[168px] shadow-md hover:shadow-lg hover:scale-[1.015] transition-all duration-200"
            >
              <span className="absolute top-3.5 right-3.5 text-[10px] font-bold bg-white/25 text-white px-2 py-0.5 rounded-full tracking-wide">
                핵심 도구
              </span>
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-xl mb-3">
                💳
              </div>
              <div>
                <p className="text-white font-bold text-base leading-snug mb-1">
                  월 실제 부담금 계산기
                </p>
                <p className="text-white/75 text-xs leading-relaxed hidden sm:block">
                  할부금에 충전비·보험료·자동차세를 더한 실제 월 지출을 확인합니다.
                </p>
              </div>
              <div className="flex items-center gap-1 mt-3 text-white font-semibold text-xs">
                지금 계산하기
                <Arrow size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* 사이드 카드 3개 (3/5) */}
            <div className="md:col-span-3 flex flex-col gap-3">
              {SIDE_CALCS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-center gap-3.5 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center ${tool.color} shrink-0 text-lg`}
                  >
                    {tool.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-blue-700 transition-colors truncate">
                      {tool.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{tool.desc}</p>
                  </div>
                  <Arrow className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* 추가 계산기 pill */}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXTRA_CALCS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-700 px-3 py-1.5 rounded-full transition-all shadow-sm"
              >
                {c.label}
                <Arrow size={11} />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. 지역별 보조금 ── */}
        <section>
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-white text-base shrink-0">
                  🏛️
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 leading-tight">
                    지역별 전기차 보조금
                  </h2>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    내 지역 보조금 포함 실구매가 확인
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
              >
                계산기 열기 <Arrow size={11} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="inline-flex items-center text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                >
                  {r.label} 보조금
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. FAQ ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-emerald-500 rounded-full shrink-0" />
            <h2 className="text-base font-bold text-gray-900">자주 묻는 질문</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {FAQS.map((item) => (
              <article
                key={item.question}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.question}</h3>
                <p className="text-xs leading-6 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 5. 서비스 안내 (컴팩트) ── */}
        <footer className="text-center pb-2">
          <p className="text-xs text-slate-400 leading-6">
            하우머치 테슬라는 무공해차 통합누리집 공개 데이터와 지자체 보급 공고를 기준으로 지역별 실구매가를
            빠르게 비교하는 계산기입니다.
            <br className="hidden sm:block" />
            계산값은 빠른 비교용이며 최종 신청 전 반드시 공고문과 담당 부서 안내를 교차 확인하세요.
          </p>
        </footer>

      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";

const MODEL_CATALOG = [
  {
    id: "model3",
    name: "Model 3",
    image: "/model3.png",
    stats: [
      { label: "주행 가능 거리", value: "382 km" },
      { label: "최고 속도", value: "201 km/h" },
      { label: "0-100 km/h", value: "6.2 초" }
    ],
    trims: [
      { id: "m3-rwd", label: "RWD(후륜 구동)", price: 41990000, csvModel: "Model 3 RWD" },
      {
        id: "m3-lr",
        label: "Premium Long Range RWD(후륜 구동)",
        price: 52990000,
        csvModel: "Model 3 Premium Long Range RWD"
      },
      {
        id: "m3-perf",
        label: "Performance AWD(사륜 구동)",
        price: 59990000,
        csvModel: "Model 3 Performance"
      }
    ]
  },
  {
    id: "modely",
    name: "Model Y",
    image: "/modely.png",
    stats: [
      { label: "주행 가능 거리", value: "400 km+" },
      { label: "최고 속도", value: "217 km/h" },
      { label: "0-100 km/h", value: "5.9 초" }
    ],
    trims: [
      { id: "my-rwd", label: "Premium RWD(후륜 구동)", price: 52990000, csvModel: "Model Y Premium RWD" },
      {
        id: "my-lr",
        label: "Premium Long Range AWD(사륜 구동)",
        price: 59990000,
        csvModel: "Model Y Premium Long Range"
      }
    ]
  }
];

const MULTI_CHILD_BENEFIT_MAP = {
  0: 0,
  2: 1000000,
  3: 2000000,
  4: 3000000
};

function formatWon(value) {
  return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function monthlyPayment(principal, annualRatePct, months) {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export default function QuoteWizard({ rows, regions }) {
  const [modelId, setModelId] = useState("model3");
  const [selectedTrimId, setSelectedTrimId] = useState("m3-rwd");
  const [regionCode, setRegionCode] = useState(regions[0]?.code || "");
  const [isYouthBenefit, setIsYouthBenefit] = useState(false);
  const [isLowIncomeBenefit, setIsLowIncomeBenefit] = useState(false);
  const [multiChildCount, setMultiChildCount] = useState(0);
  const [downPayment, setDownPayment] = useState(10000000);
  const [downPaymentInput, setDownPaymentInput] = useState(formatNumber(10000000));
  const [rate, setRate] = useState(3.6);
  const [months, setMonths] = useState(60);

  const model = useMemo(
    () => MODEL_CATALOG.find((item) => item.id === modelId) || MODEL_CATALOG[0],
    [modelId]
  );

  const trim = useMemo(
    () => model.trims.find((item) => item.id === selectedTrimId) || model.trims[0],
    [model, selectedTrimId]
  );

  const subsidy = useMemo(
    () =>
      rows.find((row) => row.local_code === regionCode && row.model === trim.csvModel) || {
        national_subsidy_manwon: 0,
        local_subsidy_manwon: 0,
        total_subsidy_manwon: 0
      },
    [rows, regionCode, trim.csvModel]
  );

  const selectedRegion = regions.find((item) => item.code === regionCode);
  const basePrice = trim.price;
  const nationalSubsidyWon = subsidy.national_subsidy_manwon * 10000;
  const subsidyWon = subsidy.total_subsidy_manwon * 10000;
  const youthBenefitWon = isYouthBenefit ? Math.round(nationalSubsidyWon * 0.2) : 0;
  const lowIncomeBenefitWon = isLowIncomeBenefit ? Math.round(nationalSubsidyWon * 0.2) : 0;
  const multiChildBenefitWon = MULTI_CHILD_BENEFIT_MAP[multiChildCount] || 0;
  const extraBenefitWon = youthBenefitWon + lowIncomeBenefitWon + multiChildBenefitWon;
  const estimatedPrice = Math.max(basePrice - subsidyWon - extraBenefitWon, 0);
  const loanPrincipal = Math.max(estimatedPrice - Number(downPayment || 0), 0);
  const monthly = monthlyPayment(loanPrincipal, Number(rate || 0), Number(months || 0));

  const handleDownPaymentChange = (value) => {
    const digits = String(value).replace(/[^\d]/g, "");
    const numeric = digits ? Number(digits) : 0;
    setDownPayment(numeric);
    setDownPaymentInput(digits ? formatNumber(numeric) : "");
  };

  const changeModel = (id) => {
    const nextModel = MODEL_CATALOG.find((item) => item.id === id);
    setModelId(id);
    setSelectedTrimId(nextModel.trims[0].id);
  };

  return (
    <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-8 md:px-8 md:py-12">
      <header className="grid gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-logo text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
              How much <span className="text-brandRed">Tesla</span>?
            </h1>
          </div>

          <nav className="flex flex-wrap gap-3" aria-label="견적 단계">
            <a href="#section-model" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-gray-400 hover:shadow">1. 모델</a>
            <a href="#section-trim" className="rounded-full border border-black bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-900">2. 트림</a>
            <a href="#section-region" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-gray-400 hover:shadow">3. 지역</a>
            <a href="#section-benefit" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-gray-400 hover:shadow">4. 혜택·금융</a>
          </nav>
        </div>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="grid gap-8">
          <section id="section-model" className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="flex gap-4 border-b border-gray-200 p-6">
              {MODEL_CATALOG.map((item) => (
                <button
                  key={item.id}
                  className={`flex-1 rounded-lg px-6 py-4 text-base font-bold transition-all md:text-lg ${
                    modelId === item.id
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => changeModel(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-b from-gray-50 to-white p-8 md:p-12">
              <img
                className="h-[240px] w-full object-contain md:h-[480px]"
                src={model.image}
                alt={model.name}
              />

              <h2 className="mt-8 text-center text-4xl font-black tracking-tight md:mt-12 md:text-6xl">{model.name}</h2>

              <div className="mx-auto mb-8 mt-6 grid max-w-3xl grid-cols-3 gap-6 text-center md:gap-8">
                {model.stats.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
                    <strong className="block text-3xl font-black md:text-4xl">{item.value}</strong>
                    <span className="mt-2 block text-xs font-medium text-gray-600 md:text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div id="section-trim" className="grid gap-3">
                {model.trims.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center justify-between rounded-2xl px-6 py-5 text-left transition-all ${
                      selectedTrimId === item.id
                        ? "bg-black text-white shadow-lg"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedTrimId(item.id)}
                  >
                    <span className="max-w-[65%] text-base font-semibold md:text-xl">{item.label}</span>
                    <strong className="text-xl font-black md:text-3xl">{formatWon(item.price)}</strong>
                  </button>
                ))}
              </div>

              <button className="mt-6 w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md md:text-lg">
                기능 보기 및 비교하기
              </button>
            </div>
          </section>

          <section id="section-region" className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-black md:text-3xl">3. 지역 선택</h3>
            <select
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-base font-medium shadow-sm transition-all hover:border-gray-400 md:text-lg"
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <div className="mt-6 rounded-xl bg-gray-50 p-5">
              <p className="text-base text-gray-700 md:text-lg">
                보조금: <span className="font-semibold">국비 {subsidy.national_subsidy_manwon}만원</span> + <span className="font-semibold">지방비 {subsidy.local_subsidy_manwon}만원</span>
              </p>
              <p className="mt-2 text-xl font-black md:text-2xl">
                총 {subsidy.total_subsidy_manwon}만원
              </p>
            </div>
          </section>

          <section id="section-benefit" className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-black md:text-3xl">4. 혜택 · 금융</h3>

            <div className="mt-6 grid gap-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 px-5 py-4 transition-all hover:bg-gray-100">
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-gray-300"
                  checked={isLowIncomeBenefit}
                  onChange={(e) => setIsLowIncomeBenefit(e.target.checked)}
                />
                <span className="text-base font-semibold md:text-lg">차상위 이하 계층 (국비 20% 추가)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 px-5 py-4 transition-all hover:bg-gray-100">
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-gray-300"
                  checked={isYouthBenefit}
                  onChange={(e) => setIsYouthBenefit(e.target.checked)}
                />
                <span className="text-base font-semibold md:text-lg">청년 생애 첫차 (국비 20% 추가)</span>
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                <span className="text-base font-bold md:text-lg">다자녀 자녀 수</span>
                <select
                  className="rounded-xl border border-gray-300 bg-white px-5 py-4 text-base font-medium shadow-sm transition-all hover:border-gray-400"
                  value={multiChildCount}
                  onChange={(e) => setMultiChildCount(Number(e.target.value))}
                >
                  <option value={0}>해당 없음</option>
                  <option value={2}>2자녀 (+100만원)</option>
                  <option value={3}>3자녀 (+200만원)</option>
                  <option value={4}>4자녀 이상 (+300만원)</option>
                </select>
              </label>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                <span className="text-base font-bold md:text-lg">선수금</span>
                <input
                  className="rounded-xl border border-gray-300 bg-white px-5 py-4 text-base font-medium shadow-sm transition-all hover:border-gray-400"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 10,000,000"
                  value={downPaymentInput}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                <span className="text-base font-bold md:text-lg">할부금리(%)</span>
                <input
                  className="rounded-xl border border-gray-300 bg-white px-5 py-4 text-base font-medium shadow-sm transition-all hover:border-gray-400"
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value || 0))}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                <span className="text-base font-bold md:text-lg">할부개월</span>
                <select
                  className="rounded-xl border border-gray-300 bg-white px-5 py-4 text-base font-medium shadow-sm transition-all hover:border-gray-400"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                >
                  {[24, 36, 48, 60, 72].map((m) => (
                    <option key={m} value={m}>
                      {m}개월
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>

        <aside className="sticky top-6 overflow-hidden rounded-3xl bg-black text-white shadow-2xl">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8">
            <h3 className="mb-8 text-3xl font-black md:text-4xl">견적 요약</h3>
            <dl className="m-0 space-y-1">
              <div className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-base font-medium text-gray-400">모델</dt>
                <dd className="m-0 text-right text-base font-bold">{model.name}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-base font-medium text-gray-400">트림</dt>
                <dd className="m-0 text-right text-base font-bold">{trim.label}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-base font-medium text-gray-400">지역</dt>
                <dd className="m-0 text-right text-base font-bold">{selectedRegion?.name || "-"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-base font-medium text-gray-400">차량가</dt>
                <dd className="m-0 text-right text-lg font-bold">{formatWon(basePrice)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-base font-medium text-gray-400">보조금(국고+지자체)</dt>
                <dd className="m-0 text-right text-lg font-bold text-green-400">- {formatWon(subsidyWon)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-base font-medium text-gray-400">추가 혜택</dt>
                <dd className="m-0 text-right text-lg font-bold text-green-400">- {formatWon(extraBenefitWon)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b-2 border-white/20 py-5">
                <dt className="text-lg font-bold">예상 실구매가</dt>
                <dd className="m-0 text-right text-2xl font-black">{formatWon(estimatedPrice)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-4 pt-6">
                <dt className="text-base font-medium text-gray-400">할부 원금</dt>
                <dd className="m-0 text-right text-lg font-bold">{formatWon(loanPrincipal)}</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-2xl bg-white/5 px-6 py-6">
                <dt className="text-lg font-bold">예상 월 납입금</dt>
                <dd className="m-0 text-right text-3xl font-black text-brandRed">{formatWon(Math.round(monthly))}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

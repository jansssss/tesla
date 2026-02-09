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
    <div className="mx-auto grid max-w-[1200px] gap-5 px-4 py-5 md:px-5 md:py-6">
      <header className="grid gap-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-logo text-3xl font-extrabold tracking-tight text-[#0d1016] md:text-4xl">
              How much <span className="text-brandRed">Tesla</span>?
            </p>
            <p className="mt-1 text-sm font-medium text-[#656d7a] md:text-base">내 테슬라 얼마?</p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="견적 단계">
            <a href="#section-model" className="rounded-full border border-[#b9bcc2] bg-[#ebecf0] px-4 py-2 text-sm text-[#21242a]">1. 모델</a>
            <a href="#section-trim" className="rounded-full border border-[#101216] bg-[#101216] px-4 py-2 text-sm text-white">2. 트림</a>
            <a href="#section-region" className="rounded-full border border-[#b9bcc2] bg-[#ebecf0] px-4 py-2 text-sm text-[#21242a]">3. 지역</a>
            <a href="#section-benefit" className="rounded-full border border-[#b9bcc2] bg-[#ebecf0] px-4 py-2 text-sm text-[#21242a]">4. 혜택·금융</a>
          </nav>
        </div>

        <p className="text-2xl font-extrabold tracking-tight md:text-[34px]">테슬라 얼마?</p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-[52px]">실구매가 빠른 견적</h1>
        <p className="text-base text-[#4e535a] md:text-[22px]">모델 선택부터 지역 보조금, 혜택, 할부 월 납입금까지 한 번에 확인</p>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[1.95fr_1fr]">
        <div className="grid gap-4">
          <section id="section-model" className="rounded-2xl border border-[#c9ccd2] bg-[#e8e8ea] p-3 md:p-4">
            <div className="mb-3 flex gap-2">
              {MODEL_CATALOG.map((item) => (
                <button
                  key={item.id}
                  className={`flex-1 rounded-lg border px-3 py-2 text-base font-bold md:text-lg ${
                    modelId === item.id
                      ? "border-2 border-[#14161a] bg-white"
                      : "border-[#b6bac1] bg-[#f4f5f7]"
                  }`}
                  onClick={() => changeModel(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <img
              className="h-[220px] w-full rounded-xl border border-[#d6d8dd] bg-[#f5f6f8] object-contain md:h-[420px]"
              src={model.image}
              alt={model.name}
            />

            <h2 className="mt-4 text-center text-5xl font-black tracking-tight md:text-[62px]">{model.name}</h2>

            <div className="mb-3 mt-2 grid grid-cols-3 gap-2 text-center">
              {model.stats.map((item) => (
                <div key={item.label}>
                  <strong className="block text-2xl font-black md:text-[42px]">{item.value}</strong>
                  <span className="text-xs text-[#4f5560] md:text-base">{item.label}</span>
                </div>
              ))}
            </div>

            <div id="section-trim" className="grid gap-2">
              {model.trims.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left ${
                    selectedTrimId === item.id
                      ? "border-2 border-[#111318] bg-white"
                      : "border-[#b8bcc2] bg-[#ededf0]"
                  }`}
                  onClick={() => setSelectedTrimId(item.id)}
                >
                  <span className="max-w-[68%] text-sm font-semibold md:text-[24px]">{item.label}</span>
                  <strong className="text-lg font-black md:text-[34px]">{formatWon(item.price)}</strong>
                </button>
              ))}
            </div>

            <button className="mt-3 w-full rounded-lg border border-[#d2d4d8] bg-[#f2f2f4] px-3 py-3 text-left text-sm font-bold text-[#1d232b] md:text-[20px]">
              기능 보기 및 비교하기
            </button>
          </section>

          <section id="section-region" className="rounded-2xl border border-[#c9ccd2] bg-[#f0f1f3] p-4">
            <h3 className="mb-2 text-xl font-black md:text-3xl">3. 지역 선택</h3>
            <select
              className="w-full rounded-lg border border-[#b8bcc3] bg-white px-3 py-2 text-base md:text-lg"
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm text-[#3b414a] md:text-base">
              보조금: 국비 {subsidy.national_subsidy_manwon}만원 + 지방비 {subsidy.local_subsidy_manwon}만원 =
              <strong> 총 {subsidy.total_subsidy_manwon}만원</strong>
            </p>
          </section>

          <section id="section-benefit" className="rounded-2xl border border-[#c9ccd2] bg-[#f0f1f3] p-4">
            <h3 className="mb-2 text-xl font-black md:text-3xl">4. 혜택 · 금융</h3>

            <div className="rounded-lg border border-[#d6d9de] bg-white p-3 text-sm leading-7 text-[#2f3540] md:text-base">
              <p>○ 차상위 이하 계층 해당 시 해당 차량 국비 지원액의 20% 추가 지원</p>
              <p>○ 청년(19세~34세) 생애 첫 전기차 구매 시 국비 지원액의 20% 추가 지원</p>
              <p>○ 다자녀가구(18세 이하 자녀 2명 이상) 자녀 수에 따라 최대 300만원 추가 지원</p>
              <p className="text-[#5c646f]">* (2자녀) 100만원, (3자녀) 200만원, (4자녀 이상) 300만원</p>
            </div>

            <div className="mt-3 grid gap-2">
              <label className="flex items-center gap-2 text-sm md:text-base">
                <input
                  type="checkbox"
                  checked={isLowIncomeBenefit}
                  onChange={(e) => setIsLowIncomeBenefit(e.target.checked)}
                />
                차상위 이하 계층 (국비 20% 추가)
              </label>
              <label className="flex items-center gap-2 text-sm md:text-base">
                <input
                  type="checkbox"
                  checked={isYouthBenefit}
                  onChange={(e) => setIsYouthBenefit(e.target.checked)}
                />
                청년 생애 첫차 (국비 20% 추가)
              </label>
              <label className="grid gap-1 text-xs text-[#3d424a] md:text-sm">
                다자녀 자녀 수
                <select
                  className="rounded-lg border border-[#b8bcc3] bg-white px-3 py-2 text-sm md:text-base"
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

            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <label className="grid gap-1 text-xs text-[#3d424a] md:text-sm">
                선수금(원)
                <input
                  className="rounded-lg border border-[#b8bcc3] bg-white px-3 py-2 text-sm md:text-base"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 10,000,000"
                  value={downPaymentInput}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                />
              </label>
              <label className="grid gap-1 text-xs text-[#3d424a] md:text-sm">
                할부금리(%)
                <input
                  className="rounded-lg border border-[#b8bcc3] bg-white px-3 py-2 text-sm md:text-base"
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value || 0))}
                />
              </label>
              <label className="grid gap-1 text-xs text-[#3d424a] md:text-sm">
                할부개월
                <select
                  className="rounded-lg border border-[#b8bcc3] bg-white px-3 py-2 text-sm md:text-base"
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

        <aside className="sticky top-4 rounded-2xl bg-[#07090d] p-4 text-white">
          <h3 className="mb-2 text-3xl font-black md:text-4xl">견적 요약</h3>
          <dl className="m-0">
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">모델</dt>
              <dd className="m-0 text-right font-semibold">{model.name}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">트림</dt>
              <dd className="m-0 text-right font-semibold">{trim.label}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">지역</dt>
              <dd className="m-0 text-right font-semibold">{selectedRegion?.name || "-"}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">차량가</dt>
              <dd className="m-0 text-right font-semibold">{formatWon(basePrice)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">보조금(국고+지자체)</dt>
              <dd className="m-0 text-right font-semibold">- {formatWon(subsidyWon)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">추가 혜택</dt>
              <dd className="m-0 text-right font-semibold">- {formatWon(extraBenefitWon)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm font-extrabold md:text-lg">
              <dt>예상 실구매가</dt>
              <dd className="m-0 text-right">{formatWon(estimatedPrice)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm md:text-base">
              <dt className="text-[#c6c9ce]">할부 원금</dt>
              <dd className="m-0 text-right font-semibold">{formatWon(loanPrincipal)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/15 py-2 text-sm font-extrabold md:text-lg">
              <dt>예상 월 납입금</dt>
              <dd className="m-0 text-right">{formatWon(Math.round(monthly))}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

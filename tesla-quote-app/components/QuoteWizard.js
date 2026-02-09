"use client";

import { useMemo, useState } from "react";

const MODEL_CATALOG = [
  {
    id: "model3",
    name: "Model 3",
    image: "/model3.svg",
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
    image: "/modely.svg",
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

const EXTRA_BENEFITS = [
  { key: "tradein", label: "전환지원금", amount: 1000000 },
  { key: "multiChild", label: "다자녀지원금", amount: 1000000 },
  { key: "youngDriver", label: "청년 첫차지원", amount: 500000 }
];

function formatWon(value) {
  return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
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
  const [selectedBenefits, setSelectedBenefits] = useState({});
  const [downPayment, setDownPayment] = useState(10000000);
  const [rate, setRate] = useState(4.2);
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
  const subsidyWon = subsidy.total_subsidy_manwon * 10000;
  const extraBenefitWon = EXTRA_BENEFITS.reduce(
    (sum, item) => sum + (selectedBenefits[item.key] ? item.amount : 0),
    0
  );
  const estimatedPrice = Math.max(basePrice - subsidyWon - extraBenefitWon, 0);
  const loanPrincipal = Math.max(estimatedPrice - Number(downPayment || 0), 0);
  const monthly = monthlyPayment(loanPrincipal, Number(rate || 0), Number(months || 0));

  const toggleBenefit = (key) => {
    setSelectedBenefits((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const changeModel = (id) => {
    const nextModel = MODEL_CATALOG.find((item) => item.id === id);
    setModelId(id);
    setSelectedTrimId(nextModel.trims[0].id);
  };

  return (
    <div className="wizard-wrap">
      <header className="hero">
        <div className="hero-top">
          <div className="brand">
            <p className="brand-main">
              How much <span className="brand-accent">Tesla</span>?
            </p>
            <p className="brand-sub">내 테슬라 얼마?</p>
          </div>
          <div className="steps" aria-label="견적 단계">
            <a href="#section-model" className="step-chip">1. 모델</a>
            <a href="#section-trim" className="step-chip active">2. 트림</a>
            <a href="#section-region" className="step-chip">3. 지역</a>
            <a href="#section-benefit" className="step-chip">4. 혜택·금융</a>
          </div>
        </div>

        <p className="eyebrow">테슬라 얼마?</p>
        <h1>실구매가 빠른 견적</h1>
        <p>모델 선택부터 지역 보조금, 혜택, 할부 월 납입금까지 한 번에 확인</p>
      </header>

      <div className="main-grid">
        <div className="left-column">
          <section className="panel" id="section-model">
            <div className="model-select">
              {MODEL_CATALOG.map((item) => (
                <button
                  key={item.id}
                  className={`model-pill ${modelId === item.id ? "active" : ""}`}
                  onClick={() => changeModel(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <img className="car-image" src={model.image} alt={model.name} />

            <h2>{model.name}</h2>
            <div className="stats-grid">
              {model.stats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="trim-list" id="section-trim">
              {model.trims.map((item) => (
                <button
                  key={item.id}
                  className={`trim-card ${selectedTrimId === item.id ? "selected" : ""}`}
                  onClick={() => setSelectedTrimId(item.id)}
                >
                  <span>{item.label}</span>
                  <strong>{formatWon(item.price)}</strong>
                </button>
              ))}
            </div>

            <button className="feature-link" type="button">기능 보기 및 비교하기</button>
          </section>

          <section className="section-box" id="section-region">
            <h3>3. 지역 선택</h3>
            <select value={regionCode} onChange={(e) => setRegionCode(e.target.value)}>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <p className="subsidy-line">
              보조금: 국비 {subsidy.national_subsidy_manwon}만원 + 지방비 {subsidy.local_subsidy_manwon}만원 =
              <strong> 총 {subsidy.total_subsidy_manwon}만원</strong>
            </p>
          </section>

          <section className="section-box" id="section-benefit">
            <h3>4. 혜택 · 금융</h3>
            <div className="check-grid">
              {EXTRA_BENEFITS.map((item) => (
                <label key={item.key}>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedBenefits[item.key])}
                    onChange={() => toggleBenefit(item.key)}
                  />
                  {item.label} ({formatWon(item.amount)})
                </label>
              ))}
            </div>

            <div className="finance-grid">
              <label>
                선수금(원)
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value || 0))}
                />
              </label>
              <label>
                할부금리(%)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value || 0))}
                />
              </label>
              <label>
                할부개월
                <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
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

        <aside className="summary">
          <h3>견적 요약</h3>
          <dl>
            <div>
              <dt>모델</dt>
              <dd>{model.name}</dd>
            </div>
            <div>
              <dt>트림</dt>
              <dd>{trim.label}</dd>
            </div>
            <div>
              <dt>지역</dt>
              <dd>{selectedRegion?.name || "-"}</dd>
            </div>
            <div>
              <dt>차량가</dt>
              <dd>{formatWon(basePrice)}</dd>
            </div>
            <div>
              <dt>보조금(국고+지자체)</dt>
              <dd>- {formatWon(subsidyWon)}</dd>
            </div>
            <div>
              <dt>추가 혜택</dt>
              <dd>- {formatWon(extraBenefitWon)}</dd>
            </div>
            <div className="bold">
              <dt>예상 실구매가</dt>
              <dd>{formatWon(estimatedPrice)}</dd>
            </div>
            <div>
              <dt>할부 원금</dt>
              <dd>{formatWon(loanPrincipal)}</dd>
            </div>
            <div className="bold">
              <dt>예상 월 납입금</dt>
              <dd>{formatWon(Math.round(monthly))}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

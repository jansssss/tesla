"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  // URL 파라미터에서 초기값 가져오기
  const getInitialState = () => {
    if (typeof window === 'undefined') return null;

    const urlModelId = searchParams.get('model') || "model3";
    const urlTrimId = searchParams.get('trim') || "m3-rwd";
    const urlRegion = searchParams.get('region') || regions[0]?.code || "";
    const urlYouth = searchParams.get('youth') === '1';
    const urlLowIncome = searchParams.get('lowIncome') === '1';
    const urlEvConversion = searchParams.get('evConversion') === '1';
    const urlMultiChild = parseInt(searchParams.get('multiChild') || '0');
    const urlDownPayment = parseInt(searchParams.get('downPayment') || '10000000');
    const urlRate = parseFloat(searchParams.get('rate') || '3.6');
    const urlMonths = parseInt(searchParams.get('months') || '60');

    return {
      modelId: urlModelId,
      selectedTrimId: urlTrimId,
      regionCode: urlRegion,
      isYouthBenefit: urlYouth,
      isLowIncomeBenefit: urlLowIncome,
      isEvConversionBenefit: urlEvConversion,
      multiChildCount: urlMultiChild,
      downPayment: urlDownPayment,
      rate: urlRate,
      months: urlMonths
    };
  };

  const initialState = getInitialState();

  const [modelId, setModelId] = useState(initialState?.modelId || "model3");
  const [selectedTrimId, setSelectedTrimId] = useState(initialState?.selectedTrimId || "m3-rwd");
  const [regionCode, setRegionCode] = useState(initialState?.regionCode || regions[0]?.code || "");
  const [isYouthBenefit, setIsYouthBenefit] = useState(initialState?.isYouthBenefit || false);
  const [isLowIncomeBenefit, setIsLowIncomeBenefit] = useState(initialState?.isLowIncomeBenefit || false);
  const [isEvConversionBenefit, setIsEvConversionBenefit] = useState(initialState?.isEvConversionBenefit || false);
  const [multiChildCount, setMultiChildCount] = useState(initialState?.multiChildCount || 0);
  const [downPayment, setDownPayment] = useState(initialState?.downPayment || 10000000);
  const [downPaymentInput, setDownPaymentInput] = useState(formatNumber(initialState?.downPayment || 10000000));
  const [rate, setRate] = useState(initialState?.rate || 3.6);
  const [months, setMonths] = useState(initialState?.months || 60);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("model");
  const [copied, setCopied] = useState(false);

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
  const evConversionBenefitWon = isEvConversionBenefit ? 1000000 : 0;
  const multiChildBenefitWon = MULTI_CHILD_BENEFIT_MAP[multiChildCount] || 0;
  const extraBenefitWon = youthBenefitWon + lowIncomeBenefitWon + evConversionBenefitWon + multiChildBenefitWon;
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const sections = ["model", "trim", "region", "benefit"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 견적 URL 생성
  const generateShareUrl = () => {
    const params = new URLSearchParams({
      model: modelId,
      trim: selectedTrimId,
      region: regionCode,
      youth: isYouthBenefit ? '1' : '0',
      lowIncome: isLowIncomeBenefit ? '1' : '0',
      evConversion: isEvConversionBenefit ? '1' : '0',
      multiChild: multiChildCount.toString(),
      downPayment: downPayment.toString(),
      rate: rate.toString(),
      months: months.toString()
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  // URL 복사
  const copyUrlToClipboard = async () => {
    try {
      const url = generateShareUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('URL 복사에 실패했습니다.');
    }
  };

  // 카카오톡 공유
  const shareToKakao = () => {
    if (typeof window === 'undefined' || !window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('10836823db1cf5d613d24a19e229f8f9');
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '테슬라 견적 계산 완료!',
        description: `${model.name} ${trim.label} - 실구매가 ${formatWon(estimatedPrice)}`,
        imageUrl: 'https://paytesla.kr/logo.svg',
        link: {
          mobileWebUrl: generateShareUrl(),
          webUrl: generateShareUrl(),
        },
      },
      buttons: [
        {
          title: '내 견적 확인하기',
          link: {
            mobileWebUrl: generateShareUrl(),
            webUrl: generateShareUrl(),
          },
        },
      ],
    });
  };

  // 이미지로 저장
  const downloadAsImage = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('quote-summary');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `테슬라_견적_${model.name}_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      alert('이미지 저장에 실패했습니다.');
    }
  };

  return (
    <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-5 md:gap-8 md:px-8 md:py-12">
      <header>
        <h1 className="text-center font-logo text-3xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
          How much <span className="text-brandRed">Tesla</span>?
        </h1>
      </header>

      {/* Mobile Navigation - sticky below header */}
      <nav className="sticky top-0 z-40 flex flex-wrap justify-center gap-2 bg-white py-3 shadow-md md:hidden" aria-label="견적 단계">
        <a
          href="#section-model"
          className={`rounded-full border px-3.5 py-2 text-xs font-medium shadow-sm transition-all ${
            activeSection === "model"
              ? "border-black bg-black text-white hover:bg-gray-900"
              : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
          }`}
        >
          1. 모델
        </a>
        <a
          href="#section-trim"
          className={`rounded-full border px-3.5 py-2 text-xs font-medium shadow-sm transition-all ${
            activeSection === "trim"
              ? "border-black bg-black text-white hover:bg-gray-900"
              : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
          }`}
        >
          2. 트림
        </a>
        <a
          href="#section-region"
          className={`rounded-full border px-3.5 py-2 text-xs font-medium shadow-sm transition-all ${
            activeSection === "region"
              ? "border-black bg-black text-white hover:bg-gray-900"
              : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
          }`}
        >
          3. 지역
        </a>
        <a
          href="#section-benefit"
          className={`rounded-full border px-3.5 py-2 text-xs font-medium shadow-sm transition-all ${
            activeSection === "benefit"
              ? "border-black bg-black text-white hover:bg-gray-900"
              : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
          }`}
        >
          4. 혜택·금융
        </a>
      </nav>

      <div className="grid items-start gap-5 md:gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="grid gap-5 md:gap-8">
          <section id="section-model" className="overflow-hidden rounded-2xl bg-white shadow-lg md:rounded-3xl">
            <div className="flex gap-2 border-b border-gray-200 p-4 md:gap-4 md:p-6">
              {MODEL_CATALOG.map((item) => (
                <button
                  key={item.id}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold transition-all md:px-6 md:py-4 md:text-lg ${
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

            <div className="bg-gradient-to-b from-gray-50 to-white p-5 md:p-12">
              <img
                className="h-[200px] w-full object-contain md:h-[480px]"
                src={model.image}
                alt={model.name}
              />

              <h2 className="mt-6 text-center text-[32px] font-medium leading-none tracking-normal md:mt-12 md:text-[40px]">{model.name}</h2>

              <div className="mx-auto mb-5 mt-6 grid grid-cols-3 gap-4 text-center md:mb-8 md:mt-6 md:max-w-3xl md:gap-8">
                {model.stats.map((item) => (
                  <div key={item.label} className="px-1">
                    <strong className="block text-[28px] font-medium leading-none tracking-tight md:text-[28px]">{item.value}</strong>
                    <span className="mt-1 block text-[11px] font-normal leading-tight text-gray-500 md:mt-1.5 md:text-xs">{item.label}</span>
                  </div>
                ))}
              </div>

              <div id="section-trim" className="grid gap-2.5 md:gap-3">
                {model.trims.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-start justify-between gap-3 rounded-xl px-4 py-4 text-left transition-all md:items-center md:rounded-2xl md:px-6 md:py-5 ${
                      selectedTrimId === item.id
                        ? "bg-black text-white shadow-lg"
                        : "bg-white text-gray-900 hover:bg-gray-100 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedTrimId(item.id)}
                  >
                    <span className="flex-1 pr-2 text-[13px] font-normal leading-snug md:text-xl md:font-semibold">{item.label}</span>
                    <strong className="shrink-0 text-[17px] font-extrabold md:text-3xl">{formatWon(item.price)}</strong>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section id="section-region" className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg md:rounded-3xl md:p-8">
            <h3 className="mb-4 text-xl font-black md:mb-6 md:text-3xl">3. 지역 선택</h3>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:border-gray-400 md:rounded-xl md:px-5 md:py-4 md:text-lg"
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <div className="mt-4 rounded-lg bg-gray-50 p-4 md:mt-6 md:rounded-xl md:p-5">
              <p className="text-sm text-gray-700 md:text-lg">
                보조금: <span className="font-semibold">국비 {subsidy.national_subsidy_manwon}만원</span> + <span className="font-semibold">지방비 {subsidy.local_subsidy_manwon}만원</span>
              </p>
              <p className="mt-1.5 text-lg font-black md:mt-2 md:text-2xl">
                총 {subsidy.total_subsidy_manwon}만원
              </p>
            </div>
          </section>

          <section id="section-benefit" className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg md:rounded-3xl md:p-8">
            <h3 className="mb-4 text-xl font-black md:mb-6 md:text-3xl">4. 혜택 · 금융</h3>

            <div className="mt-4 grid gap-3 md:mt-6 md:gap-4">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-gray-50 px-4 py-3 transition-all hover:bg-gray-100 md:gap-3 md:rounded-xl md:px-5 md:py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 md:h-5 md:w-5"
                  checked={isLowIncomeBenefit}
                  onChange={(e) => setIsLowIncomeBenefit(e.target.checked)}
                />
                <span className="text-sm font-semibold md:text-lg">차상위 이하 계층 (국비 20% 추가)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-gray-50 px-4 py-3 transition-all hover:bg-gray-100 md:gap-3 md:rounded-xl md:px-5 md:py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 md:h-5 md:w-5"
                  checked={isYouthBenefit}
                  onChange={(e) => setIsYouthBenefit(e.target.checked)}
                />
                <span className="text-sm font-semibold md:text-lg">청년 생애 첫차 (국비 20% 추가)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-gray-50 px-4 py-3 transition-all hover:bg-gray-100 md:gap-3 md:rounded-xl md:px-5 md:py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 md:h-5 md:w-5"
                  checked={isEvConversionBenefit}
                  onChange={(e) => setIsEvConversionBenefit(e.target.checked)}
                />
                <span className="text-sm font-semibold md:text-lg">전기차 전환지원금 (+100만원)</span>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-gray-700 md:gap-2">
                <span className="text-sm font-bold md:text-lg">다자녀 자녀 수</span>
                <select
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:border-gray-400 md:rounded-xl md:px-5 md:py-4 md:text-base"
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

            <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-gray-700 md:gap-2">
                <span className="text-sm font-bold md:text-lg">선수금</span>
                <input
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:border-gray-400 md:rounded-xl md:px-5 md:py-4 md:text-base"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 10,000,000"
                  value={downPaymentInput}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-gray-700 md:gap-2">
                <span className="text-sm font-bold md:text-lg">할부금리(%)</span>
                <input
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:border-gray-400 md:rounded-xl md:px-5 md:py-4 md:text-base"
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value || 0))}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-gray-700 md:gap-2">
                <span className="text-sm font-bold md:text-lg">할부개월</span>
                <select
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:border-gray-400 md:rounded-xl md:px-5 md:py-4 md:text-base"
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

        <div className="grid gap-5 md:gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden flex-wrap justify-start gap-2 md:flex" aria-label="견적 단계">
            <a
              href="#section-model"
              className={`rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-all ${
                activeSection === "model"
                  ? "border-black bg-black text-white hover:bg-gray-900"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
              }`}
            >
              1. 모델
            </a>
            <a
              href="#section-trim"
              className={`rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-all ${
                activeSection === "trim"
                  ? "border-black bg-black text-white hover:bg-gray-900"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
              }`}
            >
              2. 트림
            </a>
            <a
              href="#section-region"
              className={`rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-all ${
                activeSection === "region"
                  ? "border-black bg-black text-white hover:bg-gray-900"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
              }`}
            >
              3. 지역
            </a>
            <a
              href="#section-benefit"
              className={`rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-all ${
                activeSection === "benefit"
                  ? "border-black bg-black text-white hover:bg-gray-900"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow"
              }`}
            >
              4. 혜택·금융
            </a>
          </nav>

          <aside id="quote-summary" className="sticky top-4 self-start overflow-hidden rounded-2xl bg-black text-white shadow-2xl md:rounded-3xl">
          <div className="bg-gradient-to-br from-gray-900 to-black p-5 md:p-8">
            <h3 className="mb-5 text-2xl font-black md:mb-8 md:text-4xl">견적 요약</h3>
            <dl className="m-0 space-y-0.5">
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 md:gap-4 md:py-4">
                <dt className="text-sm font-medium text-gray-400 md:text-base">모델</dt>
                <dd className="m-0 text-right text-sm font-bold md:text-base">{model.name}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 md:gap-4 md:py-4">
                <dt className="text-sm font-medium text-gray-400 md:text-base">트림</dt>
                <dd className="m-0 text-right text-sm font-bold md:text-base">{trim.label}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 md:gap-4 md:py-4">
                <dt className="text-sm font-medium text-gray-400 md:text-base">지역</dt>
                <dd className="m-0 text-right text-sm font-bold md:text-base">{selectedRegion?.name || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 md:gap-4 md:py-4">
                <dt className="text-sm font-medium text-gray-400 md:text-base">차량가</dt>
                <dd className="m-0 text-right text-base font-bold md:text-lg">{formatWon(basePrice)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 md:gap-4 md:py-4">
                <dt className="text-sm font-medium text-gray-400 md:text-base">보조금(국고+지자체)</dt>
                <dd className="m-0 text-right text-base font-bold text-green-400 md:text-lg">- {formatWon(subsidyWon)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 md:gap-4 md:py-4">
                <dt className="text-sm font-medium text-gray-400 md:text-base">추가 혜택</dt>
                <dd className="m-0 text-right text-base font-bold text-green-400 md:text-lg">- {formatWon(extraBenefitWon)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b-2 border-white/20 py-3.5 md:gap-4 md:py-5">
                <dt className="text-base font-bold md:text-lg">예상 실구매가</dt>
                <dd className="m-0 text-right text-xl font-black md:text-2xl">{formatWon(estimatedPrice)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 py-3 pt-4 md:gap-4 md:py-4 md:pt-6">
                <dt className="text-sm font-medium text-gray-400 md:text-base">할부 원금</dt>
                <dd className="m-0 text-right text-base font-bold md:text-lg">{formatWon(loanPrincipal)}</dd>
              </div>
              <div className="flex justify-between gap-3 rounded-xl bg-white/5 px-4 py-4 md:gap-4 md:rounded-2xl md:px-6 md:py-6">
                <dt className="text-base font-bold md:text-lg">예상 월 납입금</dt>
                <dd className="m-0 text-right text-2xl font-black text-brandRed md:text-3xl">{formatWon(Math.round(monthly))}</dd>
              </div>
            </dl>

            {/* 공유 버튼 */}
            <div className="mt-6 border-t border-white/10 pt-6 md:mt-8 md:pt-8">
              <p className="mb-3 text-xs font-medium text-gray-400 md:mb-4 md:text-sm">
                견적 공유하기
              </p>
              <div className="grid gap-2 md:grid-cols-3 md:gap-3">
                <button
                  onClick={copyUrlToClipboard}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-semibold transition-all hover:bg-white/20 md:px-4 md:py-3"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">{copied ? '복사됨!' : 'URL 복사'}</span>
                </button>

                <button
                  onClick={shareToKakao}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#FEE500] px-3 py-2.5 text-xs font-semibold text-black transition-all hover:bg-[#FDD835] md:px-4 md:py-3"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.8 6.7-.2.8-.7 2.8-.8 3.2-.1.5.2.5.4.4.3-.1 3.5-2.3 4-2.7.5.1 1 .1 1.6.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/>
                  </svg>
                  <span className="whitespace-nowrap">카카오톡</span>
                </button>

                <button
                  onClick={downloadAsImage}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-semibold transition-all hover:bg-white/20 md:px-4 md:py-3"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">이미지</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all hover:bg-gray-800 md:h-14 md:w-14"
          aria-label="맨 위로 가기"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

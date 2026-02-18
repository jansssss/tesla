"use client";

import { formatWon } from "@/lib/quoteCalculations";

/**
 * ComparisonSummary Component
 * Full-width educational comparison section for comparison mode
 * Shows detailed price breakdowns, comparison metrics, and upgrade strategies
 */
export default function ComparisonSummary({
  modelNameA,
  modelNameB,
  quoteA,
  quoteB,
  comparison,
  upgradeSuggestions,
  className = ""
}) {
  if (!comparison || !upgradeSuggestions || !quoteA || !quoteB) {
    return null;
  }

  const { priceDiff, monthlyDiff, isPricierB, isMonthlyHigherB } = comparison;
  const { strategy1, strategy2, strategy3 } = upgradeSuggestions;

  // Determine direction labels
  const priceDiffLabel = isPricierB
    ? `${modelNameB}가 더 비쌈`
    : `${modelNameA}가 더 비쌈`;
  const monthlyDiffLabel = isMonthlyHigherB
    ? `${modelNameB}가 더 비쌈`
    : `${modelNameA}가 더 비쌈`;

  return (
    <section className={`overflow-hidden rounded-2xl bg-black text-white shadow-2xl md:rounded-3xl ${className}`}>
      <div className="bg-gradient-to-br from-gray-900 to-black p-5 md:p-5">
        <h3 className="mb-4 text-lg font-black md:mb-5 md:text-xl">모델 비교 상세 분석</h3>

        {/* Model Names */}
        <div className="mb-5 text-center">
          <p className="text-sm font-semibold md:text-base">
            {modelNameA} <span className="text-gray-400">vs</span> {modelNameB}
          </p>
        </div>

        {/* Side-by-side Price Breakdowns */}
        <div className="mb-5 grid gap-4 md:grid-cols-2 md:gap-5">
          {/* Vehicle A Breakdown */}
          <div className="rounded-lg bg-white/5 p-4">
            <h5 className="mb-3 text-sm font-bold md:text-base">{modelNameA} 가격 구성</h5>
            <dl className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <dt>차량가</dt>
                <dd>{formatWon(quoteA.basePrice)}</dd>
              </div>
              <div className="flex justify-between text-green-400">
                <dt>- 보조금</dt>
                <dd>-{formatWon(quoteA.subsidyWon)}</dd>
              </div>
              <div className="flex justify-between text-green-400">
                <dt>- 추가혜택</dt>
                <dd>-{formatWon(quoteA.extraBenefitWon)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-2 font-bold">
                <dt>실구매가</dt>
                <dd>{formatWon(quoteA.estimatedPrice)}</dd>
              </div>
            </dl>
          </div>

          {/* Vehicle B Breakdown */}
          <div className="rounded-lg bg-white/5 p-4">
            <h5 className="mb-3 text-sm font-bold md:text-base">{modelNameB} 가격 구성</h5>
            <dl className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <dt>차량가</dt>
                <dd>{formatWon(quoteB.basePrice)}</dd>
              </div>
              <div className="flex justify-between text-green-400">
                <dt>- 보조금</dt>
                <dd>-{formatWon(quoteB.subsidyWon)}</dd>
              </div>
              <div className="flex justify-between text-green-400">
                <dt>- 추가혜택</dt>
                <dd>-{formatWon(quoteB.extraBenefitWon)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-2 font-bold">
                <dt>실구매가</dt>
                <dd>{formatWon(quoteB.estimatedPrice)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Comparison Metrics */}
        <div className="mb-5 space-y-3">
          {/* Price Difference */}
          <div className="rounded-lg bg-white/5 p-4">
            <p className="mb-1 text-xs font-medium text-gray-400 md:text-sm">💰 실구매가 차액</p>
            <p className={`text-base font-black md:text-lg ${Math.abs(priceDiff) > 0 ? 'text-brandRed' : 'text-green-400'}`}>
              {priceDiff > 0 ? '+' : priceDiff < 0 ? '-' : ''} {formatWon(Math.abs(priceDiff))}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {Math.abs(priceDiff) > 0 ? `(${priceDiffLabel})` : '(동일)'}
            </p>
          </div>

          {/* Monthly Payment Difference */}
          <div className="rounded-lg bg-white/5 p-4">
            <p className="mb-1 text-xs font-medium text-gray-400 md:text-sm">📊 월 납입금 차액</p>
            <p className={`text-base font-black md:text-lg ${Math.abs(monthlyDiff) > 0 ? 'text-brandRed' : 'text-green-400'}`}>
              {monthlyDiff > 0 ? '+' : monthlyDiff < 0 ? '-' : ''} {formatWon(Math.abs(monthlyDiff))}/월
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {Math.abs(monthlyDiff) > 0 ? `(${monthlyDiffLabel})` : '(동일)'}
            </p>
          </div>
        </div>

        {/* Educational Section: How Prices Are Calculated */}
        <div className="mb-5 rounded-lg bg-white/5 p-4">
          <h5 className="mb-3 flex items-center gap-2 text-sm font-bold md:text-base">
            <span>💡</span>
            가격이 이렇게 계산됩니다
          </h5>
          <div className="space-y-2 text-xs leading-relaxed md:text-sm">
            <p>
              <strong>1. 차량 기본가</strong> - 제조사가 정한 출고가입니다.
            </p>
            <p>
              <strong>2. 보조금 (국고 + 지방비)</strong> - 선택한 지역의 전기차 보조금이 차감됩니다.
            </p>
            <p>
              <strong>3. 추가 혜택</strong> - 청년, 차상위, 다자녀, 전환지원금 등이 추가 차감됩니다.
            </p>
            <p className="pt-2 text-gray-400">
              💡 Tip: 지역과 혜택 선택에 따라 최대 수백만원까지 차이가 날 수 있습니다!
            </p>
          </div>
        </div>

        {/* Upgrade Suggestions - Only show if Model B is more expensive */}
        {isPricierB && priceDiff > 0 && (
          <div className="border-t border-white/20 pt-5 md:pt-6">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold md:mb-4 md:text-base">
              <span>🎯</span>
              같은 월 납입금으로 이용하려면?
            </h4>

            {/* Introductory explanation */}
            <p className="mb-4 text-xs leading-relaxed text-gray-300 md:text-sm">
              더 비싼 차량을 현재와 동일한 월 납입금으로 이용하는 3가지 방법을 제안합니다.
            </p>

            <div className="space-y-3">
              {/* Strategy 1: Down Payment Increase */}
              {strategy1.feasible && (
                <div className="rounded-lg bg-white/10 p-3 md:p-4">
                  <p className="mb-2 text-xs font-bold text-gray-300 md:text-sm">방법 1: 선금 추가</p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    → 선금을 <span className="font-bold text-brandRed">{formatWon(strategy1.additionalDownPayment)}</span> 더 내면
                  </p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    월 납입금 <span className="font-bold">{formatWon(strategy1.resultingMonthly)}</span> ({strategy1.months}개월)
                  </p>
                </div>
              )}

              {/* Strategy 2: Months Extension */}
              {strategy2.feasible && (
                <div className="rounded-lg bg-white/10 p-3 md:p-4">
                  <p className="mb-2 text-xs font-bold text-gray-300 md:text-sm">방법 2: 할부 연장</p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    → 할부를 <span className="font-bold text-brandRed">{strategy2.suggestedMonths}개월</span>로 연장하면
                  </p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    월 납입금 <span className="font-bold">{formatWon(strategy2.resultingMonthly)}</span>
                  </p>
                </div>
              )}

              {/* Strategy 3: Combined */}
              {strategy3.feasible && (
                <div className="rounded-lg bg-white/10 p-3 md:p-4">
                  <p className="mb-2 text-xs font-bold text-gray-300 md:text-sm">방법 3: 절충안</p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    → 선금 <span className="font-bold text-brandRed">{formatWon(strategy3.additionalDownPayment)}</span> 추가 +
                    할부 <span className="font-bold text-brandRed">{strategy3.suggestedMonths}개월</span>
                  </p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    월 납입금 <span className="font-bold">{formatWon(strategy3.resultingMonthly)}</span>
                  </p>
                </div>
              )}

              {!strategy1.feasible && !strategy2.feasible && !strategy3.feasible && (
                <div className="rounded-lg bg-white/10 p-3 md:p-4">
                  <p className="text-xs text-gray-400 md:text-sm">
                    현재 조건에서는 월 납입금을 맞추기 어렵습니다. 선금을 더 늘리거나 할부 기간을 조정해보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message when Model A is more expensive */}
        {!isPricierB && priceDiff < 0 && (
          <div className="border-t border-white/20 pt-5 md:pt-6">
            <div className="rounded-lg bg-white/10 p-3 md:p-4">
              <p className="text-xs text-gray-400 md:text-sm">
                {modelNameA}가 더 비싼 모델입니다. 반대로 비교해보세요.
              </p>
            </div>
          </div>
        )}

        {/* Message when prices are equal */}
        {priceDiff === 0 && (
          <div className="border-t border-white/20 pt-5 md:pt-6">
            <div className="rounded-lg bg-white/10 p-3 md:p-4">
              <p className="text-xs text-gray-400 md:text-sm">
                두 모델의 가격이 동일합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

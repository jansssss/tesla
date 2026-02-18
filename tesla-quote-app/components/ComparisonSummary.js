"use client";

import { formatWon } from "@/lib/quoteCalculations";

/**
 * ComparisonSummary Component
 * Displays comparison results and upgrade suggestions
 * Tesla-style black background card
 */
export default function ComparisonSummary({
  modelNameA,
  modelNameB,
  comparison,
  upgradeSuggestions,
  className = ""
}) {
  if (!comparison || !upgradeSuggestions) {
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
    <aside className={`overflow-hidden rounded-2xl bg-black text-white shadow-2xl md:rounded-3xl ${className}`}>
      <div className="bg-gradient-to-br from-gray-900 to-black p-5 md:p-6">
        <h3 className="mb-5 text-2xl font-black md:mb-6 md:text-2xl">모델 비교 결과</h3>

        {/* Model Names */}
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold md:text-lg">
            {modelNameA} <span className="text-gray-400">vs</span> {modelNameB}
          </p>
        </div>

        {/* Price Difference */}
        <div className="mb-6 rounded-xl bg-white/5 p-4 md:p-6">
          <p className="mb-2 text-sm font-medium text-gray-400 md:text-base">실구매가 차액</p>
          <p className={`text-2xl font-black md:text-xl ${Math.abs(priceDiff) > 0 ? 'text-brandRed' : 'text-green-400'}`}>
            {priceDiff > 0 ? '+' : priceDiff < 0 ? '-' : ''} {formatWon(Math.abs(priceDiff))}
          </p>
          <p className="mt-1 text-xs text-gray-400 md:text-sm">
            {Math.abs(priceDiff) > 0 ? `(${priceDiffLabel})` : '(동일)'}
          </p>
        </div>

        {/* Monthly Payment Difference */}
        <div className="mb-8 rounded-xl bg-white/5 p-4 md:p-6">
          <p className="mb-2 text-sm font-medium text-gray-400 md:text-base">월 납입금 차액</p>
          <p className={`text-2xl font-black md:text-xl ${Math.abs(monthlyDiff) > 0 ? 'text-brandRed' : 'text-green-400'}`}>
            {monthlyDiff > 0 ? '+' : monthlyDiff < 0 ? '-' : ''} {formatWon(Math.abs(monthlyDiff))}/월
          </p>
          <p className="mt-1 text-xs text-gray-400 md:text-sm">
            {Math.abs(monthlyDiff) > 0 ? `(${monthlyDiffLabel})` : '(동일)'}
          </p>
        </div>

        {/* Upgrade Suggestions - Only show if Model B is more expensive */}
        {isPricierB && priceDiff > 0 && (
          <div className="border-t border-white/20 pt-6 md:pt-8">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold md:mb-6 md:text-lg">
              <span className="text-xl">💡</span>
              같은 월 납입금으로 이용하려면?
            </h4>

            <div className="space-y-4">
              {/* Strategy 1: Down Payment Increase */}
              {strategy1.feasible && (
                <div className="rounded-lg bg-white/10 p-4 md:p-5">
                  <p className="mb-2 text-sm font-bold text-gray-300 md:text-base">방법 1: 선금 추가</p>
                  <p className="text-sm leading-relaxed md:text-base">
                    → 선금을 <span className="font-bold text-brandRed">{formatWon(strategy1.additionalDownPayment)}</span> 더 내면
                  </p>
                  <p className="text-sm leading-relaxed md:text-base">
                    월 납입금 <span className="font-bold">{formatWon(strategy1.resultingMonthly)}</span> ({strategy1.months}개월)
                  </p>
                </div>
              )}

              {/* Strategy 2: Months Extension */}
              {strategy2.feasible && (
                <div className="rounded-lg bg-white/10 p-4 md:p-5">
                  <p className="mb-2 text-sm font-bold text-gray-300 md:text-base">방법 2: 할부 연장</p>
                  <p className="text-sm leading-relaxed md:text-base">
                    → 할부를 <span className="font-bold text-brandRed">{strategy2.suggestedMonths}개월</span>로 연장하면
                  </p>
                  <p className="text-sm leading-relaxed md:text-base">
                    월 납입금 <span className="font-bold">{formatWon(strategy2.resultingMonthly)}</span>
                  </p>
                </div>
              )}

              {/* Strategy 3: Combined */}
              {strategy3.feasible && (
                <div className="rounded-lg bg-white/10 p-4 md:p-5">
                  <p className="mb-2 text-sm font-bold text-gray-300 md:text-base">방법 3: 절충안</p>
                  <p className="text-sm leading-relaxed md:text-base">
                    → 선금 <span className="font-bold text-brandRed">{formatWon(strategy3.additionalDownPayment)}</span> 추가 +
                  </p>
                  <p className="text-sm leading-relaxed md:text-base">
                    할부 <span className="font-bold text-brandRed">{strategy3.suggestedMonths}개월</span>
                  </p>
                  <p className="text-sm leading-relaxed md:text-base">
                    월 납입금 <span className="font-bold">{formatWon(strategy3.resultingMonthly)}</span>
                  </p>
                </div>
              )}

              {!strategy1.feasible && !strategy2.feasible && !strategy3.feasible && (
                <div className="rounded-lg bg-white/10 p-4 md:p-5">
                  <p className="text-sm text-gray-400 md:text-base">
                    현재 조건에서는 월 납입금을 맞추기 어렵습니다. 선금을 더 늘리거나 할부 기간을 조정해보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message when Model A is more expensive */}
        {!isPricierB && priceDiff < 0 && (
          <div className="border-t border-white/20 pt-6 md:pt-8">
            <div className="rounded-lg bg-white/10 p-4 md:p-5">
              <p className="text-sm text-gray-400 md:text-base">
                {modelNameA}가 더 비싼 모델입니다. 반대로 비교해보세요.
              </p>
            </div>
          </div>
        )}

        {/* Message when prices are equal */}
        {priceDiff === 0 && (
          <div className="border-t border-white/20 pt-6 md:pt-8">
            <div className="rounded-lg bg-white/10 p-4 md:p-5">
              <p className="text-sm text-gray-400 md:text-base">
                두 모델의 가격이 동일합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

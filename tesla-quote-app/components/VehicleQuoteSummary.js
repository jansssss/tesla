"use client";

import { formatWon } from "@/lib/quoteCalculations";

/**
 * VehicleQuoteSummary Component
 * Compact quote summary for comparison mode
 * Shows final price and monthly payment for one vehicle
 */
export default function VehicleQuoteSummary({
  modelName,
  quote,
  className = ""
}) {
  if (!quote) {
    return null;
  }

  const totalSavings = (quote.subsidyWon || 0) + (quote.extraBenefitWon || 0);

  return (
    <div className={`overflow-hidden rounded-lg bg-black text-white shadow-lg md:rounded-xl ${className}`}>
      <div className="bg-gradient-to-br from-gray-900 to-black p-4 md:p-5">
        {/* Model Name */}
        <h4 className="mb-3 text-sm font-semibold md:mb-4">
          {modelName}
        </h4>

        {/* 보조금 (국고+지방) — 차량별로 명시 */}
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3 text-sm">
          <span className="text-gray-400">보조금(국고+지방)</span>
          <span className="font-semibold text-green-400">
            − {formatWon(quote.subsidyWon || 0)}
          </span>
        </div>

        {/* Final Price */}
        <div className="mb-3 border-b border-white/10 pb-3">
          <p className="mb-1 text-sm text-gray-400">보조금 차감 예상 차량가</p>
          <p className="text-base font-bold md:text-lg">
            {formatWon(quote.estimatedPrice)}
          </p>
        </div>

        {/* Monthly Payment - Prominent */}
        <div className="mb-3 rounded-lg bg-white/5 p-3">
          <p className="mb-1 text-sm text-gray-400">예상 월 납입금</p>
          <p className="text-lg font-black text-brandRed md:text-xl">
            {formatWon(Math.round(quote.monthly))}/월
          </p>
        </div>

        {/* Total Savings */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">총 할인(보조금+추가혜택)</span>
          <span className="font-semibold text-green-400">
            {formatWon(totalSavings)}
          </span>
        </div>
      </div>
    </div>
  );
}

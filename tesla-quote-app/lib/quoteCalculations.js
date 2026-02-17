/**
 * Tesla Quote Calculation Utilities
 * Handles all quote calculations, comparisons, and upgrade suggestions
 */

const MULTI_CHILD_BENEFIT_MAP = {
  0: 0,
  2: 1000000,
  3: 2000000,
  4: 3000000
};

/**
 * Format a number as Korean Won (₩)
 */
export function formatWon(value) {
  return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

/**
 * Calculate monthly payment using loan amortization formula
 * @param {number} principal - Loan principal amount
 * @param {number} annualRatePct - Annual interest rate as percentage (e.g., 3.6)
 * @param {number} months - Number of months
 * @returns {number} Monthly payment amount
 */
export function monthlyPayment(principal, annualRatePct, months) {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate the complete quote for a vehicle
 * @param {Object} config - Configuration object
 * @param {Object} config.trim - Selected trim with price
 * @param {Object} config.subsidy - Subsidy data with national and local amounts
 * @param {Object} config.benefits - Benefit selections
 * @param {Object} config.financing - Financing options
 * @returns {Object} Quote with estimated price, monthly payment, and breakdown
 */
export function calculateQuote({ trim, subsidy, benefits, financing }) {
  const basePrice = trim.price;
  const nationalSubsidyWon = subsidy.national_subsidy_manwon * 10000;
  const subsidyWon = subsidy.total_subsidy_manwon * 10000;

  // Calculate additional benefits
  const youthBenefitWon = benefits.isYouthBenefit ? Math.round(nationalSubsidyWon * 0.2) : 0;
  const lowIncomeBenefitWon = benefits.isLowIncomeBenefit ? Math.round(nationalSubsidyWon * 0.2) : 0;
  const evConversionBenefitWon = benefits.isEvConversionBenefit ? 1000000 : 0;
  const multiChildBenefitWon = MULTI_CHILD_BENEFIT_MAP[benefits.multiChildCount] || 0;
  const extraBenefitWon = youthBenefitWon + lowIncomeBenefitWon + evConversionBenefitWon + multiChildBenefitWon;

  // Calculate final price
  const estimatedPrice = Math.max(basePrice - subsidyWon - extraBenefitWon, 0);
  const loanPrincipal = Math.max(estimatedPrice - Number(financing.downPayment || 0), 0);
  const monthly = monthlyPayment(loanPrincipal, Number(financing.rate || 0), Number(financing.months || 0));

  return {
    basePrice,
    subsidyWon,
    extraBenefitWon,
    estimatedPrice,
    loanPrincipal,
    monthly: Math.round(monthly),
    breakdown: {
      youthBenefitWon,
      lowIncomeBenefitWon,
      evConversionBenefitWon,
      multiChildBenefitWon
    }
  };
}

/**
 * Compare two quotes
 * @param {Object} quoteA - First quote
 * @param {Object} quoteB - Second quote
 * @returns {Object} Comparison results
 */
export function compareQuotes(quoteA, quoteB) {
  const priceDiff = quoteB.estimatedPrice - quoteA.estimatedPrice;
  const monthlyDiff = quoteB.monthly - quoteA.monthly;

  return {
    priceDiff,
    monthlyDiff,
    isPricierB: priceDiff > 0,
    isMonthlyHigherB: monthlyDiff > 0
  };
}

/**
 * Reverse calculate loan principal from desired monthly payment
 * @param {number} targetMonthly - Desired monthly payment
 * @param {number} annualRatePct - Annual interest rate as percentage
 * @param {number} months - Number of months
 * @returns {number} Required loan principal
 */
function reverseLoanPrincipal(targetMonthly, annualRatePct, months) {
  if (targetMonthly <= 0 || months <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return targetMonthly * months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (targetMonthly * (factor - 1)) / (monthlyRate * factor);
}

/**
 * Find required months to achieve target monthly payment using binary search
 * @param {number} loanPrincipal - Loan principal amount
 * @param {number} annualRatePct - Annual interest rate as percentage
 * @param {number} targetMonthly - Desired monthly payment
 * @returns {number} Required number of months (or null if not achievable)
 */
function findMonthsForTargetPayment(loanPrincipal, annualRatePct, targetMonthly) {
  if (loanPrincipal <= 0 || targetMonthly <= 0) return null;

  // Binary search between 12 months and 120 months (10 years)
  let low = 12;
  let high = 120;
  let result = null;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const calculatedMonthly = monthlyPayment(loanPrincipal, annualRatePct, mid);

    // Allow 1% tolerance
    if (Math.abs(calculatedMonthly - targetMonthly) / targetMonthly < 0.01) {
      result = mid;
      break;
    }

    if (calculatedMonthly > targetMonthly) {
      // Need more months to reduce monthly payment
      low = mid + 1;
    } else {
      // Need fewer months
      high = mid - 1;
    }
  }

  // If binary search didn't find exact match, return closest
  if (result === null && low <= 120) {
    result = low;
  }

  return result;
}

/**
 * Calculate upgrade suggestions to match monthly payment
 * @param {Object} quoteA - Current quote (cheaper model)
 * @param {Object} quoteB - Target quote (more expensive model)
 * @param {Object} financing - Current financing options
 * @returns {Object} Three upgrade strategies
 */
export function calculateUpgradeSuggestions(quoteA, quoteB, financing) {
  const targetMonthly = quoteA.monthly;
  const priceDiff = quoteB.estimatedPrice - quoteA.estimatedPrice;

  // Strategy 1: Increase down payment to match monthly
  const requiredLoanPrincipal = reverseLoanPrincipal(targetMonthly, financing.rate, financing.months);
  const requiredDownPayment = quoteB.estimatedPrice - requiredLoanPrincipal;
  const additionalDownPayment1 = Math.max(requiredDownPayment - financing.downPayment, 0);

  // Strategy 2: Extend months to match monthly
  const loanPrincipalB = quoteB.estimatedPrice - financing.downPayment;
  const suggestedMonths = findMonthsForTargetPayment(loanPrincipalB, financing.rate, targetMonthly);

  // Strategy 3: Combined approach (split difference)
  const halfDiff = priceDiff / 2;
  const moderateDownPayment = financing.downPayment + halfDiff;
  const remainingLoan = quoteB.estimatedPrice - moderateDownPayment;
  const adjustedMonths = findMonthsForTargetPayment(remainingLoan, financing.rate, targetMonthly);

  // Verify strategy 1
  const verifiedMonthly1 = monthlyPayment(requiredLoanPrincipal, financing.rate, financing.months);

  // Verify strategy 2
  const verifiedMonthly2 = suggestedMonths
    ? monthlyPayment(loanPrincipalB, financing.rate, suggestedMonths)
    : null;

  // Verify strategy 3
  const verifiedMonthly3 = adjustedMonths
    ? monthlyPayment(remainingLoan, financing.rate, adjustedMonths)
    : null;

  return {
    strategy1: {
      type: "downPaymentIncrease",
      additionalDownPayment: Math.round(additionalDownPayment1),
      newDownPayment: Math.round(requiredDownPayment),
      months: financing.months,
      resultingMonthly: Math.round(verifiedMonthly1),
      feasible: additionalDownPayment1 > 0 && requiredDownPayment <= quoteB.estimatedPrice
    },
    strategy2: {
      type: "monthsExtension",
      suggestedMonths,
      monthsIncrease: suggestedMonths ? suggestedMonths - financing.months : null,
      downPayment: financing.downPayment,
      resultingMonthly: verifiedMonthly2 ? Math.round(verifiedMonthly2) : null,
      feasible: suggestedMonths !== null && suggestedMonths <= 120 && suggestedMonths > financing.months
    },
    strategy3: {
      type: "combined",
      additionalDownPayment: Math.round(halfDiff),
      newDownPayment: Math.round(moderateDownPayment),
      suggestedMonths: adjustedMonths,
      monthsIncrease: adjustedMonths ? adjustedMonths - financing.months : null,
      resultingMonthly: verifiedMonthly3 ? Math.round(verifiedMonthly3) : null,
      feasible: adjustedMonths !== null && adjustedMonths <= 120
    }
  };
}

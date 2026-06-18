/**
 * Pure affordability model for the in-depth budget planner (Steps 4 & 5).
 *
 * Turns a household budget + loan assumptions into the numbers the UI shows:
 * a conservative→stretch comfortable-payment range, the home price that payment
 * supports (all-in: PITI + PMI + HOA + a maintenance reserve), the lender's
 * 28/36 ceiling, cash-to-close + reserves, and rate sensitivity.
 *
 * Savings split into "protected" (retirement, emergency — never redirected) and
 * "flexible" (general investing + the down-payment fund, which frees up at
 * purchase). The maintenance reserve, HOA, and closing costs are rules of thumb
 * the caller can adjust or zero out (pass 0 to turn off).
 *
 * No React. Fully unit-tested in affordabilityModel.test.ts.
 */

export interface SavingsLine {
  label: string;
  amount: number;
  protectedFlag: boolean;
  isDownPayment: boolean;
}

/** Heuristic default: retirement/emergency lines are protected. */
export function isProtectedByDefault(label: string): boolean {
  return /retire|401|\bira\b|roth|emergency|pension/i.test(label);
}

export function bucketSavings(rows: SavingsLine[]) {
  let protectedTotal = 0;
  let flexibleTotal = 0;
  let downPaymentSavings = 0;
  for (const r of rows) {
    if (r.isDownPayment) downPaymentSavings += r.amount;
    if (r.protectedFlag) protectedTotal += r.amount;
    else flexibleTotal += r.amount;
  }
  return { protectedTotal, flexibleTotal, downPaymentSavings };
}

/* ----------------------------- payment range ----------------------------- */

export interface PaymentRangeInputs {
  monthlyNet: number;
  monthlyGross: number;
  debts: number;
  fixedTotal: number;
  subsMonthly: number;
  gfTotal: number;
  protectedTotal: number;
  flexibleTotal: number;
  downPaymentSavings: number;
  rentMortgage: number;
}

export function paymentRange(i: PaymentRangeInputs) {
  const lenderMaxPayment = Math.max(
    0,
    Math.min(0.28 * i.monthlyGross, 0.36 * i.monthlyGross - i.debts)
  );
  const clamp = (x: number) => Math.max(0, Math.min(x, lenderMaxPayment));
  // true monthly surplus after everything (fixed, subs, guilt-free, ALL savings)
  const leftover =
    i.monthlyNet - i.fixedTotal - i.subsMonthly - i.gfTotal - i.protectedTotal - i.flexibleTotal;
  // current housing payment "converts" into the new payment; keep all savings
  const conservativePayment = clamp(leftover + i.rentMortgage);
  // also free up the down-payment fund (stops at purchase) + flexible investing
  const stretchPayment = clamp(leftover + i.rentMortgage + i.downPaymentSavings + i.flexibleTotal);
  // tuned: redirect a fraction (0..1) of flexible investing toward the payment
  const tuned = (redirectPct: number) =>
    clamp(
      leftover +
        i.rentMortgage +
        i.downPaymentSavings +
        i.flexibleTotal * Math.max(0, Math.min(1, redirectPct))
    );
  const comfortableVsApprovedGapAt = (redirectPct: number) =>
    Math.max(0, lenderMaxPayment - tuned(redirectPct));
  return { lenderMaxPayment, leftover, conservativePayment, stretchPayment, tuned, comfortableVsApprovedGapAt };
}

/* ------------------------- all-in price back-solve ------------------------ */

export function piPerDollar(annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return n > 0 ? 1 / n : 0;
  return (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export interface AllInInputs {
  targetPayment: number;
  /** fixed down payment in dollars (used when downMode is "dollar" or omitted) */
  downAmount: number;
  /** "dollar" (fixed $) or "percent" (down scales with price). Defaults to "dollar". */
  downMode?: "dollar" | "percent";
  /** down payment % of price, used when downMode is "percent" */
  downPct?: number;
  rate: number;
  term: number;
  taxRatePct: number;
  homeInsAnnual: number;
  pmiRatePct: number;
  hoaMonthly: number;
  /** maintenance reserve as % of home price per year; pass 0 to turn off */
  maintenancePctPerYear: number;
}

export function solveAllInPrice(i: AllInInputs) {
  const factor = piPerDollar(i.rate, i.term);
  const isPct = i.downMode === "percent";
  const pct = isPct ? Math.max(0, Math.min(99, i.downPct ?? 0)) / 100 : 0;
  // seed positive for both modes; the iteration is a contraction and converges fast
  let price = Math.max(i.downAmount, i.targetPayment * 150, 1);
  for (let k = 0; k < 32; k++) {
    const dn = isPct ? price * pct : i.downAmount;
    const mTax = (price * (i.taxRatePct / 100)) / 12;
    const mIns = i.homeInsAnnual / 12;
    const mMaint = (price * (i.maintenancePctPerYear / 100)) / 12;
    const loanG = Math.max(0, price - dn);
    const dpP = isPct ? pct * 100 : price > 0 ? (dn / price) * 100 : 100;
    const mPMI = dpP < 20 ? (loanG * (i.pmiRatePct / 100)) / 12 : 0;
    const piBudget = Math.max(0, i.targetPayment - mTax - mIns - mMaint - mPMI - i.hoaMonthly);
    const loan = factor > 0 ? piBudget / factor : 0;
    const next = isPct ? (pct < 1 ? loan / (1 - pct) : dn) : loan + i.downAmount;
    if (Math.abs(next - price) < 1) {
      price = next;
      break;
    }
    price = next;
  }
  const downResolved = isPct ? price * pct : i.downAmount;
  const loan = Math.max(0, price - downResolved);
  const pi = loan * factor;
  const taxMonthly = (price * (i.taxRatePct / 100)) / 12;
  const insMonthly = i.homeInsAnnual / 12;
  const maintenanceMonthly = (price * (i.maintenancePctPerYear / 100)) / 12;
  const downPctResolved = price > 0 ? (downResolved / price) * 100 : 0;
  const pmiApplies = downPctResolved < 20;
  const pmiMonthly = pmiApplies ? (loan * (i.pmiRatePct / 100)) / 12 : 0;
  const allInPayment = pi + taxMonthly + insMonthly + maintenanceMonthly + pmiMonthly + i.hoaMonthly;
  return {
    price,
    loan,
    downResolved,
    pi,
    taxMonthly,
    insMonthly,
    maintenanceMonthly,
    pmiMonthly,
    hoaMonthly: i.hoaMonthly,
    allInPayment,
    downPctResolved,
    pmiApplies,
  };
}

/* --------------------------- cash + sensitivity --------------------------- */

export function cashPicture(i: {
  price: number;
  downAmount: number;
  closingPct: number;
  capitalAvailable: number;
  allInPayment: number;
}) {
  const closingCosts = i.price * (i.closingPct / 100);
  const cashToClose = i.downAmount + closingCosts;
  const reservesAfter = i.capitalAvailable - cashToClose;
  const reserveMonths = i.allInPayment > 0 ? reservesAfter / i.allInPayment : 0;
  return { closingCosts, cashToClose, reservesAfter, reserveMonths };
}

export function rateSensitivity(base: AllInInputs, deltaPct: number) {
  const at = (rate: number) => solveAllInPrice({ ...base, rate });
  return { base: at(base.rate), up: at(base.rate + deltaPct), down: at(Math.max(0, base.rate - deltaPct)) };
}

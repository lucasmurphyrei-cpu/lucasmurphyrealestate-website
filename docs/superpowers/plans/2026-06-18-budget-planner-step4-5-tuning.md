# Budget Planner — Step 4/5 Comfortable-Payment Tuning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the in-depth budget planner's affordability section into an honest, interactive "control room" — split into Step 4 (reveal your comfortable number) and a new Step 5 (tune the levers + pressure-test against the life you actually want) — backed by a single pure, tested affordability model.

**Architecture:** Extract all comfortable-payment / home-price / cost-of-ownership math out of `BudgetPlannerDetailed.tsx` into one pure module `affordabilityModel.ts` with unit tests (the component currently computes this inline at lines ~356–387). The component then renders Step 4 (read-only reveal) and Step 5 (interactive levers) from that model. Savings rows gain a `protected` flag (retirement/emergency stay locked; investing/down-payment are redirectable). The down payment gets a $/% toggle driving the same underlying dollar amount. A snapshot taken on entry to Step 5 powers a "reset to my real budget" button.

**Tech Stack:** React + TypeScript, Vite, Tailwind, Vitest (already configured: `npm test`). Pure logic is unit-tested; UI is verified via production build + mobile screenshots at 390px (the established workflow in this repo — the dev-server HMR is unreliable for layout checks).

**Default decisions locked here (change before building if desired):**
- Maintenance reserve: **1.0%/yr of home price**, adjustable in UI.
- Closing costs estimate: **3.0% of home price**, adjustable.
- A savings row defaults to **protected** if its label matches `/retire|401|ira|roth|emergency|pension/i`, otherwise **flexible**. The `monthlySavings` (Downpayment) row is always flexible and auto-freed at purchase. Every row has a manual protected/flexible toggle.
- Comfort gauge: **green** if target ≤ conservative capacity, **yellow** if between conservative and stretch, **red** if above stretch.
- Rate sensitivity shown at **±1.0%**.

---

## File Structure

- **Create** `src/pages/preview/tools/budget-planner/affordabilityModel.ts` — pure functions: savings bucketing, comfortable-payment range, price back-solve, all-in monthly cost, lender-max (28/36), cash-to-close + reserves, rate sensitivity. One responsibility: turn budget + loan inputs into the numbers Steps 4/5 display. No React.
- **Create** `src/pages/preview/tools/budget-planner/affordabilityModel.test.ts` — Vitest unit tests for the module.
- **Modify** `src/pages/preview/tools/BudgetPlannerDetailed.tsx` — add `protected` to savings rows + per-row toggle; add `downMode` + `hoaMonthly` + `maintenancePct` + `closingPct` + `redirectPct` + `step5 snapshot` state; replace inline math (≈ lines 356–387) with calls into the model; rework Step 4 (reveal) and add Step 5 (tuning playground); extend the step indicator to 5; wire the Listings CTA.
- **Reference only** `src/pages/tools/budget-planner/calculations.ts` + `types.ts` (existing `calcAffordability`, `AffInputs`) — used for the down-payment timeline; do NOT change (shared with the live tool).
- **Reference** `src/pages/preview/listings/listingsConfig.ts` — for the price-filtered Listings deep link in the Step 5 CTA.

---

## Task 1: Pure affordability model — types + savings bucketing

**Files:**
- Create: `src/pages/preview/tools/budget-planner/affordabilityModel.ts`
- Test: `src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// affordabilityModel.test.ts
import { describe, it, expect } from "vitest";
import { bucketSavings, type SavingsLine } from "./affordabilityModel";

describe("bucketSavings", () => {
  const rows: SavingsLine[] = [
    { label: "Monthly Savings (Downpayment)", amount: 600, protectedFlag: false, isDownPayment: true },
    { label: "Roth IRA", amount: 500, protectedFlag: true, isDownPayment: false },
    { label: "Brokerage investing", amount: 400, protectedFlag: false, isDownPayment: false },
  ];
  it("splits protected vs flexible and exposes down-payment savings", () => {
    const b = bucketSavings(rows);
    expect(b.protectedTotal).toBe(500);          // Roth
    expect(b.flexibleTotal).toBe(1000);          // DP 600 + brokerage 400
    expect(b.downPaymentSavings).toBe(600);      // freed at purchase
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: FAIL — "bucketSavings is not exported".

- [ ] **Step 3: Write minimal implementation**

```ts
// affordabilityModel.ts
export interface SavingsLine {
  label: string;
  amount: number;
  protectedFlag: boolean;
  isDownPayment: boolean;
}

export function isProtectedByDefault(label: string): boolean {
  return /retire|401|\bira\b|roth|emergency|pension/i.test(label);
}

export function bucketSavings(rows: SavingsLine[]) {
  let protectedTotal = 0, flexibleTotal = 0, downPaymentSavings = 0;
  for (const r of rows) {
    if (r.isDownPayment) downPaymentSavings += r.amount;
    if (r.protectedFlag) protectedTotal += r.amount;
    else flexibleTotal += r.amount;
  }
  return { protectedTotal, flexibleTotal, downPaymentSavings };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/preview/tools/budget-planner/affordabilityModel.ts src/pages/preview/tools/budget-planner/affordabilityModel.test.ts
git commit -m "feat(budget): pure savings bucketing for affordability model"
```

---

## Task 2: Comfortable-payment range (conservative → stretch) + lender max

**Files:**
- Modify: `src/pages/preview/tools/budget-planner/affordabilityModel.ts`
- Test: `src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`

Definitions (locks the math discussed with the user):
- `leftover = monthlyNet - fixedTotal - subsMonthly - gfTotal - protectedTotal - flexibleTotal` (true surplus after everything).
- `conservativePayment = clampTo2836( leftover + rentMortgage )` — today's budget, all savings kept.
- `stretchPayment = clampTo2836( leftover + rentMortgage + downPaymentSavings + flexibleTotal )` — redirect the freed DP savings + flexible investing.
- `tunedPayment(redirectPct) = clampTo2836( leftover + rentMortgage + downPaymentSavings + flexibleTotal * redirectPct )` where `redirectPct ∈ [0,1]`.
- `lenderMaxPayment = max(0, min(0.28*monthlyGross, 0.36*monthlyGross - debts))` (the 28/36 ceiling — what a lender approves).
- `clampTo2836(x) = min(x, lenderMaxPayment)` (never recommend above the lender guardrail).
- `comfortableVsApprovedGap = max(0, lenderMaxPayment - tunedPayment)`.

- [ ] **Step 1: Write the failing test**

```ts
import { paymentRange } from "./affordabilityModel";

describe("paymentRange", () => {
  const base = {
    monthlyNet: 6000, monthlyGross: 8000, debts: 300,
    fixedTotal: 2500, subsMonthly: 100, gfTotal: 600,
    protectedTotal: 500, flexibleTotal: 1000, downPaymentSavings: 600,
    rentMortgage: 1800,
  };
  it("conservative keeps savings; stretch redirects DP + flexible; both capped by 28/36", () => {
    const r = paymentRange(base);
    // leftover = 6000-2500-100-600-500-1000 = 1300
    // conservative = min(1300+1800, lenderMax). lenderMax = min(0.28*8000, 0.36*8000-300)=min(2240,2580)=2240
    expect(r.lenderMaxPayment).toBe(2240);
    expect(r.conservativePayment).toBe(2240);            // 3100 capped to 2240
    expect(r.stretchPayment).toBe(2240);                 // even higher, still capped
    expect(r.tuned(0)).toBe(2240);
  });
  it("uncapped when budget is below the lender ceiling", () => {
    const r = paymentRange({ ...base, monthlyGross: 12000 }); // lenderMax now high
    // leftover 1300; conservative = 1300+1800 = 3100
    expect(r.conservativePayment).toBe(3100);
    // stretch = 3100 + 600 + 1000 = 4700
    expect(r.stretchPayment).toBe(4700);
    // tuned at 50% flexible = 3100 + 600 + 500 = 4200
    expect(r.tuned(0.5)).toBe(4200);
    expect(r.comfortableVsApprovedGapAt(0)).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: FAIL — "paymentRange is not exported".

- [ ] **Step 3: Write minimal implementation**

```ts
export interface PaymentRangeInputs {
  monthlyNet: number; monthlyGross: number; debts: number;
  fixedTotal: number; subsMonthly: number; gfTotal: number;
  protectedTotal: number; flexibleTotal: number; downPaymentSavings: number;
  rentMortgage: number;
}

export function paymentRange(i: PaymentRangeInputs) {
  const lenderMaxPayment = Math.max(0, Math.min(0.28 * i.monthlyGross, 0.36 * i.monthlyGross - i.debts));
  const clamp = (x: number) => Math.max(0, Math.min(x, lenderMaxPayment));
  const leftover = i.monthlyNet - i.fixedTotal - i.subsMonthly - i.gfTotal - i.protectedTotal - i.flexibleTotal;
  const conservativePayment = clamp(leftover + i.rentMortgage);
  const stretchPayment = clamp(leftover + i.rentMortgage + i.downPaymentSavings + i.flexibleTotal);
  const tuned = (redirectPct: number) =>
    clamp(leftover + i.rentMortgage + i.downPaymentSavings + i.flexibleTotal * Math.max(0, Math.min(1, redirectPct)));
  const comfortableVsApprovedGapAt = (redirectPct: number) => Math.max(0, lenderMaxPayment - tuned(redirectPct));
  return { lenderMaxPayment, leftover, conservativePayment, stretchPayment, tuned, comfortableVsApprovedGapAt };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(budget): conservative/stretch comfortable-payment range with 28/36 cap"
```

---

## Task 3: Price back-solve + all-in monthly cost of ownership

**Files:** Modify model + test.

The current inline back-solve (BudgetPlannerDetailed.tsx ~369–387) solves price from a target P&I+tax+ins+PMI. Extend it so the target payment is the **all-in** budget: it must also cover **HOA** and a **maintenance reserve** (`maintenancePct`/yr of price). That is the honesty fix — the comfortable payment now reserves for what renters never paid.

- [ ] **Step 1: Write the failing test**

```ts
import { piPerDollar, solveAllInPrice } from "./affordabilityModel";

describe("solveAllInPrice", () => {
  it("backs into a price whose all-in monthly (PITI+PMI+HOA+maint) ≈ target", () => {
    const r = solveAllInPrice({
      targetPayment: 2400, downAmount: 50000, rate: 6.5, term: 30,
      taxRatePct: 1.8, homeInsAnnual: 1800, pmiRatePct: 0.5,
      hoaMonthly: 0, maintenancePctPerYear: 1.0,
    });
    expect(r.price).toBeGreaterThan(50000);
    expect(Math.abs(r.allInPayment - 2400)).toBeLessThan(15); // converges within ~$15
    expect(r.maintenanceMonthly).toBeCloseTo((r.price * 0.01) / 12, 0);
    expect(r.downPctResolved).toBeCloseTo((50000 / r.price) * 100, 0);
    expect(r.pmiApplies).toBe(r.downPctResolved < 20);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: FAIL — "solveAllInPrice is not exported".

- [ ] **Step 3: Write minimal implementation**

```ts
export function piPerDollar(annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return n > 0 ? 1 / n : 0;
  return (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export interface AllInInputs {
  targetPayment: number; downAmount: number; rate: number; term: number;
  taxRatePct: number; homeInsAnnual: number; pmiRatePct: number;
  hoaMonthly: number; maintenancePctPerYear: number;
}

export function solveAllInPrice(i: AllInInputs) {
  const factor = piPerDollar(i.rate, i.term);
  let price = i.downAmount;
  for (let k = 0; k < 24; k++) {
    const mTax = (price * (i.taxRatePct / 100)) / 12;
    const mIns = i.homeInsAnnual / 12;
    const mMaint = (price * (i.maintenancePctPerYear / 100)) / 12;
    const loanG = Math.max(0, price - i.downAmount);
    const dpP = price > 0 ? (i.downAmount / price) * 100 : 100;
    const mPMI = dpP < 20 ? (loanG * (i.pmiRatePct / 100)) / 12 : 0;
    const piBudget = Math.max(0, i.targetPayment - mTax - mIns - mMaint - mPMI - i.hoaMonthly);
    const loan = factor > 0 ? piBudget / factor : 0;
    const next = loan + i.downAmount;
    if (Math.abs(next - price) < 1) { price = next; break; }
    price = next;
  }
  const loan = Math.max(0, price - i.downAmount);
  const pi = loan * factor;
  const taxMonthly = (price * (i.taxRatePct / 100)) / 12;
  const insMonthly = i.homeInsAnnual / 12;
  const maintenanceMonthly = (price * (i.maintenancePctPerYear / 100)) / 12;
  const downPctResolved = price > 0 ? (i.downAmount / price) * 100 : 0;
  const pmiApplies = downPctResolved < 20;
  const pmiMonthly = pmiApplies ? (loan * (i.pmiRatePct / 100)) / 12 : 0;
  const allInPayment = pi + taxMonthly + insMonthly + maintenanceMonthly + pmiMonthly + i.hoaMonthly;
  return { price, loan, pi, taxMonthly, insMonthly, maintenanceMonthly, pmiMonthly, hoaMonthly: i.hoaMonthly, allInPayment, downPctResolved, pmiApplies };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(budget): all-in price back-solve incl. HOA + maintenance reserve"
```

---

## Task 4: Cash-to-close + reserves, and rate sensitivity

**Files:** Modify model + test.

- `cashToClose = downAmount + price * closingPct/100`
- `reservesAfter = capitalAvailable - cashToClose` (capitalAvailable = the dollars they have to deploy)
- `reserveMonths = reservesAfter / allInPayment`
- Rate sensitivity: price at `rate ± 1.0` for the same target payment.

- [ ] **Step 1: Write the failing test**

```ts
import { cashPicture, rateSensitivity } from "./affordabilityModel";

describe("cashPicture + rateSensitivity", () => {
  it("computes closing, reserves, and months of reserve", () => {
    const c = cashPicture({ price: 350000, downAmount: 50000, closingPct: 3, capitalAvailable: 65000, allInPayment: 2400 });
    expect(c.cashToClose).toBeCloseTo(50000 + 10500, 0);
    expect(c.reservesAfter).toBeCloseTo(65000 - 60500, 0);   // 4500
    expect(c.reserveMonths).toBeCloseTo(4500 / 2400, 1);
  });
  it("shows price drops when rate rises", () => {
    const s = rateSensitivity({
      targetPayment: 2400, downAmount: 50000, rate: 6.5, term: 30,
      taxRatePct: 1.8, homeInsAnnual: 1800, pmiRatePct: 0.5, hoaMonthly: 0, maintenancePctPerYear: 1.0,
    }, 1.0);
    expect(s.up.price).toBeLessThan(s.base.price);
    expect(s.down.price).toBeGreaterThan(s.base.price);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
export function cashPicture(i: { price: number; downAmount: number; closingPct: number; capitalAvailable: number; allInPayment: number; }) {
  const closingCosts = i.price * (i.closingPct / 100);
  const cashToClose = i.downAmount + closingCosts;
  const reservesAfter = i.capitalAvailable - cashToClose;
  const reserveMonths = i.allInPayment > 0 ? reservesAfter / i.allInPayment : 0;
  return { closingCosts, cashToClose, reservesAfter, reserveMonths };
}

export function rateSensitivity(base: AllInInputs, deltaPct: number) {
  const at = (rate: number) => solveAllInPrice({ ...base, rate });
  return { base: at(base.rate), up: at(base.rate + deltaPct), down: at(base.rate - deltaPct) };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/preview/tools/budget-planner/affordabilityModel.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(budget): cash-to-close/reserves + rate-sensitivity helpers"
```

---

## Task 5: Wire the model into the component state (no UI change yet)

**Files:** Modify `BudgetPlannerDetailed.tsx`.

- [ ] **Step 1: Extend savings rows with a protected flag + add new state.** Near the existing `useState` block (~lines 267–282):

```tsx
// savings rows already FixedRow[]; track protected separately by row id to avoid changing FixedRow shape
const [protectedIds, setProtectedIds] = useState<Set<string>>(new Set()); // empty = use label heuristic
const [downMode, setDownMode] = useState<"percent" | "dollar">("percent");
const [hoaMonthly, setHoaMonthly] = useState(0);
const [maintenancePct, setMaintenancePct] = useState(1.0);
const [closingPct, setClosingPct] = useState(3.0);
const [capitalAvailable, setCapitalAvailable] = useState(0); // dollars they can deploy
const [redirectPct, setRedirectPct] = useState(0);           // 0..1 flexible redirect in Step 5
const snapshotRef = useRef<{ guiltFree: FixedRow[]; savingsRows: FixedRow[] } | null>(null);
```

- [ ] **Step 2: Build `SavingsLine[]` and call the model.** Replace the inline math (≈ lines 356–387) with:

```tsx
import { bucketSavings, isProtectedByDefault, paymentRange, solveAllInPrice, cashPicture, rateSensitivity, type SavingsLine } from "./budget-planner/affordabilityModel";

const savingsLines: SavingsLine[] = savingsRows.map((r) => ({
  label: r.label, amount: r.amount, isDownPayment: r.id === "monthlySavings",
  protectedFlag: protectedIds.size ? protectedIds.has(r.id) : isProtectedByDefault(r.label),
}));
const buckets = bucketSavings(savingsLines);
const range = paymentRange({
  monthlyNet, monthlyGross, debts, fixedTotal, subsMonthly, gfTotal,
  protectedTotal: buckets.protectedTotal, flexibleTotal: buckets.flexibleTotal,
  downPaymentSavings: buckets.downPaymentSavings, rentMortgage,
});
// down: $/% unified — `down` ($) is the source of truth; dpPct mirrors it once we know price
const targetPayment = comfortPayment > 0 ? comfortPayment : Math.round(range.tuned(redirectPct));
const allIn = solveAllInPrice({
  targetPayment, downAmount: down, rate, term, taxRatePct: taxRate,
  homeInsAnnual: homeIns, pmiRatePct: loanType === "fha" ? 0.55 : pmiRate,
  hoaMonthly, maintenancePctPerYear: maintenancePct,
});
const cash = cashPicture({ price: allIn.price, downAmount: down, closingPct, capitalAvailable: capitalAvailable || down, allInPayment: allIn.allInPayment });
const sens = rateSensitivity({ targetPayment, downAmount: down, rate, term, taxRatePct: taxRate, homeInsAnnual: homeIns, pmiRatePct: loanType === "fha" ? 0.55 : pmiRate, hoaMonthly, maintenancePctPerYear: maintenancePct }, 1.0);
```

Keep names already referenced downstream alive by aliasing: `const price = allIn.price; const payment = allIn.allInPayment; const rangeHigh = Math.round(range.lenderMaxPayment); const recommended = range.conservativePayment;`

- [ ] **Step 3: Verify it still builds.**

Run: `npm run build 2>&1 | grep -iE "error|built in"`
Expected: `✓ built` with no TS errors. (Pure refactor — UI unchanged.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor(budget): drive in-depth affordability from pure model"
```

---

## Task 6: $/% down-payment toggle (Step 3 inputs)

**Files:** Modify `BudgetPlannerDetailed.tsx` (down-payment input area, ~lines 800–810).

- [ ] **Step 1: Replace the single % field with a $/% toggle.** When mode is `dollar`, edit `down` directly; when `percent`, edit `dpPct` and derive `down = price * dpPct/100` (using the model price). Show the derived counterpart + a PMI flag under it.

```tsx
<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
  <label className={labelCls}>Down payment</label>
  <Toggle value={downMode} onChange={setDownMode} options={[["percent","%"],["dollar","$"]]} />
</div>
{downMode === "percent" ? (
  <input type="number" min={0} max={99} step={0.5} value={dpPct}
    onChange={(e) => { const p = Math.min(+e.target.value, 99); setDpPct(p); setDown(Math.round(allIn.price * p / 100)); }}
    className={fieldCls} />
) : (
  <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
    <MoneyInput value={down} onChange={(v) => { setDown(v); setCapitalAvailable((c) => Math.max(c, v)); }} className={`${fieldCls} pl-7`} /></div>
)}
<p className="mt-1 text-xs text-muted-foreground">
  {downMode === "dollar"
    ? `${allIn.downPctResolved.toFixed(0)}% down on a ${usd(allIn.price)} home${allIn.pmiApplies ? " — under 20%, so you'd carry PMI" : ""}`
    : `≈ ${usd(down)} at this price${allIn.pmiApplies ? " — under 20%, PMI applies" : ""}`}
</p>
```

- [ ] **Step 2: Verify build + screenshot Step 3 at 390px.**

Run: `npm run build` then capture `/tools/budget-planner/in-depth` (navigate to step 3) at 390px; confirm toggle wraps cleanly and the derived line reads correctly.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(budget): $/% down-payment toggle with derived value + PMI flag"
```

---

## Task 7: Step 4 reveal — comfortable number, all-in cost, comfortable-vs-approved gap, rate sensitivity, reserves

**Files:** Modify `BudgetPlannerDetailed.tsx` Step 4 block (currently `{step === 3 && ...}`, ~lines 852–911).

- [ ] **Step 1: Restructure Step 4 as the read-only "reveal."** Keep: recommended range card, the comfortable-payment input (now defaulting to `range.tuned(redirectPct)`), the "that supports about {usd(price)}" home-price card. ADD beneath it:
  - **All-in cost breakdown** (P&I, tax, insurance, **maintenance reserve**, PMI, **HOA**) summing to `payment`, with a one-line note: "This includes a maintenance reserve and the costs renters never pay."
  - **Comfortable-vs-approved line:** `A lender will likely approve ~{usd(range.lenderMaxPayment)}/mo. Your comfortable number is {usd(targetPayment)}/mo. That {usd(range.comfortableVsApprovedGapAt(redirectPct))}/mo gap is yours.`
  - **Rate sensitivity:** `At {rate}% you're near {usd(sens.base.price)}. If rates rise 1%, the same payment buys ~{usd(sens.up.price)}; down 1%, ~{usd(sens.down.price)}.`
  - **Reserves check** (only when `capitalAvailable > 0`): `{usd(cash.cashToClose)} to close → ~{usd(cash.reservesAfter)} left ({cash.reserveMonths.toFixed(1)} months of payments). Most lenders want 2–6 months.` Red text if `reserveMonths < 2`.
  - A **comfort gauge** chip: green/yellow/red per the locked thresholds vs `range.conservativePayment` / `range.stretchPayment`.
- [ ] **Step 2: Add a "Tune these numbers →" button** that calls `goStep(4)` (the new Step 5).
- [ ] **Step 3: Verify build + screenshot Step 4 at 390px and 1440px.** Confirm no overflow (use `min-w-0` patterns from prior mobile fixes), readable contrast, breakdown sums to the headline payment.
- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(budget): Step 4 reveal — all-in cost, comfortable-vs-approved, rate sensitivity, reserves"
```

---

## Task 8: New Step 5 — tuning playground (levers, reconciliation, lifestyle nudge, snapshot+reset, gauge)

**Files:** Modify `BudgetPlannerDetailed.tsx` — extend step machinery to 5 steps and add the `{step === 4 && ...}` block; update the step indicator array and the sticky summary's `{step === 3}`/add `{step === 4}` branch.

- [ ] **Step 1: Extend the step count.** Find the step indicator (`[0,1,2,3].map(...)` style) and bump to 5 entries with labels: `["Income","Spending","Loan & affordability","Your number","Tune & stress-test"]`. Ensure `goStep`/Next/Back clamp to `4`.
- [ ] **Step 2: Snapshot on entry.** In the Step 5 render (or a `useEffect` keyed on entering step 4), if `snapshotRef.current` is null, set `snapshotRef.current = { guiltFree: structuredClone(guiltFree), savingsRows: structuredClone(savingsRows) }`.
- [ ] **Step 3: Build the playground UI.** A compact panel with:
  - **Guilt-free lever:** a slider/steppers bound to a scaling of `guiltFree` totals (or inline +/- on each guilt-free row) → live updates `gfTotal` → payment moves. Show `{usd(gfTotal)}/mo lifestyle`.
  - **Investing redirect lever:** a single slider `redirectPct` 0–100% → "Put {Math.round(redirectPct*100)}% of your {usd(buckets.flexibleTotal)}/mo flexible investing toward the home." Protected savings shown locked with a 🔒 and a note "retirement & emergency stay protected."
  - **Per-row protected/flexible toggle** in the savings list (sets `protectedIds`), so users can reclassify.
  - **Live payoff line:** "Comfortable payment {usd(targetPayment)}/mo → ~{usd(price)} home" updating as levers move.
  - **Reconciliation feedback:** if `comfortPayment > range.tuned(redirectPct)` (they typed a number above budget), show `That's {usd(comfortPayment - range.tuned(redirectPct))}/mo above your plan — pull it from flexible spending or investing above.` Never auto-edit protected.
  - **Comfort gauge** (reuse Task 7 chip).
- [ ] **Step 4: Lifestyle nudge.** A callout: "Is your guilt-free spending realistic for life after you move? Add the trips, dining, and hobbies you want to keep →" with a button `goStep(1)` (Spending step).
- [ ] **Step 5: Reset button.** "Reset to my actual budget" → restore `snapshotRef.current` into `guiltFree`/`savingsRows`, set `redirectPct=0`, `comfortPayment=0`. Distinct, clearly-labeled from the existing "Reset to recommended" (which resets only the payment).
- [ ] **Step 6: Verify build + screenshots at 390px and 1440px**; confirm levers update the payment/price live, reset restores, no overflow.
- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(budget): Step 5 tuning playground — levers, reconciliation, lifestyle nudge, reset"
```

---

## Task 9: Close the loop — Listings CTA + email/PDF

**Files:** Modify `BudgetPlannerDetailed.tsx` (end of Step 5 + the existing takeaway/`downloadBudget`).

- [ ] **Step 1: Listings CTA.** Build a price-filtered Listings link and render "See active homes near {usd(price)} →". Use `listingsConfig` if it exposes a price param; otherwise link to `/listings` with a query the Listings page can read (add `?max=<price>` handling in a follow-up if not present — for now link to `/listings`). Add the soft line: "A lender confirms your approved number; I help you find the home — let's talk." linking to `/contact`.
- [ ] **Step 2: Ensure the PDF/takeaway includes the new numbers** (all-in payment, home price, cash-to-close, reserves). Extend the `downloadBudget` rows array.
- [ ] **Step 3: Verify build + screenshot.**
- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(budget): Step 5 CTA to Listings + contact, richer takeaway/PDF"
```

---

## Task 10: Full verification + deploy

- [ ] **Step 1: Unit tests green.** Run: `npm test` — all `affordabilityModel.test.ts` pass.
- [ ] **Step 2: Production build + mobile overflow check.** Build, `vite preview`, measure `/tools/budget-planner/in-depth` `scrollWidth` at 390px across all 5 steps — expect 390 (no overflow). Screenshot Steps 4 & 5 at 390px and 1440px for visual sign-off.
- [ ] **Step 3: Deploy.** Commit, fast-forward `main`, push (Vercel auto-deploys). Confirm the deploy reaches READY and spot-check the live tool.

---

## Self-Review

**Spec coverage:** $/% down toggle → Task 6. Playground levers (guilt-free + investing) → Task 8. Reconciliation feedback → Task 8. Lifestyle nudge → Task 8. Reset/snapshot → Tasks 5+8. 5th step / separation → Task 8. All-in cost of ownership → Tasks 3+7. Comfortable-vs-approved → Tasks 2+7. Rate sensitivity → Tasks 4+7. Reserves check → Tasks 4+7. Listings CTA → Task 9. Comfort gauge → Tasks 7+8. Protected vs flexible savings → Tasks 1,5,8. DP-savings conversion → Tasks 1,2. All covered.

**Placeholder scan:** Pure-logic tasks (1–4) contain complete code + tests. UI tasks (6–9) specify exact insertion points, the data they read from the model, and code for the non-obvious bits (toggle, model wiring, reconciliation condition); remaining JSX follows the file's established card/label/`fieldCls` patterns. Acceptable for a frontend feature verified by build + screenshots (the repo has no component-test harness).

**Type consistency:** Model exports used consistently — `bucketSavings`→`{protectedTotal,flexibleTotal,downPaymentSavings}`, `paymentRange`→`{lenderMaxPayment,conservativePayment,stretchPayment,tuned(),comfortableVsApprovedGapAt()}`, `solveAllInPrice`→`{price,allInPayment,downPctResolved,pmiApplies,...}`, `cashPicture`→`{cashToClose,reservesAfter,reserveMonths}`, `rateSensitivity`→`{base,up,down}`. Component aliases (`price`,`payment`,`rangeHigh`,`recommended`) preserve names existing JSX already references.

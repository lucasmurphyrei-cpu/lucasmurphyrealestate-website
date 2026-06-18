import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Download, Handshake, Info, Plus, Wallet, X } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import MoneyInput from "@/pages/preview/_shared/MoneyInput";
import Seo from "@/components/seo/Seo";
import { bucketSavings, isProtectedByDefault, paymentRange, solveAllInPrice, cashPicture, rateSensitivity, type SavingsLine } from "./budget-planner/affordabilityModel";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground";
const rowInputCls =
  "h-10 w-full min-w-0 rounded-sm border border-border bg-white text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const cardCls = "rounded-sm border border-border bg-card p-6 shadow-[0_18px_44px_-32px_hsl(216_52%_11%/0.4)] sm:p-8";

const STEPS = ["Fixed expenses", "Spending & savings", "Affordability", "Your number", "Tune & stress-test"];

type Freq = "weekly" | "biweekly" | "semimonthly" | "monthly";
type Filing = "single" | "married";
type Mode = "annual" | "paycheck-gross" | "paycheck-net";
const PAYCHECKS: Record<Freq, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
const FREQ_LABELS: Record<Freq, string> = { weekly: "Weekly", biweekly: "Bi-Weekly", semimonthly: "Semi-Monthly", monthly: "Monthly" };
const SINGLE_BRACKETS = [
  [0, 11600, 0.1], [11600, 47150, 0.12], [47150, 100525, 0.22], [100525, 191950, 0.24],
  [191950, 243725, 0.32], [243725, 609350, 0.35], [609350, Infinity, 0.37],
];
const MARRIED_BRACKETS = [
  [0, 23200, 0.1], [23200, 94300, 0.12], [94300, 201050, 0.22], [201050, 383900, 0.24],
  [383900, 487450, 0.32], [487450, 731200, 0.35], [731200, Infinity, 0.37],
];
const STD_DED: Record<Filing, number> = { single: 14600, married: 29200 };
const TAX_OPTS: { label: string; value: number | null }[] = [
  { label: "Auto-estimate", value: null }, { label: "10%", value: 10 }, { label: "12%", value: 12 },
  { label: "22%", value: 22 }, { label: "24%", value: 24 }, { label: "32%", value: 32 },
  { label: "35%", value: 35 }, { label: "37%", value: 37 },
];

function fedTax(gross: number, status: Filing) {
  const brackets = status === "single" ? SINGLE_BRACKETS : MARRIED_BRACKETS;
  const taxable = Math.max(0, gross - STD_DED[status]);
  let tax = 0;
  for (const [min, max, rate] of brackets) {
    if (taxable <= min) break;
    tax += (Math.min(taxable, max) - min) * rate;
  }
  return tax + gross * 0.0765; // + FICA
}
function effRate(gross: number, status: Filing) {
  return gross <= 0 ? 0 : (fedTax(gross, status) / gross) * 100;
}
function grossFromNet(net: number, status: Filing) {
  if (net <= 0) return 0;
  let gross = net / 0.75;
  for (let i = 0; i < 20; i++) {
    const diff = net - (gross - fedTax(gross, status));
    if (Math.abs(diff) < 1) break;
    gross += diff;
  }
  return Math.max(0, gross);
}
function piPerDollar(annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return 1 / n;
  return (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ── Affordability engine (ported from the live budget planner) ──
type AffInputs = {
  annualGrossIncome: number; annualNetIncome: number; monthlyDebtPayments: number;
  downPaymentPercent: number; interestRate: number; loanTerm: number;
  propertyTaxRate: number; homeInsuranceAnnual: number; pmiRate: number;
};
type Philosophy = {
  label: string; description: string; maxHomePrice: number; maxLoanAmount: number;
  downPaymentAmount: number; downPaymentPercent: number; monthlyPI: number; monthlyTaxes: number;
  monthlyInsurance: number; monthlyPMI: number; totalMonthlyHousing: number; totalInterestPaid: number;
  totalCostOverLife: number; frontEndDTI: number; backEndDTI: number;
};

function solveMaxHomePrice(maxBudget: number, inp: AffInputs, termOverride?: number, piOnly = false) {
  const term = termOverride ?? inp.loanTerm;
  const monthlyInsurance = inp.homeInsuranceAnnual / 12;
  const dpFraction = Math.min(inp.downPaymentPercent, 99) / 100;
  const loanFraction = 1 - dpFraction;
  const empty = { homePrice: 0, loanAmount: 0, monthlyPI: 0, monthlyTaxes: 0, monthlyInsurance: 0, monthlyPMI: 0, downPaymentAmount: 0 };
  if (maxBudget <= 0 || loanFraction <= 0) return empty;
  const f = piPerDollar(inp.interestRate, term);

  const finalize = (homePrice: number) => {
    homePrice = Math.max(0, homePrice);
    const loanAmount = homePrice * loanFraction;
    return {
      homePrice, loanAmount, downPaymentAmount: homePrice * dpFraction,
      monthlyPI: loanAmount * f, monthlyTaxes: (homePrice * inp.propertyTaxRate / 100) / 12,
      monthlyInsurance, monthlyPMI: dpFraction < 0.2 ? (loanAmount * inp.pmiRate / 100) / 12 : 0,
    };
  };

  if (piOnly) return finalize((f > 0 ? maxBudget / f : 0) / loanFraction);

  let homePrice = 300000;
  for (let i = 0; i < 14; i++) {
    const monthlyTaxes = (homePrice * inp.propertyTaxRate / 100) / 12;
    const loanAmount = homePrice * loanFraction;
    const monthlyPMI = dpFraction < 0.2 ? (loanAmount * inp.pmiRate / 100) / 12 : 0;
    const availPI = maxBudget - monthlyTaxes - monthlyInsurance - monthlyPMI;
    if (availPI <= 0) return empty;
    const newPrice = (f > 0 ? availPI / f : 0) / loanFraction;
    if (Math.abs(newPrice - homePrice) < 1) { homePrice = newPrice; break; }
    homePrice = newPrice;
  }
  return finalize(homePrice);
}

function buildPhilosophy(label: string, description: string, maxBudget: number, inp: AffInputs, monthlyGross: number, termOverride?: number, piOnly = false): Philosophy {
  const term = termOverride ?? inp.loanTerm;
  const r = solveMaxHomePrice(maxBudget, inp, term, piOnly);
  const totalMonthlyHousing = r.monthlyPI + r.monthlyTaxes + r.monthlyInsurance + r.monthlyPMI;
  const totalPayments = r.monthlyPI * term * 12;
  return {
    label, description, maxHomePrice: r.homePrice, maxLoanAmount: r.loanAmount,
    downPaymentAmount: r.downPaymentAmount, downPaymentPercent: inp.downPaymentPercent,
    monthlyPI: r.monthlyPI, monthlyTaxes: r.monthlyTaxes, monthlyInsurance: r.monthlyInsurance, monthlyPMI: r.monthlyPMI,
    totalMonthlyHousing, totalInterestPaid: Math.max(0, totalPayments - r.loanAmount),
    totalCostOverLife: totalPayments + (r.monthlyTaxes + r.monthlyInsurance + r.monthlyPMI) * term * 12 + r.downPaymentAmount,
    frontEndDTI: monthlyGross > 0 ? (totalMonthlyHousing / monthlyGross) * 100 : 0,
    backEndDTI: monthlyGross > 0 ? ((totalMonthlyHousing + inp.monthlyDebtPayments) / monthlyGross) * 100 : 0,
  };
}

function calcAffordability(inp: AffInputs) {
  const monthlyGross = inp.annualGrossIncome / 12;
  const monthlyNet = inp.annualNetIncome / 12;
  const debt = inp.monthlyDebtPayments;
  return {
    monthlyGross, monthlyNet,
    philosophies: {
      ramsey: buildPhilosophy("Dave Ramsey", "25% of take-home pay, 15-year fixed mortgage only", monthlyNet * 0.25, inp, monthlyGross, 15, true),
      conventional: buildPhilosophy("28/36 Rule", "28% of gross income on housing, 36% max total debt", Math.min(monthlyGross * 0.28, monthlyGross * 0.36 - debt), inp, monthlyGross),
      fha: buildPhilosophy("FHA Guidelines", "31% of gross income on housing, 43% max total debt", Math.min(monthlyGross * 0.31, monthlyGross * 0.43 - debt), inp, monthlyGross),
      aggressive: buildPhilosophy("Aggressive / Stretch", "35% of gross income on housing, 50% max total debt", Math.min(monthlyGross * 0.35, monthlyGross * 0.50 - debt), inp, monthlyGross),
    },
  };
}

type FixedRow = { id: string; label: string; amount: number; hint?: string };
const DEFAULT_FIXED: FixedRow[] = [
  { id: "rent", label: "Rent / Mortgage", amount: 0, hint: "1,500" },
  { id: "loanPayments", label: "Debt Payments", amount: 0, hint: "350" },
  { id: "insurance", label: "Insurance", amount: 0, hint: "200" },
  { id: "groceries", label: "Groceries", amount: 0, hint: "600" },
  { id: "internet", label: "Internet", amount: 0, hint: "70" },
  { id: "electricity", label: "Electricity", amount: 0, hint: "120" },
  { id: "gas", label: "Gas", amount: 0, hint: "80" },
  { id: "subscriptions", label: "Subscriptions", amount: 0, hint: "60" },
  { id: "pets", label: "Pets", amount: 0, hint: "0" },
];
type Sub = { id: string; name: string; cost: number; hint?: string };

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-white text-muted-foreground hover:text-foreground"}`}>{children}</button>
  );
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-sm p-3 text-center ${accent ? "border border-accent/20 bg-accent/[0.06]" : "bg-secondary/50"}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
function SRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/65">{label}</span>
      <span className="tabular-nums text-white/90">{value}</span>
    </div>
  );
}
function Line({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{l}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
function PhilosophyCard({ p, tag, recommended }: { p: Philosophy; tag: string; recommended?: boolean }) {
  const has = p.maxHomePrice > 0;
  return (
    <div className={`rounded-sm border bg-card p-6 shadow-[0_18px_44px_-32px_hsl(216_52%_11%/0.4)] ${recommended ? "border-accent/50 ring-1 ring-accent/30" : "border-border"}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">{p.label}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${recommended ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}>{tag}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
      <div className="mt-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Max home price</p>
        <p className={`mt-1 font-display text-3xl font-semibold ${has ? (recommended ? "text-accent" : "text-foreground") : "text-muted-foreground"}`}>{has ? usd(p.maxHomePrice) : "$0"}</p>
      </div>
      {has && (
        <>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-muted-foreground">Down payment ({p.downPaymentPercent.toFixed(1)}%)</span>
            <span className="font-semibold">{usd(p.downPaymentAmount)}</span>
          </div>
          <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs">
            <Line l="Principal & interest" v={usd(p.monthlyPI)} />
            <Line l="Property taxes" v={usd(p.monthlyTaxes)} />
            <Line l="Home insurance" v={usd(p.monthlyInsurance)} />
            {p.monthlyPMI > 0 && <Line l="PMI" v={usd(p.monthlyPMI)} />}
            <div className="flex justify-between border-t border-border pt-1.5 text-sm font-semibold"><span>Total monthly</span><span>{usd(p.totalMonthlyHousing)}</span></div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-sm bg-secondary/50 p-2 text-center"><p className="text-[9px] uppercase tracking-wider text-muted-foreground">Front-end DTI</p><p className="text-xs font-semibold">{p.frontEndDTI.toFixed(0)}%</p></div>
            <div className="rounded-sm bg-secondary/50 p-2 text-center"><p className="text-[9px] uppercase tracking-wider text-muted-foreground">Back-end DTI</p><p className="text-xs font-semibold">{p.backEndDTI.toFixed(0)}%</p></div>
          </div>
          <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
            <Line l="Loan amount" v={usd(p.maxLoanAmount)} />
            <Line l="Total interest paid" v={usd(p.totalInterestPaid)} />
            <Line l="Total cost over life" v={usd(p.totalCostOverLife)} />
          </div>
        </>
      )}
    </div>
  );
}

export default function BudgetPlannerDetailed() {
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const goStep = (n: number) => {
    if (n === 4 && !snapshotRef.current) {
      snapshotRef.current = { guiltFree: guiltFree.map((r) => ({ ...r })), savingsRows: savingsRows.map((r) => ({ ...r })) };
    }
    setStep(n);
    const el = sectionRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
  };
  const resetTuning = () => {
    if (snapshotRef.current) {
      setGuiltFree(snapshotRef.current.guiltFree.map((r) => ({ ...r })));
      setSavingsRows(snapshotRef.current.savingsRows.map((r) => ({ ...r })));
    }
    setRedirectPct(0);
    setComfortPayment(0);
    setProtectedIds(new Set());
  };

  // Income module
  const [mode, setMode] = useState<Mode>("annual");
  const [freq, setFreq] = useState<Freq>("biweekly");
  const [annualAmount, setAnnualAmount] = useState(0);
  const [grossPaycheck, setGrossPaycheck] = useState(0);
  const [netPaycheck, setNetPaycheck] = useState(0);
  const [showTax, setShowTax] = useState(false);
  const [filing, setFiling] = useState<Filing>("single");
  const [taxOverride, setTaxOverride] = useState<number | null>(null);

  const [fixedCosts, setFixedCosts] = useState<FixedRow[]>(DEFAULT_FIXED);
  const [subs, setSubs] = useState<Sub[]>([
    { id: "s-prime", name: "Amazon Prime", cost: 0, hint: "139" },
    { id: "s-reg", name: "Car registration", cost: 0, hint: "85" },
  ]);
  const [guiltFree, setGuiltFree] = useState<FixedRow[]>([
    { id: "restaurants", label: "Restaurants / Fast Food", amount: 0, hint: "300" },
    { id: "entertainment", label: "Entertainment", amount: 0, hint: "150" },
    { id: "shopping", label: "Shopping", amount: 0, hint: "200" },
    { id: "gifts", label: "Gifts", amount: 0, hint: "50" },
    { id: "travel", label: "Misc / Travel", amount: 0, hint: "100" },
  ]);
  const [savingsRows, setSavingsRows] = useState<FixedRow[]>([
    { id: "monthlySavings", label: "Monthly Savings (Downpayment)", amount: 0, hint: "600" },
    { id: "monthlyInvesting", label: "Monthly Investing", amount: 0, hint: "200" },
  ]);
  const [taxRate, setTaxRate] = useState(1.8);
  const [down, setDown] = useState(0);
  const [comfortPayment, setComfortPayment] = useState(0); // 0 = use recommended budget
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState<15 | 30>(30);
  // Step 3 affordability
  const [loanType, setLoanType] = useState<"conventional" | "fha">("conventional");
  const [dpPct, setDpPct] = useState(20);
  const [homeIns, setHomeIns] = useState(1800);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [showAdvAfford, setShowAdvAfford] = useState(false);
  const [timelinePhil, setTimelinePhil] = useState<"ramsey" | "conventional" | "fha" | "aggressive">("conventional");

  // Step 4/5 tuning state
  const [protectedIds, setProtectedIds] = useState<Set<string>>(new Set()); // empty = label heuristic
  const [downMode, setDownMode] = useState<"percent" | "dollar">("percent");
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [maintenancePct, setMaintenancePct] = useState(1.0);
  const [closingOn, setClosingOn] = useState(true);
  const [closingPct, setClosingPct] = useState(3.0);
  const [rateSensOn, setRateSensOn] = useState(true);
  const [capitalAvailable, setCapitalAvailable] = useState(0); // dollars they can deploy
  const [redirectPct, setRedirectPct] = useState(0); // 0..1 flexible-investing redirect (Step 5)
  const snapshotRef = useRef<{ guiltFree: FixedRow[]; savingsRows: FixedRow[] } | null>(null);

  // ── Income derived ──
  const filingStatus: Filing = showTax ? filing : "single";
  let annualGross: number, effectiveTaxRate: number, annualNet: number;
  if (mode === "paycheck-net") {
    annualNet = netPaycheck * PAYCHECKS[freq];
    annualGross = grossFromNet(annualNet, filingStatus);
    effectiveTaxRate = annualGross > 0 ? ((annualGross - annualNet) / annualGross) * 100 : 0;
  } else {
    annualGross = mode === "annual" ? annualAmount : grossPaycheck * PAYCHECKS[freq];
    effectiveTaxRate = showTax && taxOverride !== null ? taxOverride : effRate(annualGross, filingStatus);
    annualNet = annualGross * (1 - effectiveTaxRate / 100);
  }
  const monthlyGross = annualGross / 12;
  const monthlyNet = annualNet / 12;
  const paycheckNet = annualNet / PAYCHECKS[freq];
  const showPaycheckNet = mode !== "annual" && freq !== "monthly";
  const activeAmount = mode === "annual" ? annualAmount : mode === "paycheck-gross" ? grossPaycheck : netPaycheck;
  const setActiveAmount = (v: number) => {
    if (mode === "annual") setAnnualAmount(v);
    else if (mode === "paycheck-gross") setGrossPaycheck(v);
    else setNetPaycheck(v);
  };

  const updateRow = (id: string, field: "label" | "amount", value: string | number) =>
    setFixedCosts((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  const removeRow = (id: string) => setFixedCosts((p) => p.filter((r) => r.id !== id));
  const addRow = () => setFixedCosts((p) => [...p, { id: `c-${Date.now()}`, label: "", amount: 0 }]);
  const updateSub = (id: string, field: "name" | "cost", value: string | number) =>
    setSubs((p) => p.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const removeSub = (id: string) => setSubs((p) => p.filter((s) => s.id !== id));
  const addSub = () => setSubs((p) => [...p, { id: `s-${Date.now()}`, name: "", cost: 0 }]);

  // Tab moves down the same column to the next row's input (Shift+Tab moves up).
  const colTab = (col: string, i: number, count: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Tab") return;
    const t = e.shiftKey ? i - 1 : i + 1;
    if (t >= 0 && t < count) {
      e.preventDefault();
      document.getElementById(`${col}-${t}`)?.focus();
    }
  };
  const updateGf = (id: string, f: "label" | "amount", v: string | number) => setGuiltFree((p) => p.map((r) => (r.id === id ? { ...r, [f]: v } : r)));
  const removeGf = (id: string) => setGuiltFree((p) => p.filter((r) => r.id !== id));
  const addGf = () => setGuiltFree((p) => [...p, { id: `gf-${Date.now()}`, label: "", amount: 0 }]);
  const updateSav = (id: string, f: "label" | "amount", v: string | number) => setSavingsRows((p) => p.map((r) => (r.id === id ? { ...r, [f]: v } : r)));
  const removeSav = (id: string) => setSavingsRows((p) => p.filter((r) => r.id !== id));
  const addSav = () => setSavingsRows((p) => [...p, { id: `sv-${Date.now()}`, label: "", amount: 0 }]);
  const setDebt = (v: number) => updateRow("loanPayments", "amount", v); // step 2 debt carries over to/from step 1

  const fixedTotal = fixedCosts.reduce((a, r) => a + r.amount, 0);
  const rentMortgage = fixedCosts.find((r) => r.id === "rent")?.amount ?? 0;
  const debts = fixedCosts.find((r) => r.id === "loanPayments")?.amount ?? 0;
  const subsTotal = subs.reduce((a, s) => a + s.cost, 0);
  const subsMonthly = subsTotal / 12;
  const gfTotal = guiltFree.reduce((a, r) => a + r.amount, 0);
  const savingsTotal = savingsRows.reduce((a, r) => a + r.amount, 0);
  const pctOf = (n: number) => (monthlyNet > 0 ? Math.round((n / monthlyNet) * 100) : 0);

  const leftAfterFixed = monthlyNet - fixedTotal - subsMonthly;
  const availableForSavings = leftAfterFixed - gfTotal;
  const leftover = availableForSavings - savingsTotal;
  const savingsRate = monthlyNet > 0 ? (savingsTotal / monthlyNet) * 100 : 0;

  // Step 3 affordability (income synced from Step 1, debt from Step 1/2)
  const affInputs: AffInputs = { annualGrossIncome: annualGross, annualNetIncome: annualNet, monthlyDebtPayments: debts, downPaymentPercent: dpPct, interestRate: rate, loanTerm: term, propertyTaxRate: taxRate, homeInsuranceAnnual: homeIns, pmiRate: loanType === "fha" ? 0.55 : pmiRate };
  const aff = calcAffordability(affInputs);
  const phil = aff.philosophies;
  const monthlySavingsForHome = savingsRows.find((r) => r.id === "monthlySavings")?.amount ?? 0;
  const timeline = phil[timelinePhil];
  const dpNeeded = timeline.downPaymentAmount;
  const dpRemaining = Math.max(0, dpNeeded - down);
  const monthsToGoal = monthlySavingsForHome > 0 ? Math.ceil(dpRemaining / monthlySavingsForHome) : null;
  // ----- Step 4/5 affordability via the pure, tested model -----
  const savingsLines: SavingsLine[] = savingsRows.map((r) => ({
    label: r.label,
    amount: r.amount,
    isDownPayment: r.id === "monthlySavings",
    protectedFlag: protectedIds.size ? protectedIds.has(r.id) : isProtectedByDefault(r.label),
  }));
  const buckets = bucketSavings(savingsLines);
  const range = paymentRange({
    monthlyNet, monthlyGross, debts, fixedTotal, subsMonthly, gfTotal,
    protectedTotal: buckets.protectedTotal, flexibleTotal: buckets.flexibleTotal,
    downPaymentSavings: buckets.downPaymentSavings, rentMortgage,
  });
  const recommended = range.conservativePayment;
  const likelyLeftover = availableForSavings; // net - (fixed + subs) - guilt-free (pre-savings)
  const comfortTarget = comfortPayment > 0 ? comfortPayment : Math.round(range.tuned(redirectPct));
  const housingCapacity = Math.max(0, availableForSavings + rentMortgage); // money available for housing + savings (rent converts into the payment)
  const rangeHigh = Math.round(range.lenderMaxPayment); // 28/36 ceiling = what a lender approves
  const rangeLow = Math.round(Math.min(rangeHigh, monthlyGross * 0.25));
  const paymentDelta = rangeHigh - rentMortgage;
  const leftForSaving = Math.max(0, housingCapacity - rangeHigh); // left for saving/investing after the suggested payment
  const comfortableVsApprovedGap = Math.max(0, rangeHigh - comfortTarget); // lender ceiling minus your comfortable number
  const gauge: "green" | "yellow" | "red" =
    comfortTarget <= range.conservativePayment + 1 ? "green" : comfortTarget <= range.stretchPayment + 1 ? "yellow" : "red";

  // Loan inputs — maintenance/closing are rule-of-thumb toggles (0 when off)
  const pmiRateEff = loanType === "fha" ? 0.55 : pmiRate;
  const effMaintPct = maintenanceOn ? maintenancePct : 0;
  const effClosingPct = closingOn ? closingPct : 0;
  const allInInputs = {
    targetPayment: comfortTarget, downAmount: down, downMode, downPct: dpPct, rate, term,
    taxRatePct: taxRate, homeInsAnnual: homeIns, pmiRatePct: pmiRateEff,
    hoaMonthly, maintenancePctPerYear: effMaintPct,
  };
  const allIn = solveAllInPrice(allInInputs);
  const price = allIn.price;
  const payment = allIn.allInPayment;
  const loan = allIn.loan;
  const pi = allIn.pi;
  const tax = allIn.taxMonthly;
  const ins = allIn.insMonthly;
  const pmi = allIn.pmiMonthly;
  const mortDpPct = allIn.downPctResolved;
  const cash = cashPicture({ price, downAmount: down, closingPct: effClosingPct, capitalAvailable: capitalAvailable > 0 ? capitalAvailable : down, allInPayment: payment });
  const sens = rateSensitivity(allInInputs, 1.0);

  const downloadBudget = () => {
    const rows: [string, number | string][] = [
      ["My Budget — Lucas Murphy Real Estate", ""],
      ["Generated", new Date().toLocaleDateString()],
      ["", ""],
      ["Annual gross income", Math.round(annualGross)],
      ["Est. effective tax rate (%)", +effectiveTaxRate.toFixed(1)],
      ["Monthly net income", Math.round(monthlyNet)],
      ["Monthly fixed costs", ""],
      ...fixedCosts.map((r) => [`  ${r.label || "Expense"}`, r.amount] as [string, number]),
      ["Total fixed costs", fixedTotal],
      ["Yearly subscriptions (monthly equiv.)", Math.round(subsMonthly)],
      ["Guilt-free spending", ""],
      ...guiltFree.map((r) => [`  ${r.label || "Category"}`, r.amount] as [string, number]),
      ["Debt payments / mo", debts],
      ["Savings & investing", ""],
      ...savingsRows.map((r) => [`  ${r.label || "Savings"}`, r.amount] as [string, number]),
      ["Savings rate (%)", Math.round(savingsRate)],
      ["", ""],
      ["Recommended housing budget / mo", Math.round(recommended)],
      ["Estimated affordable home price", Math.round(price)],
      ["Estimated monthly payment", Math.round(payment)],
    ];
    const csv = rows.map(([a, b]) => `"${a}","${b}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-budget.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="How Much Home Can You Afford? In Depth | Metro Milwaukee | Lucas Murphy"
        description="A step-by-step affordability breakdown: fixed expenses, spending and savings, affordability, and the mortgage."
        canonicalPath="/tools/budget-planner/in-depth"
      />
      <PreviewHeader />

      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link to="/tools/budget-planner" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to all options
          </Link>
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Wallet className="h-4 w-4" /> In-depth affordability
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            Break down the numbers, step by step
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            Walk through your real budget to find a price range you can live with, not just one a lender will approve.
          </p>
        </div>
      </section>

      <section ref={sectionRef} className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-10 lg:pt-16">
        {/* Stepper — its own box; sticks below the nav */}
        <div className="sticky top-[80px] z-20 mb-6 rounded-sm border border-border bg-card/95 px-6 py-5 shadow-[0_18px_44px_-28px_hsl(216_52%_11%/0.45)] backdrop-blur-sm sm:px-10 sm:py-6">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                <button type="button" onClick={() => goStep(i)} className="flex items-center gap-3 text-left">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-accent text-accent-foreground ring-4 ring-accent/20" : "bg-secondary text-muted-foreground"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</span>
                  <span className={`hidden text-sm font-medium md:inline ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                </button>
                {i < STEPS.length - 1 && <span className={`mx-3 hidden h-px flex-1 transition-colors md:block ${i < step ? "bg-accent/50" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr,360px] lg:items-start">
          {/* Left — step content */}
          <div className="min-w-0 space-y-6">
            {step === 0 && (
              <>
                {/* Income */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Income</h2>
                  <p className="mt-2 text-xs text-muted-foreground">Enter your income using your annual salary or a typical paycheck.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill active={mode === "annual"} onClick={() => setMode("annual")}>Annual salary</Pill>
                    <Pill active={mode === "paycheck-gross"} onClick={() => setMode("paycheck-gross")}>Paycheck (gross)</Pill>
                    <Pill active={mode === "paycheck-net"} onClick={() => setMode("paycheck-net")}>Paycheck (net)</Pill>
                  </div>

                  {mode !== "annual" && (
                    <div className="mt-4">
                      <span className={labelCls}>How often are you paid?</span>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(PAYCHECKS) as Freq[]).map((f) => (
                          <Pill key={f} active={freq === f} onClick={() => setFreq(f)}>{FREQ_LABELS[f]}</Pill>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 max-w-xs">
                    <label className={labelCls}>
                      {mode === "annual" ? "Annual gross salary" : mode === "paycheck-gross" ? `Gross pay per ${FREQ_LABELS[freq]} paycheck` : `Take-home pay per ${FREQ_LABELS[freq]} paycheck`}
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <MoneyInput value={activeAmount} onChange={setActiveAmount} placeholder={mode === "annual" ? "110,000" : mode === "paycheck-gross" ? "4,231" : "3,200"} className={`${fieldCls} pl-7`} />
                    </div>
                  </div>

                  {mode !== "paycheck-net" && (
                    <div className="mt-3">
                      <button type="button" onClick={() => setShowTax((v) => !v)} className="text-xs font-semibold text-accent transition-colors hover:text-foreground">
                        {showTax ? "Hide" : "Show"} tax settings (optional)
                      </button>
                      {showTax && (
                        <div className="mt-3 space-y-3 rounded-sm border border-border p-4">
                          <p className="text-xs text-muted-foreground">For a more accurate take-home estimate, tell us your filing status. We use 2025 federal brackets plus FICA.</p>
                          <div>
                            <span className={labelCls}>Filing status</span>
                            <div className="flex gap-2">
                              <Pill active={filing === "single"} onClick={() => { setFiling("single"); setTaxOverride(null); }}>Single</Pill>
                              <Pill active={filing === "married"} onClick={() => { setFiling("married"); setTaxOverride(null); }}>Married filing jointly</Pill>
                            </div>
                          </div>
                          <div>
                            <span className={labelCls}>Tax rate</span>
                            <select value={taxOverride === null ? "auto" : String(taxOverride)} onChange={(e) => setTaxOverride(e.target.value === "auto" ? null : Number(e.target.value))} className={fieldCls}>
                              {TAX_OPTS.map((o) => (
                                <option key={o.label} value={o.value === null ? "auto" : o.value}>{o.value === null ? `Auto-estimate (~${effRate(annualGross, filingStatus).toFixed(1)}%)` : o.label}</option>
                              ))}
                            </select>
                            <p className="mt-1 text-[10px] text-muted-foreground">{taxOverride !== null ? "Using your manual override." : "Estimated effective rate includes federal income tax + 7.65% FICA. Excludes state tax."}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {mode === "paycheck-net" && <p className="mt-3 text-xs text-muted-foreground">Since you entered take-home pay, we estimate your gross income and tax rate automatically.</p>}

                  {annualGross > 0 && (
                    showPaycheckNet ? (
                      // 5 boxes: per-paycheck net differs from monthly net (weekly/bi-weekly/semi-monthly)
                      <div className="mt-5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Stat label="Annual gross" value={usd(annualGross)} />
                          <Stat label="Est. tax rate" value={`${effectiveTaxRate.toFixed(1)}%`} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Stat accent label={`${FREQ_LABELS[freq]} net`} value={usd(paycheckNet)} />
                          <Stat accent label="Monthly net" value={usd(monthlyNet)} />
                          <Stat accent label="Annual net" value={usd(annualNet)} />
                        </div>
                      </div>
                    ) : (
                      // 4 boxes, symmetric (annual or monthly paychecks)
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Stat label="Annual gross" value={usd(annualGross)} />
                        <Stat label="Est. tax rate" value={`${effectiveTaxRate.toFixed(1)}%`} />
                        <Stat accent label="Monthly net" value={usd(monthlyNet)} />
                        <Stat accent label="Annual net" value={usd(annualNet)} />
                      </div>
                    )
                  )}
                </div>

                {/* Monthly fixed costs */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Monthly fixed costs</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Enter your actual monthly costs. Rename labels to match your situation, and add or remove rows as needed. Percentages are based on your net monthly income.</p>
                  <p className="mt-2 text-xs font-medium text-accent">Your Debt Payments amount carries into your affordability in Step 3.</p>
                  <div className="mt-4 space-y-2">
                    {fixedCosts.map((row, i) => (
                      <div key={row.id} className={`flex items-center gap-2 ${row.id === "loanPayments" ? "relative z-20" : ""}`}>
                        {row.id === "loanPayments" ? (
                          <div className="relative w-24 shrink-0 sm:w-40">
                            <input id={`fc-label-${i}`} onKeyDown={colTab("fc-label", i, fixedCosts.length)} value={row.label} onChange={(e) => updateRow(row.id, "label", e.target.value)} placeholder="Expense name" className={`${rowInputCls} w-full px-3 pr-8 font-semibold !border-accent/60 !text-accent`} />
                            <span className="group absolute right-2 top-1/2 -translate-y-1/2">
                              <Info className="h-4 w-4 cursor-help text-accent" />
                              <span className="pointer-events-none absolute left-0 top-6 z-50 hidden w-72 rounded-sm border border-border bg-card p-3 text-left shadow-[0_18px_44px_-20px_hsl(216_52%_11%/0.55)] group-hover:block">
                                <span className="block text-[11px] font-semibold text-foreground">Include every monthly debt a lender counts toward your DTI:</span>
                                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">Auto loans &amp; leases, student loans, credit card minimum payments, personal &amp; installment loans, child support / alimony, co-signed loan payments, and any other recurring loan obligation.</span>
                                <span className="mt-1.5 block text-[11px] leading-relaxed text-muted-foreground">Leave out rent, utilities, insurance, and groceries, those are entered as their own rows.</span>
                              </span>
                            </span>
                          </div>
                        ) : (
                          <input id={`fc-label-${i}`} onKeyDown={colTab("fc-label", i, fixedCosts.length)} value={row.label} onChange={(e) => updateRow(row.id, "label", e.target.value)} placeholder="Expense name" className={`${rowInputCls} !w-24 shrink-0 px-3 sm:!w-40`} />
                        )}
                        <div className="relative flex-1 min-w-0">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                          <MoneyInput id={`fc-amount-${i}`} onKeyDown={colTab("fc-amount", i, fixedCosts.length)} value={row.amount} onChange={(v) => updateRow(row.id, "amount", v)} placeholder={row.hint} className={`${rowInputCls} pl-7 pr-3`} />
                        </div>
                        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{monthlyNet > 0 ? `${pctOf(row.amount)}%` : "—"}</span>
                        <button type="button" onClick={() => removeRow(row.id)} aria-label="Remove row" className="flex h-9 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-red-500"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <span className="w-24 shrink-0 text-sm font-semibold sm:w-40">Total</span>
                    <span className="flex-1 text-sm font-semibold">{usd(fixedTotal)}</span>
                    <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums">{pctOf(fixedTotal)}%</span>
                    <span className="h-9 w-8 shrink-0" />
                  </div>
                  <button type="button" onClick={addRow} className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"><Plus className="h-4 w-4" /> Add row</button>
                </div>

                {/* Yearly subscriptions */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Yearly subscriptions</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Track annual subscriptions and recurring costs separately so they don't catch you off guard. Common ones people miss: credit card annual fees, car registration, memberships, Amazon Prime, gym contracts, software licenses, AAA, and annual insurance premiums.</p>
                  <div className="mt-4 space-y-2">
                    {subs.map((s, i) => (
                      <div key={s.id}>
                        <div className="flex items-center gap-2">
                          <input id={`sub-name-${i}`} onKeyDown={colTab("sub-name", i, subs.length)} value={s.name} onChange={(e) => updateSub(s.id, "name", e.target.value)} placeholder="Subscription name" className={`${rowInputCls} flex-1 min-w-0 px-3`} />
                          <div className="relative w-28 shrink-0">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                            <MoneyInput id={`sub-cost-${i}`} onKeyDown={colTab("sub-cost", i, subs.length)} value={s.cost} onChange={(v) => updateSub(s.id, "cost", v)} placeholder={s.hint} className={`${rowInputCls} pl-7 pr-3`} />
                          </div>
                          <button type="button" onClick={() => removeSub(s.id)} aria-label="Remove subscription" className="flex h-9 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-red-500"><X className="h-4 w-4" /></button>
                        </div>
                        {s.cost > 0 && <p className="-mt-0.5 pr-10 text-right text-[10px] text-muted-foreground">{usd(s.cost / 12)}/mo</p>}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSub} className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"><Plus className="h-4 w-4" /> Add row</button>
                  {subs.length > 0 && (
                    <div className="mt-3 space-y-1.5 rounded-sm bg-secondary/50 p-4 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Total / yr</span><span className="font-semibold">{usd(subsTotal)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Monthly equivalent</span><span className="font-semibold text-accent">{usd(subsMonthly)}/mo</span></div>
                    </div>
                  )}
                </div>

                {/* Fixed costs at a glance */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Your fixed costs at a glance</h2>
                  <p className="mt-2 text-xs text-muted-foreground">Here's what your fixed expenses look like against your take-home pay.</p>
                  <div className="mt-4 space-y-3 rounded-sm bg-secondary/50 p-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Monthly net income</span><span className="font-semibold">{usd(monthlyNet)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total fixed costs</span><span className="font-semibold">{usd(fixedTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Yearly subs (monthly)</span><span className="font-semibold">{usd(subsMonthly)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Fixed costs as % of income</span><span className="font-medium text-muted-foreground">{pctOf(fixedTotal)}%</span></div>
                    <div className="flex justify-between border-t border-border pt-3"><span className="font-medium">Left over for savings & spending</span><span className={`text-lg font-bold ${leftAfterFixed >= 0 ? "text-accent" : "text-red-500"}`}>{usd(leftAfterFixed)}</span></div>
                  </div>
                  {leftAfterFixed >= 0 ? (
                    <div className="mt-4 rounded-sm border border-accent/30 bg-accent/[0.06] p-4">
                      <p className="text-sm font-semibold text-foreground">{usd(leftAfterFixed)}/mo available</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">This is what you have left after fixed obligations. In Step 2 you'll split it between <strong className="text-foreground">savings</strong> and <strong className="text-foreground">guilt-free spending</strong>.</p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-sm border border-red-500/30 bg-red-500/[0.05] p-4">
                      <p className="text-sm font-semibold text-red-500">Your fixed costs exceed your income by {usd(Math.abs(leftAfterFixed))}/mo</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Before saving for a home, look for fixed expenses to cut or negotiate down.</p>
                    </div>
                  )}
                </div>

                {/* Why this step matters */}
                <div className="rounded-sm border border-accent/30 bg-accent/[0.06] p-6 sm:p-8">
                  <p className="font-display text-lg font-semibold">These are the costs you've already committed to</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Fixed costs are your foundation.</strong> They're the bills that show up every month no matter what, your current rent or mortgage, debt payments, utilities, groceries, and insurance. Everything that comes later, your savings, your fun money, and one day a house payment, gets built on top of what's left after these. The more honest and complete you are here, the more real every number in the next steps becomes.</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">If a cost swings month to month, enter a typical average. Don't know your real numbers yet?{" "}<Link to="/tools/budget-spreadsheet" className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-2 hover:text-accent">Use my budget spreadsheet</Link>{" "}to track one to three months, then come back and pick up right here.</p>
                  <button type="button" onClick={() => goStep(1)} className="group mt-5 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Continue to Step 2 <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                {/* Guilt-free spending */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Guilt-free spending</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Everything that is not a fixed obligation: restaurants, entertainment, shopping, travel, hobbies. The less you spend here, the more you can save toward a down payment.</p>
                  <div className="mt-4 space-y-2">
                    {guiltFree.map((row, i) => (
                      <div key={row.id} className="flex items-center gap-2">
                        <input id={`gf-label-${i}`} onKeyDown={colTab("gf-label", i, guiltFree.length)} value={row.label} onChange={(e) => updateGf(row.id, "label", e.target.value)} placeholder="Category name" className={`${rowInputCls} !w-28 shrink-0 px-3 sm:!w-48`} />
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                          <MoneyInput id={`gf-amount-${i}`} onKeyDown={colTab("gf-amount", i, guiltFree.length)} value={row.amount} onChange={(v) => updateGf(row.id, "amount", v)} placeholder={row.hint} className={`${rowInputCls} pl-7 pr-3`} />
                        </div>
                        <button type="button" onClick={() => removeGf(row.id)} aria-label="Remove row" className="flex h-9 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-red-500"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addGf} className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"><Plus className="h-4 w-4" /> Add row</button>
                  <div className="mt-3 flex justify-between rounded-sm bg-secondary/50 p-3 text-sm"><span className="text-muted-foreground">Total / mo</span><span className="font-semibold">{usd(gfTotal)}</span></div>
                </div>

                {/* Debt repayment */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Debt repayment</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Total monthly debt payments: student loans, car payments, credit card minimums, and more. This is synced with the Debt Payments you entered in Step 1.</p>
                  <div className="mt-4 max-w-xs">
                    <label className={labelCls}>Total monthly debt payments</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <MoneyInput value={debts} onChange={setDebt} className={`${fieldCls} pl-7`} />
                    </div>
                  </div>
                </div>

                {/* Savings & investments */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Savings &amp; investments</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Your savings rate is the biggest factor in how quickly you can buy. A 20% rate is the common minimum healthy target. The higher it is, the faster you reach your down payment.</p>
                  {availableForSavings > 0 && (
                    <div className="mt-3 rounded-sm border border-accent/30 bg-accent/[0.06] p-3 text-xs leading-relaxed text-muted-foreground">
                      After fixed expenses, subscriptions, and guilt-free spending, you have <strong className="text-accent">{usd(availableForSavings)}/mo</strong> to allocate below.
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    {savingsRows.map((row, i) => (
                      <div key={row.id}>
                        <div className="flex items-center gap-2">
                          <input id={`sv-label-${i}`} onKeyDown={colTab("sv-label", i, savingsRows.length)} value={row.label} onChange={(e) => updateSav(row.id, "label", e.target.value)} placeholder="Savings category" className={`${rowInputCls} flex-1 min-w-0 px-3`} />
                          <div className="relative w-28 shrink-0">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                            <MoneyInput id={`sv-amount-${i}`} onKeyDown={colTab("sv-amount", i, savingsRows.length)} value={row.amount} onChange={(v) => updateSav(row.id, "amount", v)} placeholder={row.hint} className={`${rowInputCls} pl-7 pr-3`} />
                          </div>
                          <button type="button" onClick={() => removeSav(row.id)} aria-label="Remove row" className="flex h-9 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-red-500"><X className="h-4 w-4" /></button>
                        </div>
                        {row.id === "monthlySavings" && (
                          <div className="ml-1 mt-1.5 border-l-2 border-accent/30 py-1 pl-3">
                            <label className="text-xs font-medium text-muted-foreground">How much have you saved for a down payment so far?</label>
                            <div className="relative mt-1.5 max-w-xs">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                              <MoneyInput value={down} onChange={setDown} placeholder="40,000" className={`${rowInputCls} pl-7 pr-3`} />
                            </div>
                            <p className="mt-1 text-[10px] text-muted-foreground">This carries into Step 3's savings timeline and Step 4's down payment.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSav} className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"><Plus className="h-4 w-4" /> Add row</button>
                  <div className="mt-3 space-y-1.5 rounded-sm bg-secondary/50 p-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Total / mo</span><span className="font-semibold">{usd(savingsTotal)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Savings rate</span><span className={`font-semibold ${savingsRate >= 20 ? "text-accent" : "text-amber-500"}`}>{savingsRate.toFixed(0)}%</span></div>
                  </div>
                </div>

                {/* Why this step matters */}
                <div className="rounded-sm border border-accent/30 bg-accent/[0.06] p-6 sm:p-8">
                  <p className="font-display text-lg font-semibold">These two numbers are yours to shape</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Guilt-free spending is your lifestyle.</strong> There's no right answer here, it's a dial. Cut it back and you free up room for more home; keep it higher and you protect your breathing room. The trick is to be honest, and to think annually: if you like to take one trip a year for around $2,400, that's really $200 a month that belongs in this budget. The same goes for hobbies, gifts, and nights out.</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Your savings rate decides how fast you get there.</strong> A higher monthly number means your down payment arrives sooner. Beyond the down payment, think about the other things you fund every month, or want to: a Roth IRA, a 401(k) match, an emergency fund, a car fund. Decide the contribution rate you actually want to keep up after you buy, so a home payment never quietly crowds out your future.</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Dial these in until the leftover at the right feels right. Then let's see what it means for your home budget.</p>
                  <button type="button" onClick={() => goStep(2)} className="group mt-5 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Continue to Step 3 <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* 1 · Loan type */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Loan type</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">This sets your minimum down payment and mortgage insurance. Conventional needs 5% down (20% to skip PMI); FHA allows 3.5% down but carries mortgage insurance (MIP) for most of the loan.</p>
                  <div className="mt-4 grid max-w-sm grid-cols-2 gap-2">
                    {([{ v: "conventional", t: "Conventional", n: "5% min · no PMI at 20%" }, { v: "fha", t: "FHA", n: "3.5% min · MIP applies" }] as const).map((o) => (
                      <button key={o.v} type="button" onClick={() => setLoanType(o.v)} className={`rounded-sm border p-3 text-left transition-all ${loanType === o.v ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-border hover:border-accent/40"}`}>
                        <p className="font-display text-base font-bold">{o.t}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{o.n}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2 · Rate & term */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Interest rate &amp; loan term</h2>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Interest rate (%)</label>
                      <input type="number" min={0} step={0.125} value={rate} onChange={(e) => setRate(+e.target.value)} className={fieldCls} />
                      <p className="mt-1 text-[10px] text-muted-foreground">Current average is around 6.5 to 7%. <a href="https://www.freddiemac.com/pmms" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">Check today's rates</a>, then confirm with your lender.</p>
                    </div>
                    <div>
                      <span className={labelCls}>Loan term</span>
                      <div className="flex gap-2">
                        {([15, 30] as const).map((t) => (
                          <button key={t} type="button" onClick={() => setTerm(t)} className={`flex-1 rounded-sm border px-3 py-2.5 text-sm font-medium transition-all ${term === t ? "border-accent bg-accent text-accent-foreground" : "border-border bg-white text-foreground hover:border-accent/60"}`}>{t}-yr fixed</button>
                        ))}
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">Dave Ramsey's rule always uses 15-year.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowAdvAfford((v) => !v)} className="mt-4 text-xs font-semibold text-accent transition-colors hover:text-foreground">{showAdvAfford ? "Hide" : "Show"} advanced settings (property tax, insurance, PMI)</button>
                  {showAdvAfford && (
                    <div className="mt-3 grid gap-4 rounded-sm border border-border p-4 sm:grid-cols-3">
                      <div><label className={labelCls}>Property tax rate (%)</label><input type="number" min={0} step={0.01} value={taxRate} onChange={(e) => setTaxRate(+e.target.value)} className={fieldCls} /></div>
                      <div><label className={labelCls}>Home insurance / yr</label><MoneyInput value={homeIns} onChange={setHomeIns} className={fieldCls} /></div>
                      <div><label className={labelCls}>PMI rate (%)</label><input type="number" min={0} step={0.05} value={pmiRate} onChange={(e) => setPmiRate(+e.target.value)} className={fieldCls} /></div>
                    </div>
                  )}
                </div>

                {/* 3 · Down payment */}
                <div className={cardCls}>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <h2 className="font-display text-xl font-semibold">How much are you putting down?</h2>
                    <div className="flex shrink-0 overflow-hidden rounded-sm border border-border text-xs">
                      {(["percent", "dollar"] as const).map((m) => (
                        <button key={m} type="button" onClick={() => setDownMode(m)}
                          className={`px-3 py-1.5 font-semibold transition-colors ${downMode === m ? "bg-accent text-accent-foreground" : "bg-white text-muted-foreground hover:text-foreground"}`}>
                          {m === "percent" ? "%" : "$"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Your down payment drives your max home price, monthly payment, and whether you'll pay PMI. Use <strong className="text-foreground">$</strong> if you have a set amount of capital to deploy.</p>
                  {downMode === "percent" ? (
                    <>
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {[{ v: 3.5, note: "FHA min" }, { v: 5, note: "Conv. min" }, { v: 10, note: "" }, { v: 20, note: "No PMI" }].map((d) => (
                          <button key={d.v} type="button" onClick={() => setDpPct(d.v)} className={`rounded-sm border p-3 text-center transition-all ${dpPct === d.v ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-border hover:border-accent/40"}`}>
                            <p className="font-display text-lg font-bold">{d.v}%</p>
                            {d.note && <p className="mt-0.5 text-[10px] text-muted-foreground">{d.note}</p>}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 max-w-xs">
                        <label className={labelCls}>Or enter a custom %</label>
                        <input type="number" min={0} max={99} step={0.5} value={dpPct} onChange={(e) => setDpPct(Math.min(+e.target.value, 99))} className={fieldCls} />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">≈ <strong className="text-foreground">{usd(allIn.downResolved)}</strong> on a {usd(price)} home.</p>
                    </>
                  ) : (
                    <div className="mt-4 max-w-xs">
                      <label className={labelCls}>Amount you'll put down</label>
                      <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={down} onChange={setDown} placeholder="60,000" className={`${fieldCls} pl-7`} /></div>
                      <p className="mt-2 text-xs text-muted-foreground"><strong className="text-foreground">{allIn.downPctResolved.toFixed(0)}%</strong> down on a {usd(price)} home.</p>
                    </div>
                  )}
                  <p className="mt-3 rounded-sm bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">
                    {allIn.pmiApplies ? "Under 20% down — you'll pay PMI until you reach 20% equity (typically 0.3 to 1.5% of the loan annually)." : "At 20%+ down, you won't pay PMI — the ideal threshold for keeping monthly costs lower."}
                  </p>
                </div>

                {/* 4 · Savings toward down payment (used on Step 4 for the timeline) */}
                <div className={cardCls}>
                  <h2 className="font-display text-xl font-semibold">Your savings toward a down payment</h2>
                  <p className="mt-2 text-xs text-muted-foreground">We'll use these on the next step to show how far you are from your {dpPct}% down payment goal.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>How much have you saved?</label>
                      <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={down} onChange={setDown} placeholder="40,000" className={`${fieldCls} pl-7`} /></div>
                    </div>
                    <div>
                      <label className={labelCls}>How much can you save / month?</label>
                      <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={monthlySavingsForHome} onChange={(v) => updateSav("monthlySavings", "amount", v)} className={`${fieldCls} pl-7`} /></div>
                      <p className="mt-1 text-[10px] text-muted-foreground">Synced from your Monthly Savings in Step 2.</p>
                    </div>
                  </div>
                </div>

                {/* 5 · Philosophy cards */}
                <div>
                  <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">How much house can you afford?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Four popular approaches, assuming <strong className="text-foreground">{dpPct}% down</strong>.</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <PhilosophyCard p={phil.ramsey} tag="Ultra-Conservative" />
                    <PhilosophyCard p={phil.conventional} tag="Recommended" recommended />
                    <PhilosophyCard p={phil.fha} tag="Government Standard" />
                    <PhilosophyCard p={phil.aggressive} tag="Maximum Stretch" />
                  </div>
                  {phil.ramsey.maxHomePrice > 0 && <p className="mt-3 rounded-sm bg-secondary/50 p-3 text-[11px] text-muted-foreground">Dave Ramsey recommends a 15-year fixed regardless of your selected term, which is why its number is lower.</p>}
                </div>

                {/* Don't max out — comfort over approval */}
                <div className="rounded-sm border-2 border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Read this before you tour a single house</p>
                  <h3 className="mt-2 font-display text-xl font-semibold">Just because you can, doesn't mean you should</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The numbers above are what lenders will <em>approve</em>, not what you'll be comfortable living with. Maxing out your budget leaves no room for travel, eating out, emergencies, or just breathing. Look at the four numbers, picture your real life on top of that payment, and choose the one that still feels good.</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Then settle on your <strong className="text-foreground">maximum monthly payment you'd be genuinely comfortable with</strong> based on your lifestyle. This is the single most important number in your entire home search, know it cold before you look at a single listing. On <strong className="text-foreground">Step 4</strong> you'll plug in that number and we'll show you exactly how much home it buys.</p>
                  <button type="button" onClick={() => goStep(3)} className="group mt-5 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Continue to Step 4 <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
              {/* Build your number — income, expenses, leftover, 28/36 range */}
              <div className={cardCls}>
                <h2 className="font-display text-xl font-semibold">Build your number</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Start from what's actually left in your budget each month, then sanity-check it against the 28/36 rule. Use this to land on the comfortable payment below.</p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat label="Annual gross" value={usd(annualGross)} />
                  <Stat accent label="Monthly gross" value={usd(monthlyGross)} />
                  <Stat accent label="Monthly net" value={usd(monthlyNet)} />
                  <Stat label="Fixed costs / mo" value={usd(fixedTotal + subsMonthly)} />
                  <Stat label="Guilt-free / mo" value={usd(gfTotal)} />
                  <Stat label="Existing debt / mo" value={usd(debts)} />
                </div>

                <div className="mt-5 space-y-2 rounded-sm bg-secondary/50 p-4 text-sm">
                  <Line l="Monthly net income" v={usd(monthlyNet)} />
                  <Line l="Fixed costs & subscriptions" v={`-${usd(fixedTotal + subsMonthly)}`} />
                  <Line l="Guilt-free spending" v={`-${usd(gfTotal)}`} />
                  <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Likely left over each month</span><span className={likelyLeftover >= 0 ? "text-accent" : "text-red-500"}>{usd(likelyLeftover)}</span></div>
                </div>

                <p className="mt-3 rounded-sm bg-card p-3 text-xs leading-relaxed text-muted-foreground">You currently pay <strong className="text-foreground">{usd(rentMortgage)}/mo</strong> toward rent or a mortgage. The 28/36 rule suggests a housing payment of about <strong className="text-foreground">{usd(rangeHigh)}/mo</strong> &mdash; {paymentDelta >= 0 ? <>roughly <strong className="text-foreground">{usd(paymentDelta)}/mo more</strong></> : <>roughly <strong className="text-foreground">{usd(Math.abs(paymentDelta))}/mo less</strong></>} than you pay now. At that payment you'd have about <strong className="text-foreground">{usd(leftForSaving)}/mo</strong> left for saving and investing &mdash; anything not already in your fixed expenses or guilt-free spending.</p>

                <div className="mt-4 rounded-sm border border-accent/30 bg-accent/[0.06] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Recommended range &mdash; 28/36 rule</p>
                  <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">{usd(rangeLow)} &ndash; {usd(rangeHigh)}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">From 25% of your gross income on the low end up to the 28/36 ceiling on the high end. This range may be too high or too low depending on what you prioritize, and whether you accounted for all the unexpected costs at the bottom of this page.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setComfortPayment(rangeLow)} className="rounded-sm border border-accent/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Use {usd(rangeLow)}/mo</button>
                    <button type="button" onClick={() => setComfortPayment(rangeHigh)} className="rounded-sm border border-accent/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Use {usd(rangeHigh)}/mo</button>
                  </div>
                </div>
              </div>

              {/* Comfortable monthly payment — the single most important number */}
              <div className="rounded-sm border-2 border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">The single most important number</p>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em]">Your maximum comfortable monthly payment</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Just because a lender approves you for a number doesn't mean you should spend it. Decide what fits <em>your</em> lifestyle, then know this number cold before you ever tour a house.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 sm:items-end">
                  <div>
                    <label className={labelCls}>Max comfortable payment / month</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground">$</span>
                      <MoneyInput value={comfortTarget} onChange={setComfortPayment} placeholder="2,500" className={`${fieldCls} pl-8 text-lg font-semibold`} />
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                      <span>Recommended budget: {usd(Math.round(recommended))}/mo</span>
                      {comfortPayment > 0 && <button type="button" onClick={() => setComfortPayment(0)} className="font-semibold text-accent hover:underline">Reset to recommended</button>}
                    </div>
                  </div>
                  <div className="rounded-sm bg-card p-4 ring-1 ring-accent/20">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">That payment supports about</p>
                    <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.02em]">{usd(price)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">all-in at {downMode === "dollar" ? `${usd(down)} down` : `${dpPct}% down`}, {rate}% / {term}-yr</p>
                  </div>
                </div>

                {/* Comfort gauge */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${gauge === "green" ? "bg-emerald-500/15 text-emerald-600" : gauge === "yellow" ? "bg-amber-500/15 text-amber-600" : "bg-red-500/15 text-red-600"}`}>
                    <span className={`h-2 w-2 rounded-full ${gauge === "green" ? "bg-emerald-500" : gauge === "yellow" ? "bg-amber-500" : "bg-red-500"}`} />
                    {gauge === "green" ? "Comfortably within your budget" : gauge === "yellow" ? "A stretch — redirecting some investing" : "Above what your budget supports"}
                  </span>
                </div>

                {/* Comfortable vs. approved — the gap is yours */}
                <p className="mt-3 rounded-sm bg-card/60 p-3 text-xs leading-relaxed text-muted-foreground">A lender will likely approve you for around <strong className="text-foreground">{usd(rangeHigh)}/mo</strong>. Your comfortable number is <strong className="text-foreground">{usd(comfortTarget)}/mo</strong>. That <strong className="text-accent">{usd(comfortableVsApprovedGap)}/mo</strong> gap is yours — for travel, investing, or just breathing room.</p>

                {/* All-in monthly breakdown + rule-of-thumb adjusters */}
                <div className="mt-4 rounded-sm border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">What's in that payment</p>
                    <p className="text-sm font-semibold">{usd(payment)}/mo all-in</p>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <Line l="Principal &amp; interest" v={usd(pi)} />
                    <Line l="Property tax" v={usd(tax)} />
                    <Line l="Home insurance" v={usd(ins)} />
                    {allIn.pmiApplies && <Line l="PMI" v={usd(allIn.pmiMonthly)} />}
                    {hoaMonthly > 0 && <Line l="HOA dues" v={usd(hoaMonthly)} />}
                    {maintenanceOn && <Line l={`Maintenance reserve (${maintenancePct}%/yr)`} v={usd(allIn.maintenanceMonthly)} />}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground"><strong className="text-foreground">Maintenance is off by default — turn it on</strong> to reserve for the upkeep renters never pay (it'll make your number more honest, and a bit lower). These are rules of thumb you can adjust: the ~1%/yr maintenance rule overstates on pricier homes and understates on cheap or older ones.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="flex flex-col gap-1">
                      <span className="flex items-center justify-between text-[11px]"><span className="font-semibold text-muted-foreground">Maintenance %/yr</span><button type="button" onClick={() => setMaintenanceOn((v) => !v)} className={`text-[10px] font-semibold ${maintenanceOn ? "text-accent" : "text-muted-foreground"}`}>{maintenanceOn ? "On" : "Off"}</button></span>
                      <input type="number" min={0} step={0.25} value={maintenancePct} disabled={!maintenanceOn} onChange={(e) => setMaintenancePct(+e.target.value)} className={`${fieldCls} ${!maintenanceOn ? "opacity-40" : ""}`} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">HOA $/mo</span>
                      <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={hoaMonthly} onChange={setHoaMonthly} placeholder="0" className={`${fieldCls} pl-7`} /></div>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="flex items-center justify-between text-[11px]"><span className="font-semibold text-muted-foreground">Closing %</span><button type="button" onClick={() => setClosingOn((v) => !v)} className={`text-[10px] font-semibold ${closingOn ? "text-accent" : "text-muted-foreground"}`}>{closingOn ? "On" : "Off"}</button></span>
                      <input type="number" min={0} step={0.5} value={closingPct} disabled={!closingOn} onChange={(e) => setClosingPct(+e.target.value)} className={`${fieldCls} ${!closingOn ? "opacity-40" : ""}`} />
                    </label>
                  </div>
                </div>

                {/* Rate sensitivity */}
                {rateSensOn && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-sm bg-card/60 p-3 text-xs text-muted-foreground">
                    <span>At {rate}% you're near <strong className="text-foreground">{usd(sens.base.price)}</strong>. If rates rise 1% the same payment buys ~{usd(sens.up.price)}; down 1%, ~{usd(sens.down.price)}.</span>
                    <button type="button" onClick={() => setRateSensOn(false)} className="shrink-0 text-[10px] font-semibold text-accent hover:underline">Hide</button>
                  </div>
                )}

                {/* Reserves / cash-to-close */}
                <div className="mt-4 rounded-sm bg-card/60 p-3 text-xs">
                  <p className="text-muted-foreground">Cash to close ~<strong className="text-foreground">{usd(cash.cashToClose)}</strong>{capitalAvailable > 0 && (<> → ~<strong className={cash.reserveMonths < 2 ? "text-red-600" : "text-foreground"}>{usd(Math.max(0, cash.reservesAfter))}</strong> left ({cash.reserveMonths.toFixed(1)} mo of payments)</>)}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Most lenders want 2–6 months of reserves after closing.{cash.reserveMonths < 2 && capitalAvailable > 0 ? <strong className="text-red-600"> Yours is thin — don't drain every dollar into the down payment.</strong> : ""}</p>
                  <div className="mt-2 max-w-[220px]">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total capital you can deploy</label>
                    <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={capitalAvailable} onChange={setCapitalAvailable} placeholder={String(down || 60000)} className={`${fieldCls} pl-7`} /></div>
                  </div>
                </div>

                <button type="button" onClick={() => goStep(4)} className="group mt-5 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Tune these numbers <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></button>
              </div>

              {/* Down payment progress / timeline */}
              <div className={cardCls}>
                <h2 className="font-display text-xl font-semibold">How far are you from your down payment?</h2>
                <p className="mt-2 text-xs text-muted-foreground">Using the savings you entered in Step 3 against your {dpPct}% target.</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">Affordability target</p>
                  <select value={timelinePhil} onChange={(e) => setTimelinePhil(e.target.value as typeof timelinePhil)} className="h-8 rounded-sm border border-border bg-white px-2 text-xs">
                    <option value="conventional">28/36 Rule</option>
                    <option value="ramsey">Dave Ramsey</option>
                    <option value="fha">FHA</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                {timeline.maxHomePrice > 0 ? (
                  <div className="mt-3 space-y-2 rounded-sm bg-secondary/50 p-4 text-sm">
                    <Line l="Target home price" v={usd(timeline.maxHomePrice)} />
                    <Line l={`Down payment needed (${dpPct}%)`} v={usd(dpNeeded)} />
                    <Line l="Already saved" v={usd(down)} />
                    <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Still needed</span><span className={dpRemaining <= 0 ? "text-accent" : ""}>{dpRemaining <= 0 ? "You're there!" : usd(dpRemaining)}</span></div>
                    {dpRemaining > 0 && <Line l="Saving / month" v={usd(monthlySavingsForHome)} />}
                    {dpRemaining > 0 && <Line l="Time to goal" v={monthsToGoal === null ? "Add monthly savings in Step 3" : `~${monthsToGoal} mo (${(monthsToGoal / 12).toFixed(1)} yrs)`} />}
                  </div>
                ) : (
                  <p className="mt-3 rounded-sm bg-secondary/50 p-4 text-xs text-muted-foreground">Enter your income in Step 1 to see your target.</p>
                )}
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">Want a faster (or further-out) timeline? Head back to <button type="button" onClick={() => goStep(2)} className="font-semibold text-accent underline-offset-2 hover:underline">Step 3</button> to adjust your <button type="button" onClick={() => goStep(2)} className="font-semibold text-accent underline-offset-2 hover:underline">down payment amount</button> or your <button type="button" onClick={() => goStep(2)} className="font-semibold text-accent underline-offset-2 hover:underline">monthly savings rate</button>.</p>
              </div>

              {/* Costs first-time buyers often forget */}
              <div className={cardCls}>
                <h2 className="font-display text-xl font-semibold">Costs first-time buyers often forget</h2>
                <p className="mt-2 text-xs text-muted-foreground">Your down payment isn't the only upfront cost. Factor these in so there are no surprises at closing, and so your comfortable payment above still feels comfortable after you move in.</p>
                <div className="mt-4 space-y-2">
                  {[
                    ["Closing costs", "2 to 5% of purchase price. On a $300K home, that's $6,000 to $15,000."],
                    ["Home inspection", "$300 to $500. Non-negotiable, this protects you from hidden problems."],
                    ["Moving costs", "$1,000 to $5,000+ depending on distance and help needed."],
                    ["Immediate repairs & furnishing", "Budget $2,000 to $5,000+ for fixes and furniture for new rooms."],
                    ["The 1% rule (annual maintenance)", "Set aside 1% of the home's value per year. $300K home = $3,000/yr ($250/mo)."],
                    ["Emergency fund", "Keep 3 to 6 months of your new mortgage payment in savings."],
                  ].map(([l, d]) => (
                    <div key={l} className="rounded-sm bg-secondary/40 p-3">
                      <p className="text-xs font-semibold">{l}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save your numbers + mortgage calculator */}
              <div className="rounded-sm border-2 border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Before you go</p>
                <h3 className="mt-2 font-display text-xl font-semibold">Write these numbers down</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Screenshot this page or jot down your comfortable payment (<strong className="text-foreground">{usd(comfortTarget)}/mo</strong>) and the home price it supports (<strong className="text-foreground">{usd(price)}</strong>). Heads up: this tool resets if you leave or refresh the page, so capture your numbers now.</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Then take them into the <strong className="text-foreground">mortgage calculator</strong> to adjust your down payment, interest rate, taxes, and insurance against real listings you're considering.</p>
                <Link to="/tools/mortgage-calculator" className="group mt-4 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Open the mortgage calculator <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                <p className="mt-4 border-t border-accent/20 pt-4 text-[11px] leading-relaxed text-muted-foreground"><strong className="text-foreground">Heads up:</strong> these are estimates to set your budget, not a quote for any specific home. You and I should re-run the numbers on every property before you make an offer. <strong className="text-foreground">Property taxes</strong> vary home to home depending on the municipality and assessment, and <strong className="text-foreground">interest rates</strong> change daily, so the real monthly payment will shift from house to house.</p>
              </div>
              </>
            )}

            {step === 4 && (
              <>
              {/* Step 5 — tune the levers */}
              <div className="rounded-sm border-2 border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Make it yours</p>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em]">Tune the levers, watch your number move</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your safety net (retirement &amp; emergency) stays locked. Everything else is yours to trade off against a bigger home — building equity is wealth-building too.</p>

                <div className="mt-5 rounded-sm bg-card p-4 ring-1 ring-accent/20">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Right now</p>
                  <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">{usd(comfortTarget)}/mo <span className="text-base font-normal text-muted-foreground">&rarr; ~{usd(price)} home</span></p>
                  <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${gauge === "green" ? "bg-emerald-500/15 text-emerald-600" : gauge === "yellow" ? "bg-amber-500/15 text-amber-600" : "bg-red-500/15 text-red-600"}`}>
                    <span className={`h-2 w-2 rounded-full ${gauge === "green" ? "bg-emerald-500" : gauge === "yellow" ? "bg-amber-500" : "bg-red-500"}`} />
                    {gauge === "green" ? "Within budget" : gauge === "yellow" ? "Stretch" : "Over budget"}
                  </span>
                </div>

                {comfortPayment > 0 && comfortPayment > range.tuned(redirectPct) + 1 && (
                  <p className="mt-3 rounded-sm bg-red-500/10 p-3 text-xs leading-relaxed text-red-700">Your <strong>{usd(comfortPayment)}/mo</strong> is <strong>{usd(comfortPayment - range.tuned(redirectPct))}/mo above</strong> what your plan supports. Trim lifestyle spending or redirect more investing below — or this number won't be sustainable. Retirement &amp; emergency stay protected.</p>
                )}

                {/* Editable lifestyle (guilt-free) — updates the number live */}
                <div className="mt-5 rounded-sm border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lifestyle (guilt-free) spending</p>
                    <span className="text-xs font-semibold">{usd(gfTotal)}/mo</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {guiltFree.map((row) => (
                      <div key={row.id} className="flex items-center gap-2">
                        <input value={row.label} onChange={(e) => updateGf(row.id, "label", e.target.value)} placeholder="Category" className={`${rowInputCls} flex-1 min-w-0 px-3`} />
                        <div className="relative w-28 shrink-0"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={row.amount} onChange={(v) => updateGf(row.id, "amount", v)} className={`${rowInputCls} pl-7 pr-3`} /></div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Edit these to match the life you actually want after you move. <strong className="text-foreground">More lifestyle = a smaller payment; less = bigger.</strong> Your number above moves as you type.</p>
                </div>

                {/* Editable saving & investing — updates the number live */}
                <div className="mt-5 rounded-sm border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Saving &amp; investing</p>
                    <span className="text-xs font-semibold">{usd(savingsTotal)}/mo</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {savingsRows.map((row) => (
                      <div key={row.id} className="flex items-center gap-2">
                        <input value={row.label} onChange={(e) => updateSav(row.id, "label", e.target.value)} placeholder="Category" className={`${rowInputCls} flex-1 min-w-0 px-3`} />
                        <div className="relative w-28 shrink-0"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><MoneyInput value={row.amount} onChange={(v) => updateSav(row.id, "amount", v)} className={`${rowInputCls} pl-7 pr-3`} /></div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground"><strong className="text-foreground">Lower a number to put more toward the home</strong> (equity is wealth-building too); raise it to keep more invested and liquid. Just keep retirement &amp; emergency funded — that's your safety net.</p>
                </div>

                <p className="mt-5 rounded-sm bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">Is your guilt-free spending realistic for life <em>after</em> you move? Add the trips, dining, and hobbies you want to keep doing, so this number reflects the life you actually want. <button type="button" onClick={() => goStep(1)} className="font-semibold text-accent hover:underline">Add them in Step 2 &rarr;</button></p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button type="button" onClick={resetTuning} className="rounded-sm border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent">Reset to my actual budget</button>
                  {comfortPayment > 0 && <button type="button" onClick={() => setComfortPayment(0)} className="text-xs font-semibold text-accent hover:underline">Reset payment to recommended</button>}
                </div>
              </div>

              {/* Close the loop */}
              <div className="rounded-sm border-2 border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Your next step</p>
                <h3 className="mt-2 font-display text-xl font-semibold">See homes near {usd(price)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A lender confirms your <em>approved</em> number; I help you find the home you'll actually want. Let's look at what's available in your range.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/listings" className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">See active homes <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm border border-accent/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"><Handshake className="h-4 w-4" /> Talk to Lucas</Link>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground"><strong className="text-foreground">Heads up:</strong> this tool resets on refresh, so screenshot your comfortable payment (<strong className="text-foreground">{usd(comfortTarget)}/mo</strong>) and the home price it supports (<strong className="text-foreground">{usd(price)}</strong>) first. You can also download it below.</p>
              </div>
              </>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={() => goStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent disabled:opacity-30"><ArrowLeft className="h-4 w-4" /> Back</button>
              {step < 4 ? (
                <button type="button" onClick={() => goStep(Math.min(4, step + 1))} className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Next <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></button>
              ) : (
                <Link to="/resources/lenders" className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"><Handshake className="h-4 w-4" /> Get pre-approved</Link>
              )}
            </div>
          </div>

          {/* Right — sticky summary + download */}
          <div className="lg:sticky lg:top-[176px] lg:self-start">
            <div className="flex flex-col rounded-sm bg-[#0a1424] p-6 text-white/80 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)] sm:p-8">
              {step === 0 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Monthly summary</p>
                  <p className={`mt-3 font-display text-4xl font-semibold tracking-[-0.02em] ${leftAfterFixed >= 0 ? "text-white" : "text-red-400"}`}>{usd(leftAfterFixed)}</p>
                  <p className="mt-2 text-sm text-white/55">left after fixed costs and subscriptions</p>
                  <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
                    <SRow label="Monthly net income" value={usd(monthlyNet)} />
                    <SRow label={`${FREQ_LABELS[freq]} net`} value={usd(paycheckNet)} />
                    <SRow label="Est. tax rate" value={`${effectiveTaxRate.toFixed(1)}%`} />
                    <div className="border-t border-white/10 pt-3"><SRow label="Total fixed costs" value={usd(fixedTotal)} /></div>
                    <SRow label="Fixed cost %" value={`${pctOf(fixedTotal)}%`} />
                    <SRow label="Yearly subs (monthly)" value={usd(subsMonthly)} />
                    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                      <span className="font-semibold text-white">Remaining</span>
                      <span className={`font-display text-xl font-semibold ${leftAfterFixed >= 0 ? "text-accent" : "text-red-400"}`}>{usd(leftAfterFixed)}/mo</span>
                    </div>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Budget summary</p>
                  <p className={`mt-3 font-display text-4xl font-semibold tracking-[-0.02em] ${leftover >= 0 ? "text-white" : "text-red-400"}`}>{usd(leftover)}</p>
                  <p className="mt-2 text-sm text-white/55">left over after everything</p>
                  <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
                    <SRow label="Monthly net income" value={usd(monthlyNet)} />
                    <SRow label="Fixed costs" value={`-${usd(fixedTotal)}`} />
                    <SRow label="Yearly subs (monthly)" value={`-${usd(subsMonthly)}`} />
                    <SRow label="Guilt-free spending" value={`-${usd(gfTotal)}`} />
                    <SRow label="Savings & investing" value={`-${usd(savingsTotal)}`} />
                    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                      <span className="font-semibold text-white">Net remaining</span>
                      <span className={`font-display text-xl font-semibold ${leftover >= 0 ? "text-accent" : "text-red-400"}`}>{usd(leftover)}/mo</span>
                    </div>
                    <SRow label="Savings rate" value={`${savingsRate.toFixed(0)}%`} />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Affordability summary</p>
                  <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-white">{usd(phil.conventional.maxHomePrice)}</p>
                  <p className="mt-2 text-sm text-white/55">recommended (28/36) at {dpPct}% down</p>
                  <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
                    <SRow label="Dave Ramsey (15yr)" value={usd(phil.ramsey.maxHomePrice)} />
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-white">28/36 Rule</span>
                      <span className="font-display text-base font-semibold text-accent">{usd(phil.conventional.maxHomePrice)}</span>
                    </div>
                    <SRow label="FHA guidelines" value={usd(phil.fha.maxHomePrice)} />
                    <SRow label="Aggressive" value={usd(phil.aggressive.maxHomePrice)} />
                    <p className="border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/45">The 28/36 rule is the most commonly recommended guideline for sustainable homeownership.</p>
                  </div>
                </>
              )}
              {(step === 3 || step === 4) && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Home you can afford</p>
                  <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-white">{usd(price)}</p>
                  <p className="mt-2 text-sm text-white/55">at about {usd(payment)}/mo all-in</p>
                  <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
                    <SRow label="Principal & interest" value={`${usd(pi)}/mo`} />
                    <SRow label="Property taxes" value={`${usd(tax)}/mo`} />
                    <SRow label="Home insurance (est.)" value={`${usd(ins)}/mo`} />
                    {pmi > 0 && <SRow label="PMI (under 20% down)" value={`${usd(pmi)}/mo`} />}
                    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                      <span className="font-semibold text-white">Estimated payment</span>
                      <span className="font-display text-xl font-semibold text-accent">{usd(payment)}/mo</span>
                    </div>
                  </div>
                </>
              )}

              <button type="button" onClick={downloadBudget} className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-accent hover:text-accent"><Download className="h-4 w-4" /> Download my budget</button>
            </div>

            {step === 2 && (
              <div className="mt-4 rounded-sm bg-[#0a1424] p-6 text-white/80 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)] ring-1 ring-accent/20 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent"><Handshake className="h-4 w-4" /> Not sure on loan type?</p>
                <p className="mt-3 text-sm leading-relaxed text-white/75">Reach out to my preferred lenders and they'll walk you through which loan best suits your needs.</p>
                <Link to="/resources/lenders" className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">Meet my preferred lenders <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Closing contact CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-10">
        <div className="rounded-sm border border-border bg-secondary/40 p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">Want a second set of eyes on your numbers?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Reach out anytime and I'll help you turn these numbers into a plan, and run them on real homes when you're ready to look.</p>
          <p className="mt-5 text-sm text-muted-foreground">
            <a href="tel:+14144581952" className="font-semibold text-foreground transition-colors hover:text-accent">(414) 458-1952</a>
            <span className="mx-2 text-border">·</span>
            <a href="mailto:lucas.murphy@exprealty.com" className="font-semibold text-foreground transition-colors hover:text-accent">lucas.murphy@exprealty.com</a>
          </p>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}

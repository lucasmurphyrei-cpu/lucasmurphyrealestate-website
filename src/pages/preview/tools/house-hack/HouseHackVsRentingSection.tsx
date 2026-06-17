import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import type {
  OwnerOccupiedReturnsDerived,
  OwnerOccupiedExtras,
  InvestmentDerived,
  FinancingType,
} from "@/pages/tools/house-hack/types";
import { calcMonthlyPrincipalSchedule, formatCurrency, formatCurrencyDetailed } from "@/pages/tools/house-hack/calculations";
import { PreviewInputField, PreviewResultRow, SectionCard, SectionTitle, InfoTip } from "./previewUi";

interface HouseHackVsRentingSectionProps {
  ownerReturns: OwnerOccupiedReturnsDerived;
  ownerExtras: OwnerOccupiedExtras;
  onUpdateOwnerExtras: (field: "currentRent" | "appreciationPercent" | "rentGrowthPercent", value: number) => void;
  purchasePrice: number;
  investmentDerived: InvestmentDerived;
  interestRate: number;
  financingType: FinancingType;
  effectiveMonthlyIncome: number;
  onSwitchToAllUnits: () => void;
}

interface YearProjection {
  year: number;
  yearRent: number;
  yearHackCost: number;
  yearRentSaved: number;
  yearEquity: number;
  yearAdvantage: number;
  cumulativeRent: number;
  cumulativeHousingCost: number;
  rentSaved: number;
  totalAppreciation: number;
  totalPrincipalPaydown: number;
  totalEquityBuilt: number;
  netAdvantage: number;
}

const MILESTONE_YEARS = [1, 2, 3, 5, 10];

const HouseHackVsRentingSection = ({
  ownerReturns,
  ownerExtras,
  onUpdateOwnerExtras,
  purchasePrice,
  investmentDerived,
  interestRate,
  financingType,
  effectiveMonthlyIncome,
  onSwitchToAllUnits,
}: HouseHackVsRentingSectionProps) => {
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [showProjection, setShowProjection] = useState(true);
  const isCash = financingType === "cash";

  const annualAppreciation = purchasePrice * (ownerExtras.appreciationPercent / 100);

  const principalSchedule = useMemo(() => {
    if (isCash) return [];
    return calcMonthlyPrincipalSchedule(investmentDerived.totalLoan, interestRate, investmentDerived.monthlyPI);
  }, [isCash, investmentDerived.totalLoan, interestRate, investmentDerived.monthlyPI]);

  const yearOnePrincipalPaydown = principalSchedule.reduce((sum, row) => sum + row.principalPayment, 0);

  const projections = useMemo<YearProjection[]>(() => {
    const g = ownerExtras.rentGrowthPercent / 100;
    const appRate = ownerExtras.appreciationPercent / 100;
    const monthlyRate = interestRate / 100 / 12;
    const fixedMonthlyCost = ownerReturns.effectiveHousingCost + effectiveMonthlyIncome;

    const maxYear = MILESTONE_YEARS[MILESTONE_YEARS.length - 1];
    const yearlyRent: number[] = [];
    const yearlyHackCost: number[] = [];
    const yearlyAppreciation: number[] = [];
    const yearlyPrincipal: number[] = [];

    for (let y = 0; y < maxYear; y++) {
      yearlyRent.push(ownerExtras.currentRent * Math.pow(1 + g, y) * 12);
      const yearTenantIncome = effectiveMonthlyIncome * Math.pow(1 + g, y);
      const yearMonthlyCost = fixedMonthlyCost - yearTenantIncome;
      yearlyHackCost.push(Math.max(0, yearMonthlyCost) * 12);
    }
    for (let y = 0; y < maxYear; y++) {
      const prevValue = purchasePrice * Math.pow(1 + appRate, y);
      yearlyAppreciation.push(prevValue * appRate);
    }
    if (!isCash && investmentDerived.totalLoan > 0 && investmentDerived.monthlyPI > 0) {
      let balance = investmentDerived.totalLoan;
      for (let y = 0; y < maxYear; y++) {
        let yearPD = 0;
        for (let m = 0; m < 12; m++) {
          if (balance <= 0) break;
          const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
          const principal = investmentDerived.monthlyPI - interest;
          yearPD += principal;
          balance -= principal;
        }
        yearlyPrincipal.push(yearPD);
      }
    } else {
      for (let y = 0; y < maxYear; y++) yearlyPrincipal.push(0);
    }

    return MILESTONE_YEARS.map((targetYear) => {
      const yIdx = targetYear - 1;
      const yearRent = yearlyRent[yIdx] || 0;
      const yearHackCost = yearlyHackCost[yIdx] || 0;
      const yearRentSaved = yearRent - yearHackCost;
      const yearEquity = (yearlyAppreciation[yIdx] || 0) + (yearlyPrincipal[yIdx] || 0);
      const yearAdvantage = yearRentSaved + yearEquity;

      let cumulativeRent = 0, cumulativeHousingCost = 0, totalAppreciation = 0, totalPrincipalPaydown = 0;
      for (let y = 0; y < targetYear; y++) {
        cumulativeRent += yearlyRent[y] || 0;
        cumulativeHousingCost += yearlyHackCost[y] || 0;
        totalAppreciation += yearlyAppreciation[y] || 0;
        totalPrincipalPaydown += yearlyPrincipal[y] || 0;
      }
      const rentSaved = cumulativeRent - cumulativeHousingCost;
      const totalEquityBuilt = totalAppreciation + totalPrincipalPaydown;
      const netAdvantage = rentSaved + totalEquityBuilt;

      return { year: targetYear, yearRent, yearHackCost, yearRentSaved, yearEquity, yearAdvantage, cumulativeRent, cumulativeHousingCost, rentSaved, totalAppreciation, totalPrincipalPaydown, totalEquityBuilt, netAdvantage };
    });
  }, [ownerExtras.currentRent, ownerExtras.rentGrowthPercent, ownerExtras.appreciationPercent, effectiveMonthlyIncome, investmentDerived, interestRate, purchasePrice, isCash, ownerReturns.effectiveHousingCost]);

  const year1 = projections[0];

  return (
    <SectionCard>
      <SectionTitle sub="Compare your house hack to renting — including the wealth-building benefits renters miss.">
        5. House-Hacking vs. Renting
      </SectionTitle>
      <div className="space-y-4">
        <PreviewInputField
          label="Your Current Rent / Housing Cost"
          value={ownerExtras.currentRent}
          onChange={(v) => onUpdateOwnerExtras("currentRent", v)}
          prefix="$"
          useCommas
          placeholder="Enter your current rent"
          info="Enter what you currently pay per month for rent/housing. This is used to calculate how much you'd save by house hacking compared to your current situation."
        />

        <div>
          <PreviewResultRow label="Your Effective Housing Cost" value={ownerReturns.effectiveHousingCost} format="currency" colorCode size="large" benchmark="What you actually pay per month after rental income" />
          <PreviewResultRow label="Monthly Savings vs. Renting" value={ownerReturns.houseHackSavings} format="currency" colorCode />
          <PreviewResultRow label="Annual Savings vs. Renting" value={ownerReturns.annualSavings} format="currency" colorCode />
        </div>

        <hr className="border-border" />

        <PreviewInputField
          label="Estimated Annual Appreciation (%)"
          value={ownerExtras.appreciationPercent}
          onChange={(v) => onUpdateOwnerExtras("appreciationPercent", v)}
          suffix="%"
          step={0.5}
          info="Historical average home appreciation is 3-5% annually. The Milwaukee metro has averaged 4-7% in recent years. Conservative estimate: 3%. This represents the increase in your property's value each year — equity you build just by owning."
        />
        <PreviewResultRow label="Estimated Year 1 Appreciation" value={annualAppreciation} format="currency" benchmark="Projected increase in your property's value" />

        {!isCash && (
          <>
            <hr className="border-border" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Principal Paydown (Year 1)</p>
                <button type="button" onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)} className="flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:text-foreground">
                  {showMonthlyBreakdown ? "Hide" : "Show"} Monthly
                  {showMonthlyBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>
              <PreviewResultRow label="Year 1 Total Principal Paydown" value={yearOnePrincipalPaydown} format="currency" size="large" benchmark="Equity built from mortgage payments — renters get $0 of this" />
              <PreviewResultRow label="Avg. Monthly Principal Paydown" value={yearOnePrincipalPaydown / 12} format="currency" />

              {showMonthlyBreakdown && principalSchedule.length > 0 && (
                <div className="overflow-hidden rounded-sm border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-secondary/60">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Mo.</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Principal</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Interest</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {principalSchedule.map((row) => (
                        <tr key={row.month} className="border-t border-border/60">
                          <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{row.month}</td>
                          <td className="px-3 py-1.5 text-right font-medium tabular-nums text-emerald-600">{formatCurrencyDetailed(row.principalPayment)}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{formatCurrencyDetailed(row.interestPayment)}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{formatCurrency(row.remainingBalance)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-border bg-secondary/40 font-medium">
                        <td className="px-3 py-2">Total</td>
                        <td className="px-3 py-2 text-right tabular-nums text-emerald-600">{formatCurrencyDetailed(yearOnePrincipalPaydown)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatCurrencyDetailed(principalSchedule.reduce((s, r) => s + r.interestPayment, 0))}</td>
                        <td className="px-3 py-2" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="rounded-sm bg-secondary/50 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-bold text-accent">i</span> Every mortgage payment builds equity in your property. Even if your monthly cash flow is slightly negative, you're still building wealth through principal paydown. Renters pay their landlord's mortgage — as an owner, you pay your own.
                </p>
              </div>
            </div>
          </>
        )}

        <hr className="border-border" />

        {ownerExtras.currentRent > 0 && year1 && (
          <>
            <div className="space-y-3 rounded-sm border border-accent/20 bg-accent/[0.06] p-4">
              <p className="text-sm font-semibold">Year 1 Summary: Renting vs. House-Hacking</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="font-medium text-red-600">Renting <span className="font-normal italic text-muted-foreground">{formatCurrency(year1.cumulativeRent / 12)}/mo</span></p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total paid</span><span className="font-medium tabular-nums text-red-600">{formatCurrency(year1.cumulativeRent)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Appreciation</span><span className="tabular-nums text-muted-foreground">$0</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Principal paydown</span><span className="tabular-nums text-muted-foreground">$0</span></div>
                  <div className="flex justify-between border-t border-border/60 pt-2"><span className="text-muted-foreground">= Equity built</span><span className="font-medium tabular-nums text-muted-foreground">$0</span></div>
                  <div className="flex justify-between border-t border-border/60 pt-2"><span className="text-muted-foreground">Net position</span><span className="font-semibold tabular-nums text-red-600">-{formatCurrency(year1.cumulativeRent)}</span></div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-emerald-600">House-Hacking <span className="font-normal italic text-muted-foreground">{formatCurrency(year1.cumulativeHousingCost / 12)}/mo</span></p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total paid</span><span className="font-medium tabular-nums">{formatCurrency(year1.cumulativeHousingCost)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Appreciation</span><span className="tabular-nums text-emerald-600">+{formatCurrency(year1.totalAppreciation)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Principal paydown</span><span className="tabular-nums text-emerald-600">+{formatCurrency(year1.totalPrincipalPaydown)}</span></div>
                  <div className="flex justify-between border-t border-border/60 pt-2"><span className="text-muted-foreground">= Equity built</span><span className="font-medium tabular-nums text-emerald-600">+{formatCurrency(year1.totalEquityBuilt)}</span></div>
                  <div className="flex justify-between border-t border-border/60 pt-2"><span className="text-muted-foreground">Net position</span><span className="font-semibold tabular-nums text-emerald-600">+{formatCurrency(year1.totalEquityBuilt - year1.cumulativeHousingCost)}</span></div>
                </div>
              </div>
              <div className="border-t border-border/60 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">Year 1 Advantage</span>
                    <InfoTip text="This advantage does not include the upfront costs of purchasing the property (down payment, closing costs) or money spent on initial repairs. It represents how much better off you are compared to renting over this period — factoring in rent savings, appreciation, and principal paydown." />
                  </div>
                  <span className="text-lg font-bold tracking-tight tabular-nums text-emerald-600">+{formatCurrency(year1.netAdvantage)}</span>
                </div>
              </div>
            </div>
            <hr className="border-border" />
          </>
        )}

        {ownerExtras.currentRent > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Long-Term Wealth Projection</p>
              <button type="button" onClick={() => setShowProjection(!showProjection)} className="flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:text-foreground">
                {showProjection ? "Hide" : "Show"}
                {showProjection ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PreviewInputField label="Annual Rent Growth (%)" value={ownerExtras.rentGrowthPercent} onChange={(v) => onUpdateOwnerExtras("rentGrowthPercent", v)} suffix="%" step={0.5} info="Average rent growth nationally is 3-5% per year. This rate applies equally to what a renter would pay AND what your tenants pay — so your rental income grows over time while your fixed mortgage stays the same." />
              <PreviewInputField label="Annual Appreciation (%)" value={ownerExtras.appreciationPercent} onChange={(v) => onUpdateOwnerExtras("appreciationPercent", v)} suffix="%" step={0.5} infoAlign="right" info="Historical average home appreciation is 3-5% annually. The Milwaukee metro has averaged 4-7% in recent years. This is synced with the appreciation input above." />
            </div>

            {showProjection && (
              <>
                <div className="overflow-x-auto overflow-hidden rounded-sm border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-secondary/60">
                        <th className="px-1.5 py-2 text-left font-medium text-muted-foreground">Year</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">Rent Paid</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">House-Hack Cost</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">Rent Saved</th>
                        <th className="px-0.5 py-2 text-center font-medium text-muted-foreground/40">+</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">Equity</th>
                        <th className="px-0.5 py-2 text-center font-medium text-muted-foreground/40">=</th>
                        <th className="px-1.5 py-2 text-right font-medium text-emerald-600">Advantage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((p) => (
                        <tr key={p.year} className="border-t border-border/60">
                          <td className="px-1.5 py-2 font-medium tabular-nums">{p.year}yr</td>
                          <td className="px-1.5 py-2 text-right tabular-nums text-red-600">{formatCurrency(p.yearRent)}</td>
                          <td className="px-1.5 py-2 text-right tabular-nums text-muted-foreground">{formatCurrency(p.yearHackCost)}</td>
                          <td className="px-1.5 py-2 text-right tabular-nums text-emerald-600/80">{formatCurrency(p.yearRentSaved)}</td>
                          <td className="px-0.5 py-2 text-center text-muted-foreground/30">+</td>
                          <td className="px-1.5 py-2 text-right tabular-nums text-emerald-600/80">{formatCurrency(p.yearEquity)}</td>
                          <td className="px-0.5 py-2 text-center text-muted-foreground/30">=</td>
                          <td className="px-1.5 py-2 text-right font-semibold tabular-nums text-emerald-600">+{formatCurrency(p.yearAdvantage)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(() => {
                  const last = projections[projections.length - 1];
                  if (!last) return null;
                  return (
                    <div className="space-y-1.5 rounded-sm border border-border/60 bg-secondary/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">{last.year}-Year Total Advantage Breakdown</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Rent Saved</span><span className="font-medium tabular-nums text-emerald-600">{formatCurrency(last.rentSaved)}</span></div>
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Appreciation Gains</span><span className="font-medium tabular-nums text-emerald-600">{formatCurrency(last.totalAppreciation)}</span></div>
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Principal Paydown</span><span className="font-medium tabular-nums text-emerald-600">{formatCurrency(last.totalPrincipalPaydown)}</span></div>
                        <div className="mt-1.5 flex items-center justify-between border-t border-border/60 pt-1.5"><span className="font-medium">= Total {last.year}-Year Advantage</span><span className="font-bold tabular-nums text-emerald-600">+{formatCurrency(last.netAdvantage)}</span></div>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2 rounded-sm bg-secondary/50 p-3">
                  <p className="text-xs font-medium text-foreground">Why it keeps getting better</p>
                  <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">Rent keeps rising.</span> At {ownerExtras.rentGrowthPercent}% annual growth, a ${ownerExtras.currentRent.toLocaleString()}/mo rent becomes ${Math.round(ownerExtras.currentRent * Math.pow(1 + ownerExtras.rentGrowthPercent / 100, 10)).toLocaleString()}/mo in 10 years. Your mortgage payment? It stays the same.</p>
                  <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">Appreciation compounds.</span> Like a savings account, your home value grows on last year's higher value — not the original price. At {ownerExtras.appreciationPercent}%, a {formatCurrency(purchasePrice)} property is worth {formatCurrency(purchasePrice * Math.pow(1 + ownerExtras.appreciationPercent / 100, 10))} in 10 years.</p>
                  <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">Principal paydown accelerates.</span> With each payment, more goes to principal and less to interest. In the early years most of your payment is interest, but it shifts over time — building equity faster the longer you own.</p>
                </div>
              </>
            )}
          </div>
        )}

        <hr className="border-border" />

        {investmentDerived.initialInvestment > 0 && year1 && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-semibold">How Does This Compare?</p>
              <p className="text-xs text-muted-foreground">If you invested {formatCurrency(investmentDerived.initialInvestment)} (your initial investment) elsewhere instead:</p>
              {(() => {
                const initial = investmentDerived.initialInvestment;
                const houseHackTotalReturn = ownerReturns.annualSavings + annualAppreciation + yearOnePrincipalPaydown;
                const houseHackROI = initial > 0 ? (houseHackTotalReturn / initial) * 100 : 0;
                const sp500Rate = 10, btcRate = 30;
                const sp500Return = initial * (sp500Rate / 100);
                const btcReturn = initial * (btcRate / 100);
                return (
                  <div className="overflow-hidden rounded-sm border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-secondary/60">
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Investment</th>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground">Avg. Annual Return</th>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground">Year 1 Gain</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border/60 bg-emerald-500/[0.08]">
                          <td className="px-3 py-2 font-medium text-emerald-600">House Hack</td>
                          <td className="px-3 py-2 text-right font-semibold tabular-nums text-emerald-600">{houseHackROI.toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right font-semibold tabular-nums text-emerald-600">{formatCurrency(houseHackTotalReturn)}</td>
                        </tr>
                        <tr className="border-t border-border/60">
                          <td className="px-3 py-2 font-medium text-muted-foreground">S&amp;P 500</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{sp500Rate}%</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatCurrency(sp500Return)}</td>
                        </tr>
                        <tr className="border-t border-border/60">
                          <td className="px-3 py-2 font-medium text-muted-foreground">Bitcoin (10yr avg)</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{btcRate}%</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatCurrency(btcReturn)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="border-t border-border/60 bg-secondary/40 px-3 py-2">
                      <p className="text-[10px] text-muted-foreground/70">S&amp;P 500 based on historical average (~10%). Bitcoin based on 10-year annualized average (~30%). Past performance does not guarantee future results. House hack return includes rent savings, appreciation, and principal paydown.</p>
                    </div>
                  </div>
                );
              })()}
            </div>
            <hr className="border-border" />
          </>
        )}

        <div className="space-y-1.5 rounded-sm bg-secondary/50 p-3">
          <p className="text-xs font-medium">Note: Tax Benefits</p>
          <p className="text-xs leading-relaxed text-muted-foreground">As a house hack owner, you may also benefit from mortgage interest deductions, property tax deductions, depreciation on the rental portion, and deducting operating expenses. These tax advantages can further improve your effective returns. Consult a tax professional for specifics on your situation.</p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2 rounded-sm border border-accent/30 bg-accent/[0.06] p-4">
          <p className="text-center text-sm font-semibold">You need a place to live — why not make it an investment?</p>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">Everyone pays for housing. The difference is whether that money builds wealth for you or your landlord. A house hack lets you live for less (or free), build equity through appreciation and principal paydown, and set yourself up with a cash-flowing rental when you're ready to move on. It's not just a home — it's your first investment property.</p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2 rounded-sm border border-accent/30 bg-accent/[0.06] p-4 text-center">
          <p className="text-sm font-medium">What happens when you move out?</p>
          <p className="text-xs text-muted-foreground">See how this property stacks up as a true rental property with all units generating income.</p>
          <button type="button" onClick={onSwitchToAllUnits} className="group mt-2 inline-flex items-center gap-1.5 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">
            View All Units Rented Out <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </SectionCard>
  );
};

export default HouseHackVsRentingSection;

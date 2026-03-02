import { Button } from "@/components/ui/button";
import { COUNTY_TAX_RATES } from "./defaults";
import { calcCountyTax, formatCurrencyDetailed } from "./calculations";

interface TaxCalculatorProps {
  purchasePrice: number;
  selectedCounty: string | null;
  onSelect: (countyKey: string, monthlyTax: number) => void;
}

const TaxCalculator = ({ purchasePrice, selectedCounty, onSelect }: TaxCalculatorProps) => {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <p className="text-xs font-medium text-muted-foreground mb-3">Quick Tax Estimate by County</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(COUNTY_TAX_RATES).map(([key, county]) => {
          const monthly = calcCountyTax(purchasePrice, county.rate);
          const isSelected = selectedCounty === key;
          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-primary hover:text-primary-foreground"
              }`}
              onClick={() => onSelect(key, Math.round(monthly))}
            >
              {county.name} ({county.rate}%) — {formatCurrencyDetailed(monthly)}/mo
            </Button>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-2.5 leading-relaxed">
        These are approximate average county rates. Actual taxes vary by municipality and property assessment.
        Reach out to me if you want to know exactly what the taxes on a specific property should be!
      </p>
    </div>
  );
};

export default TaxCalculator;

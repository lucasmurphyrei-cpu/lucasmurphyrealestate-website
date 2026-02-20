import { TrendingUp } from "lucide-react";

const MarketDataSection = () => {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Milwaukee Metro Market at a Glance
          </h2>
        </div>
        <p className="text-foreground/70 font-sans text-lg leading-relaxed mb-8">
          Milwaukee Metro remains one of the Midwest's most affordable and opportunity-rich housing markets, with entry-level pricing around the <strong className="text-foreground">mid-$200,000 range</strong> and continued steady demand. Home values have appreciated at a sustainable pace, making it an ideal market for first-time buyers who want to build equity without overextending.
        </p>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary font-display">~$265K</p>
            <p className="text-sm text-muted-foreground font-sans mt-1">Median Entry Price</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary font-display">5.8%</p>
            <p className="text-sm text-muted-foreground font-sans mt-1">Annual Appreciation</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary font-display">25–45</p>
            <p className="text-sm text-muted-foreground font-sans mt-1">Days to Close</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketDataSection;

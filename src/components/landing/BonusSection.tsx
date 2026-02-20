import { Calculator, Search, MapPin, Phone } from "lucide-react";

const bonuses = [
  { icon: Calculator, title: "Affordability Breakdown", desc: "Personalized numbers based on your income and debt" },
  { icon: Search, title: "Custom MLS Search", desc: "Homes matching your criteria sent directly to you" },
  { icon: MapPin, title: "Neighborhood Guide", desc: "Recommendations based on your budget and lifestyle" },
  { icon: Phone, title: "Strategy Call", desc: "Optional free 15-min first-time buyer strategy call" },
];

const BonusSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Bonus When You Download
        </h2>
        <p className="text-center text-muted-foreground font-sans mb-12">Absolutely no obligation — just helpful resources.</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {bonuses.map((bonus, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-light-blue/15 flex items-center justify-center mb-4">
                <bonus.icon className="h-6 w-6 text-light-blue" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1 font-sans">{bonus.title}</h3>
              <p className="text-muted-foreground font-sans text-sm">{bonus.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BonusSection;

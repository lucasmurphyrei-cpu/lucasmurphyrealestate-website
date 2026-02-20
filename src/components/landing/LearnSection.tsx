import {
  DollarSign, Percent, HandCoins, Calculator, CalendarClock,
  SearchCheck, TrendingUp, MapPin, ShieldAlert,
} from "lucide-react";

const items = [
  { icon: DollarSign, text: "How much home you can actually afford in Milwaukee Metro" },
  { icon: Percent, text: "How to buy with as little as 3% down" },
  { icon: HandCoins, text: "How to access up to $10,000 in down payment assistance" },
  { icon: Calculator, text: "The true monthly cost of owning beyond your mortgage payment" },
  { icon: CalendarClock, text: "Step-by-step breakdown of the 25–45 day buying timeline" },
  { icon: SearchCheck, text: "Inspection negotiation strategies specific to Southeast Wisconsin homes" },
  { icon: TrendingUp, text: "How rising rates impact your buying power" },
  { icon: MapPin, text: "Which neighborhoods offer the best value for first-time buyers" },
  { icon: ShieldAlert, text: "How to avoid the most common (and expensive) mistakes" },
];

const LearnSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          What You'll Learn Inside
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-xl bg-cream border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-foreground font-sans text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnSection;

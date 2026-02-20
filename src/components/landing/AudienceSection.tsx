import { CheckCircle2 } from "lucide-react";

const items = [
  "You're renting in Southeast Wisconsin",
  "You plan to buy within the next 6–24 months",
  "You want to understand real numbers before talking to a lender",
  "You're relocating to Milwaukee",
  "You want clarity before committing",
];

const AudienceSection = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-white">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          This Guide Is Perfect For You If…
        </h2>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-left font-sans text-lg text-white/85">
              <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;

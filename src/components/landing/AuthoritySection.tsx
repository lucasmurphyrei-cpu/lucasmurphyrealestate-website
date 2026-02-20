import { Building2, Users, BarChart3, MapPin } from "lucide-react";
import lucasHeadshot from "@/assets/lucas-murphy-headshot.jpeg";

const credentials = [
  { icon: Building2, label: "eXp Realty" },
  { icon: Users, label: "Provision Properties Core Team" },
  { icon: BarChart3, label: "Local market data from Metro MLS" },
  { icon: MapPin, label: "Specializing in Milwaukee Metro counties" },
];

const AuthoritySection = () => {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Why I Created This Guide
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Headshot placeholder */}
          <div className="flex-shrink-0 w-48 h-48 rounded-full border-4 border-gold/40 overflow-hidden">
            <img src={lucasHeadshot} alt="Lucas Murphy, Realtor" className="w-full h-full object-cover" />
          </div>

          <div>
            <blockquote className="text-lg text-foreground/80 font-sans leading-relaxed mb-8 italic">
              "I work with first-time buyers across Milwaukee Metro every day. I saw the same confusion, the same fear of making a mistake, and the same questions about rates and down payments. So I created the exact guide I wish every buyer had before writing their first offer."
            </blockquote>
            <p className="font-bold text-foreground text-lg font-sans mb-1">— Lucas Murphy</p>
            <p className="text-muted-foreground font-sans text-sm mb-6">Realtor® – eXp Realty | Milwaukee, WI</p>

            <div className="grid grid-cols-2 gap-3">
              {credentials.map((cred, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 font-sans">
                  <cred.icon className="h-4 w-4 text-gold flex-shrink-0" />
                  <span>{cred.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;

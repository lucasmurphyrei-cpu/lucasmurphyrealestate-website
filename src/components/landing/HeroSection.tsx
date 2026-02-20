import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ArrowDown } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import milwaukeeSkyline from "@/assets/milwaukee-skyline.jpg";

const HeroSection = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [timeline, setTimeline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        full_name: fullName.trim(),
        email: email.trim(),
        timeline: timeline || null,
      });

      if (error) throw error;

      // Trigger PDF download
      const link = document.createElement("a");
      link.href = "/Your_First_Time_Home_Buyers_Guide_to_The_Milwaukee_Metro_Area.pdf";
      link.download = "First_Time_Home_Buyers_Guide_Milwaukee_Metro.pdf";
      link.click();

      toast.success("Your guide is downloading!");
      setFullName("");
      setEmail("");
      setTimeline("");
    } catch (err) {
      console.error("Lead capture error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen text-white overflow-hidden">
      {/* Milwaukee skyline background */}
      <div className="absolute inset-0">
        <img
          src={milwaukeeSkyline}
          alt="Milwaukee skyline at dusk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-light-blue text-white border-0 text-sm font-sans font-medium px-4 py-1.5 hover:bg-light-blue-hover">
            Updated for 2026 Market Conditions
          </Badge>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            The Complete First-Time Home Buyer Guide to Milwaukee Metro
            <span className="block text-light-blue mt-2 text-2xl md:text-3xl lg:text-4xl font-bold">
              (2026 Edition)
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-4 max-w-2xl mx-auto font-sans">
            Everything you need to know before buying your first home in Milwaukee, Waukesha, Ozaukee, or Washington County — including down payment assistance, real affordability numbers, and local market insight.
          </p>

          <p className="text-base text-white/60 mb-10 max-w-xl mx-auto font-sans">
            If you're renting and wondering when — or how — to buy your first home, this guide was written specifically for you.
          </p>

          {/* Opt-in Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 text-base"
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 text-base"
              required
            />
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="flex h-12 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-base text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" className="text-foreground">Planning to buy soon? (Optional)</option>
              <option value="6-months" className="text-foreground">Within 6 months</option>
              <option value="6-12-months" className="text-foreground">6–12 months</option>
              <option value="12-24-months" className="text-foreground">12–24 months</option>
              <option value="just-exploring" className="text-foreground">Just exploring</option>
            </select>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold bg-light-blue hover:bg-light-blue-hover text-white rounded-lg shadow-lg font-sans"
            >
              {isSubmitting ? "Sending..." : "Get My Free Guide"}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-sm text-white/50 font-sans">
              <Shield className="h-3.5 w-3.5" />
              No spam. Just real market guidance.
            </p>
          </form>

          <div className="mt-16 animate-bounce">
            <ArrowDown className="h-6 w-6 mx-auto text-white/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

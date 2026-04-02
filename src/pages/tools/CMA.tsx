import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/email-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Tag,
  Handshake,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import lucasHeadshot from "@/assets/lucas-murphy-headshot.jpeg";
import provisionLogo from "@/assets/provision-logo.png";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const CMA = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      propertyAddress: formData.get("propertyAddress") as string,
      recentUpdates: formData.get("recentUpdates") as string,
      additionalInfo: formData.get("additionalInfo") as string,
      source: "CMA Request",
      timestamp: new Date().toISOString(),
    };

    try {
      if (!GOOGLE_SHEETS_URL) {
        throw new Error("Form endpoint not configured");
      }

      const params = new URLSearchParams();
      params.append("name", `${data.firstName} ${data.lastName}`);
      params.append("email", data.email);
      params.append("phone", data.phone);
      params.append(
        "message",
        `[CMA REQUEST]\nProperty: ${data.propertyAddress}\n\nRecent Updates: ${data.recentUpdates || "None listed"}\n\nAdditional Info: ${data.additionalInfo || "None"}`
      );
      params.append("timestamp", data.timestamp);

      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: params,
      });

      toast({
        title: "CMA request submitted!",
        description:
          "I'll prepare your personalized Comparative Market Analysis and reach out shortly.",
      });
      form.reset();
    } catch {
      toast({
        title: "Something went wrong",
        description:
          "Please try again or call us directly at (414)-269-4909.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Free Comparative Market Analysis (CMA) | Lucas Murphy Real Estate
        </title>
        <meta
          name="description"
          content="Request a free, personalized Comparative Market Analysis for your Metro Milwaukee home. Find out what your property is really worth — not just what Zillow or Redfin says."
        />
        <link
          rel="canonical"
          href="https://www.lucasmurphyrealestate.com/tools/cma"
        />
      </Helmet>

      {/* Hero */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container py-16 text-center md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BarChart3 className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
              Free Comparative Market Analysis
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Find out what your home is actually worth — based on real,
              local market data, not an algorithm's best guess.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is a CMA */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl font-bold">
              What Is a CMA?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A <strong>Comparative Market Analysis (CMA)</strong> is a
              detailed report prepared by a real estate professional that
              estimates your home's value by comparing it to similar
              properties that have recently sold, are currently listed, or
              failed to sell in your area. Unlike automated online estimates,
              a CMA accounts for the specific features, condition, and
              location details that only a local agent can evaluate in
              person.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Think of it as the difference between a doctor diagnosing you
              in person versus WebMD giving you a guess based on your
              symptoms. Both have a role — but when it comes to making a
              decision worth hundreds of thousands of dollars, you want the
              real thing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Zillow/Redfin are off */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-amber-500" />
                <h2 className="font-display text-3xl font-bold">
                  Why Zillow, Redfin & Realtor.com Get It Wrong
                </h2>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Ever notice how Zillow says your home is worth $320,000,
                Redfin says $295,000, and Realtor.com says $340,000? That's
                not a rounding error — it's because each site uses a
                different algorithm (called an{" "}
                <strong>Automated Valuation Model</strong>, or AVM) that
                pulls from different data sources with different
                methodologies.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="mt-8"
            >
              <h3 className="font-display text-xl font-semibold">
                Here's what these algorithms can't do:
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Walk through your home and see the $40,000 kitchen renovation you just completed",
                  "Know that your neighbor's \"comparable\" sale was actually a distressed sale or estate liquidation",
                  "Account for the premium buyers pay for your specific street, view, or lot size",
                  "Understand local micro-market trends — like the difference between two subdivisions a mile apart",
                  "Factor in the current buyer demand and competition level in your price range",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Zillow itself publishes that their "Zestimate" has a{" "}
                <strong>median error rate of around 6-7%</strong> nationally.
                On a $350,000 home, that's a swing of{" "}
                <strong>$21,000 to $24,500</strong> in either direction. In
                some markets and for some property types, the error is
                significantly larger. That margin can mean the difference
                between pricing correctly and sitting on the market for
                months.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Value vs Listing Price vs Sale Price */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl font-bold">
              Market Value vs. List Price vs. Sale Price
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              These three terms get thrown around interchangeably, but they
              mean very different things — and understanding the distinction
              is critical when you're selling your home.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6">
            {[
              {
                icon: DollarSign,
                title: "Market Value",
                desc: "The price a knowledgeable buyer would pay and a knowledgeable seller would accept — assuming neither is under pressure and both have reasonable knowledge of the relevant facts. This is what a CMA estimates. It's the anchor point for every pricing decision you'll make.",
              },
              {
                icon: Tag,
                title: "List Price",
                desc: "The price you and your agent decide to put on the listing. This is a strategic decision, not just a number. Price too high, and you scare off buyers and accumulate days on market. Price too low, and you leave money on the table. The best list price is informed by market value but also factors in current competition, buyer demand, and your timeline.",
              },
              {
                icon: Handshake,
                title: "Sale Price",
                desc: "What a buyer actually pays at closing. In a competitive market, sale prices often exceed list price through multiple offers. In a slower market, buyers negotiate below asking. The gap between list price and sale price tells you a lot about how accurately a home was priced — and how strong the market is.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex gap-5 p-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="mt-8 text-muted-foreground leading-relaxed"
          >
            A professional CMA helps you understand where your home's{" "}
            <strong>market value</strong> sits so you can set a strategic{" "}
            <strong>list price</strong> that maximizes your{" "}
            <strong>sale price</strong>. It's the foundation of a smart
            selling strategy.
          </motion.p>
        </div>
      </section>

      {/* What you get */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="font-display text-3xl font-bold">
                What You'll Get in Your Free CMA
              </h2>
            </motion.div>
            <div className="mt-8 space-y-4">
              {[
                "Analysis of recent comparable sales in your neighborhood",
                "Active and pending listings you're competing against",
                "Expired and withdrawn listings — what didn't work and why",
                "Adjustments for your home's unique features, upgrades, and condition",
                "A suggested price range based on current market conditions",
                "An overview of local market trends — days on market, sale-to-list ratios, and inventory levels",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-muted-foreground">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold">
              Request Your Free CMA
            </h2>
            <p className="mt-3 text-muted-foreground">
              Fill out the form below and I'll prepare a personalized
              Comparative Market Analysis for your property — completely free
              and with no obligation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <Card className="mt-10">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(414) 555-0123"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <EmailInput
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">
                      Property Address *
                    </Label>
                    <Input
                      id="propertyAddress"
                      name="propertyAddress"
                      placeholder="123 Main St, Milwaukee, WI 53202"
                      required
                    />
                  </div>

                  <div className="rounded-lg border border-border bg-secondary/30 p-6">
                    <p className="text-sm font-semibold text-foreground">
                      Help me provide a more accurate analysis:
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Optional, but the more I know, the better your CMA
                      will be.
                    </p>

                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recentUpdates">
                          Recent updates or renovations
                        </Label>
                        <Textarea
                          id="recentUpdates"
                          name="recentUpdates"
                          placeholder="e.g., New roof in 2024, kitchen remodel, finished basement, new HVAC system..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">
                          Anything else I should know about the property?
                        </Label>
                        <Textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          placeholder="e.g., Timeline for selling, unique features, concerns about the property..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        Request My Free CMA
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    No obligation. No spam. Just a straightforward analysis
                    of what your home is worth.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Branding / Contact CTA */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-10 md:flex-row md:items-start"
          >
            <div className="flex-shrink-0">
              <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-primary/30">
                <img
                  src={lucasHeadshot}
                  alt="Lucas Murphy, Realtor"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl font-bold">
                Lucas Murphy
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Realtor® — eXp Realty | Provision Properties Core Team
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  PSA Certified — Pricing Strategy Advisor
                </span>
              </div>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                I hold the <strong className="text-foreground">Pricing Strategy Advisor (PSA)</strong> certification
                from the National Association of Realtors — a designation earned through
                advanced training in pricing properties using comparative market analysis,
                evaluating multiple offers, and understanding the nuances that drive real
                estate valuations. It means I don't just pull comps and hand you a number.
                I analyze how factors like location adjustments, market concessions, financing
                terms, and property condition translate into real-world pricing — so your
                home is positioned to attract the right buyers at the right price.
              </p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                I prepare every CMA by hand — reviewing each comparable,
                adjusting for your home's specific features, and analyzing
                current market conditions. No automated reports, no generic
                PDFs. Just an honest, data-driven look at what your home is
                worth.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="tel:4142694909"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  (414)-269-4909
                </a>
                <a
                  href="mailto:lucas.murphy@exprealty.com"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  lucas.murphy@exprealty.com
                </a>
                <a
                  href="https://calendly.com/lucasmurphyrei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Calendar className="h-4 w-4 text-primary" />
                  Schedule a Consultation
                </a>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button asChild>
                  <Link to="/contact" className="gap-2">
                    Get In Touch <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Browse All Resources</Link>
                </Button>
              </div>
            </div>

            <div className="flex-shrink-0 self-center md:self-start">
              <img
                src={provisionLogo}
                alt="Provision Properties Core Team logo"
                className="h-32 w-auto md:h-40"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CMA;

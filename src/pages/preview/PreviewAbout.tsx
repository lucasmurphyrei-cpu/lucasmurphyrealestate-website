import { Link } from "react-router-dom";
import { ArrowRight, Award, Calendar, MapPin, Quote, Star } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG, SOCIAL } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";
import headshot from "@/assets/lucas-murphy-headshot.jpeg";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

const CREDS = [
  { value: "PSA", label: "Pricing Strategy Advisor" },
  { value: "ABR", label: "Accredited Buyer's Representative" },
  { value: "2+", label: "Years as a licensed agent" },
  { value: "4+", label: "Years investing in real estate" },
];

const REVIEWS = [
  {
    quote:
      "As first-time homebuyers, we did not have much experience with the process. Lucas was incredibly knowledgeable and informative from start to finish. His organization and prompt communication made our search smooth and timely. We are so excited to be in our first home.",
    name: "First-time buyers, Milwaukee",
  },
  {
    quote:
      "I was referred to Lucas by a coworker and right away he made us feel comfortable, informed, and supported. No matter how many questions we had, he explained everything clearly and never made us feel pressured. He truly had our best interests in mind.",
    name: "First-time buyers, Waukesha",
  },
];

export default function PreviewAbout() {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="About Lucas Murphy | Metro Milwaukee Real Estate"
        description="Meet Lucas Murphy of the Provision Properties Core Team at eXp Realty, serving Milwaukee, Waukesha, Ozaukee, and Washington counties."
        canonicalPath="/preview/v1/about"
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={IMG.skyline}
        align="end"
        objectPosition="center 38%"
        minH="min-h-[58vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.35)_0%,rgba(10,20,36,0.5)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">About</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Hi, I'm Lucas Murphy.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            A Milwaukee native helping families and investors find their place across Metro Milwaukee, with
            honesty, heart, and a plan for every step.
          </p>
        </div>
      </ParallaxBand>

      {/* ===== Welcome / local expert ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_hsl(216_52%_11%/0.4)]">
              <img src={headshot} alt="Lucas Murphy" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-sm border border-accent/40 lg:-left-6 lg:-top-6" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Your local expert</p>
            <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.02em] sm:text-4xl">
              This market is home in every sense.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I grew up in Milwaukee and have spent the last six years working in Waukesha, so I know these
                communities firsthand. I specialize in Milwaukee and Waukesha counties, and alongside my team,
                the Provision Properties Core Team at eXp Realty, I now serve buyers and sellers across Ozaukee
                and Washington counties too.
              </p>
              <p>
                I came to real estate through investing. I started by house hacking a duplex, letting my
                tenant's rent cover most of my mortgage. That experience taught me to make sure the numbers
                actually work, and it is still how I operate. I will never push you into a home that does not
                fit, and I am always happy to walk first-time buyers through the hidden costs of ownership so
                there are no surprises.
              </p>
              <p>
                Buying or selling a home is one of the biggest decisions you will make, so I lead with honesty
                and keep your best interests at the center of every conversation.
              </p>
            </div>
            <p className="mt-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" /> Milwaukee &middot; Waukesha &middot; Ozaukee &middot; Washington
            </p>
          </div>
        </div>
      </section>

      {/* ===== Mission band ===== */}
      <ParallaxBand
        src={IMG.artMuseum}
        align="center"
        objectPosition="center 40%"
        minH="min-h-[60vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.55)_0%,rgba(10,20,36,0.82)_100%)]"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">My mission</p>
          <Quote className="mx-auto h-9 w-9 text-accent" />
          <p className="mt-6 font-display text-xl font-medium italic leading-relaxed text-white sm:text-2xl">
            My mission is to provide exceptional service, ensuring my clients feel supported and confident every
            step of the way. I prioritize transparent, timely communication and answer every question with
            honesty backed by the market. I measure my success by the repeat business and referrals I earn.
          </p>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
            Lucas Murphy &middot; eXp Realty
          </p>
        </div>
      </ParallaxBand>

      {/* ===== Credentials ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          <Award className="h-4 w-4" /> Experience &amp; credentials
        </p>
        <div className="mt-8 grid gap-6 border-y border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {CREDS.map((c) => (
            <div key={c.label} className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-accent/15 font-display text-lg font-bold tracking-tight text-accent">
                {c.value}
              </span>
              <p className="text-sm font-medium leading-tight text-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <h2 className="text-center font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            What clients say
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-sm border border-border bg-card p-7 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.4)]">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-muted-foreground">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Let's make your move, together.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Wherever you are in the journey, I'm happy to talk it through. No pressure, just honest guidance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar className="h-4 w-4" /> Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/preview/v1/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}

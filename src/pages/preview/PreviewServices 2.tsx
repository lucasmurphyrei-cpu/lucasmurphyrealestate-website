import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

type Service = { title: string; body: string; href: string; img: string };

const SERVICES: Service[] = [
  {
    title: "Home Buyers",
    body: "Finding your dream home should be exciting, not daunting. I blend expert guidance with personal service to make your home-buying journey as smooth and joyful as possible, from your first pre-approval to keys in hand. From cozy starter homes to lakefront retreats, my tailored approach makes sure your next home fits your life. Let's turn your dream into an address.",
    href: "/buying",
    img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Home Sellers",
    body: "Partner with me for a selling experience that is as rewarding as it is efficient. Strategic pricing built on real local data, marketing that reaches the right buyers, and dedicated support from listing photos to the closing table. I am here to make sure your home sells quickly and for the best price.",
    href: "/selling",
    img: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Real Estate Investing",
    body: "Whether it is your first duplex or your fiftieth door, we run the real numbers together, pressure test the deal, and find properties that actually cash flow. I came up house hacking, so I speak this language fluently and I will help you build a portfolio that compounds.",
    href: "/investing",
    img: "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Relocation",
    body: "Embrace your new beginning with guidance through every part of the move. From choosing the right community to navigating commute, schools, and cost of living, I make relocating to Metro Milwaukee smooth and stress-free. Let's find the place where you truly belong.",
    href: "/market",
    img: IMG.skyline,
  },
];

export default function PreviewServices() {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Our Services | Metro Milwaukee Real Estate | Lucas Murphy"
        description="Ways to work with Lucas Murphy: home buyers, home sellers, real estate investing, and relocation across Metro Milwaukee."
        canonicalPath="/services"
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={IMG.riverwalk}
        align="end"
        objectPosition="center 42%"
        minH="min-h-[58vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.35)_0%,rgba(10,20,36,0.5)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Our Services</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Let's turn your dream home into a reality.
          </h1>
        </div>
      </ParallaxBand>

      {/* ===== Intro ===== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Ways you can work with me</p>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          Find your place with ease
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          I am here not just as a professional, but as someone who has walked a mile in your shoes. Together
          we will explore the neighborhoods and cities of Metro Milwaukee, find a place where you feel you
          truly belong, and maybe share a story or two along the way. Let's start this adventure together.
        </p>
      </section>

      {/* ===== Numbered service rows ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <div className="space-y-16 lg:space-y-24">
          {SERVICES.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={s.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                {/* Visual */}
                <div className={`relative ${flip ? "lg:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-sm shadow-[0_30px_70px_-40px_hsl(216_52%_11%/0.5)] ring-1 ring-border">
                    <img src={s.img} alt={s.title} className="aspect-[4/3] w-full object-cover lg:aspect-[5/6]" />
                  </div>
                  <span className="absolute -left-3 -top-5 font-display text-6xl font-semibold text-accent/90 lg:-left-6 lg:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className={flip ? "lg:order-1" : ""}>
                  <h3 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{s.title}</h3>
                  <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{s.body}</p>
                  <Link
                    to={s.href}
                    className="group mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Get started now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="mt-12 bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Tell me a little about your goals and I'll point you to the right path. No pressure, just honest guidance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/contact"
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

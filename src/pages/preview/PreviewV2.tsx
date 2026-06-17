import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Quote,
  Star,
  Truck,
} from "lucide-react";
import provisionLogo from "@/assets/provision-logo.png";
import expWhite from "@/assets/exp-logo-white.png";
import headshot from "@/assets/lucas-murphy-headshot.jpeg";
import teamBanner from "@/assets/team-banner.png";

/*
 * REDESIGN PREVIEW — Direction 2: "Feels Like Family"
 * Inspiration: Schraner Realty (warm, bold, personal; headline-as-promise hero,
 * a free relocation guide as the lead magnet, a "Moving to ___" surface).
 * Standalone, self-contained, additive. Live homepage at "/" is untouched.
 */

const pillars = [
  {
    icon: Home,
    title: "Buying in Metro Milwaukee",
    blurb:
      "From your first showing to closing day, you'll always know the next step — and you'll never feel rushed.",
    href: "/guides/first-time-home-buyers",
  },
  {
    icon: KeyRound,
    title: "Selling Your Home",
    blurb:
      "A pricing strategy built on real local data, marketing that actually moves, and a plan to net you more.",
    href: "/guides/sellers",
  },
  {
    icon: Truck,
    title: "Relocating? We've Got You",
    blurb:
      "Moving across town or across the country, we make landing in southeastern Wisconsin feel easy.",
    href: "/guides/relocation",
  },
];

const reviews = [
  {
    quote:
      "Lucas made our out-of-state move feel completely manageable. He knew every neighborhood and answered questions before we even thought to ask.",
    name: "The Petersons",
    detail: "Relocated to Wauwatosa",
  },
  {
    quote:
      "First-time buyers, totally overwhelmed — and Lucas turned it into the smoothest experience. It really did feel like having family in the business.",
    name: "Jamie & Alex",
    detail: "Bought in Milwaukee County",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const nav = [
  { label: "About", href: "#about" },
  { label: "How I Help", href: "#help" },
  { label: "Relocating", href: "#relocate" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "/contact" },
];

export default function PreviewV2() {
  return (
    <div className="preview-v2 min-h-screen bg-background font-body text-foreground antialiased">
      {/* ===== Header ===== */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <img src={provisionLogo} alt="Provision Properties" className="h-11 w-auto brightness-0 invert" />
          <nav className="hidden items-center gap-9 text-sm font-medium tracking-wide text-white/90 lg:flex">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="transition-colors hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="https://calendly.com/lucasmurphyrei"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:inline-flex"
          >
            Let's Talk
          </a>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="preview-grain relative flex min-h-[94vh] items-center justify-center overflow-hidden text-center">
        <img src={teamBanner} alt="Lucas Murphy and the Provision Properties team" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#1b1712]/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b1712]/70 via-transparent to-[#1b1712]/80" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6"
        >
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#e7c98a]">
            Metro Milwaukee · eXp Realty
          </p>
          <h1 className="font-display text-5xl font-medium leading-[1.06] tracking-[-0.01em] text-white sm:text-6xl lg:text-7xl">
            A real estate experience<br />that feels like <span className="italic text-[#e7c98a]">home.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/80">
            Buying, selling, or relocating across southeastern Wisconsin — with an agent who treats
            your move like it's his own family's.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://calendly.com/lucasmurphyrei"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#e7c98a] px-8 py-3.5 text-sm font-semibold text-[#1b1712] transition-all duration-300 hover:-translate-y-0.5"
            >
              Schedule a Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#relocate"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Get the Free Relocation Guide
            </a>
          </div>
        </motion.div>
      </section>

      {/* ===== Editorial intro ===== */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              Your Metro Milwaukee Expert
            </p>
            <h2 className="font-display text-4xl font-medium leading-[1.12] tracking-[-0.01em] sm:text-5xl">
              Real estate is personal. <span className="italic text-accent">I treat it that way.</span>
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I'm Lucas Murphy — a Metro Milwaukee agent with eXp Realty's Provision Properties Core
                Team. For years I've helped buyers, sellers, and investors move through Milwaukee,
                Waukesha, Ozaukee, and Washington Counties with honest advice and zero pressure.
              </p>
              <p>
                Whether it's your first home, your forever home, or a long-distance move into a place
                you've never lived, you'll get a real plan, real numbers, and someone who picks up
                the phone.
              </p>
            </div>
            <div className="mt-8">
              <p className="font-display text-2xl italic text-foreground">Lucas Murphy</p>
              <p className="text-sm text-muted-foreground">eXp Realty · Provision Properties Core Team</p>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_hsl(28_24%_17%/0.5)]">
              <img src={headshot} alt="Lucas Murphy" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-sm border border-accent/40 lg:-left-6 lg:-top-6" />
          </div>
        </div>
      </section>

      {/* ===== Pillars (dark band) ===== */}
      <section id="help" className="preview-grain relative overflow-hidden bg-[#221d17] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#e7c98a]">How I Help</p>
            <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.01em] sm:text-5xl">
              Turn your next move into a <span className="italic text-[#e7c98a]">living reality.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="show"
              >
                <Link
                  to={p.href}
                  className="group flex h-full flex-col rounded-sm border border-white/12 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#e7c98a]/50 hover:bg-white/[0.07]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7c98a]/15 text-[#e7c98a]">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-medium">{p.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-white/65">{p.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e7c98a]">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Relocation lead magnet ===== */}
      <section id="relocate" className="bg-secondary/70">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Free Download</p>
            <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.01em] sm:text-5xl">
              Grab our Metro Milwaukee <span className="italic text-accent">Relocation Guide</span> — free.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Neighborhoods, school districts, commute times, cost-of-living, and a month-by-month
              moving timeline — everything you need to land confidently in southeastern Wisconsin.
            </p>
            <ul className="mt-8 space-y-3">
              {["Neighborhood-by-neighborhood breakdowns", "School & commute comparisons", "A step-by-step relocation timeline"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-sm border border-border bg-card p-8 shadow-[0_30px_70px_-40px_hsl(28_24%_17%/0.4)] lg:p-10"
          >
            <p className="font-display text-2xl font-medium">Where should we send it?</p>
            <p className="mt-1 text-sm text-muted-foreground">No spam — just the guide and the occasional local update.</p>
            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full name"
                className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
              <input
                type="tel"
                required
                placeholder="Phone"
                className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90"
              >
                Send Me the Free Guide
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ===== Moving to Milwaukee feature ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <Link
          to="/guides/relocation"
          className="group relative flex min-h-[340px] items-end overflow-hidden rounded-sm preview-grain"
        >
          <img
            src="https://placehold.co/1600x600/2a2118/e7c98a?text=Moving+to+Milwaukee"
            alt="Moving to Milwaukee"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1712]/85 via-[#1b1712]/40 to-transparent" />
          <div className="relative z-10 max-w-xl p-10 lg:p-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#e7c98a]">New to the area?</p>
            <h3 className="font-display text-3xl font-medium text-white sm:text-4xl">
              Moving to Milwaukee &amp; Waukesha
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Your complete starting point — where to live, what it costs, and how to make the move
              without the stress.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e7c98a]">
              Explore the relocation hub
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* ===== Reviews (dark) ===== */}
      <section id="reviews" className="bg-[#221d17] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#e7c98a]">Kind Words</p>
            <h2 className="font-display text-5xl font-medium tracking-[-0.01em] sm:text-6xl">Reviews</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {reviews.map((r) => (
              <figure
                key={r.name}
                className="rounded-sm border border-white/12 bg-white/[0.04] p-9"
              >
                <Quote className="h-8 w-8 text-[#e7c98a]" />
                <blockquote className="mt-5 font-display text-xl italic leading-relaxed text-white/90">
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-semibold text-white">{r.name}</p>
                  <p className="text-sm text-white/60">{r.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="preview-grain relative overflow-hidden">
        <img src={teamBanner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#1b1712]/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center lg:py-36">
          <h2 className="font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
            Ready to start your <span className="italic text-[#e7c98a]">move?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Let's grab 20 minutes. No pressure, no obligation — just a clear next step for your move
            in Metro Milwaukee.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://calendly.com/lucasmurphyrei"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#e7c98a] px-8 py-3.5 text-sm font-semibold text-[#1b1712] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Schedule a Consultation <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+14144581952" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Phone className="h-4 w-4 text-[#e7c98a]" /> (414) 458-1952
            </a>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#16120e] text-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-12 md:flex-row md:items-center">
            <div className="max-w-sm">
              <img src={provisionLogo} alt="Provision Properties" className="h-11 w-auto brightness-0 invert" />
              <p className="mt-5 text-sm leading-relaxed">
                Lucas Murphy · eXp Realty — Provision Properties Core Team. An honest, personal approach
                to Metro Milwaukee real estate.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <a href="tel:+14144581952" className="flex items-center gap-3 transition-colors hover:text-[#e7c98a]">
                <Phone className="h-4 w-4 text-[#e7c98a]" /> (414) 458-1952
              </a>
              <a href="mailto:lucas.murphy@exprealty.com" className="flex items-center gap-3 transition-colors hover:text-[#e7c98a]">
                <Mail className="h-4 w-4 text-[#e7c98a]" /> lucas.murphy@exprealty.com
              </a>
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#e7c98a]" /> Milwaukee · Waukesha · Ozaukee · Washington
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs sm:flex-row">
            <p>© 2026 Lucas Murphy Real Estate. Preview design — not the live site.</p>
            <img src={expWhite} alt="eXp Realty" className="h-6 w-auto opacity-80" />
          </div>
        </div>
      </footer>
    </div>
  );
}

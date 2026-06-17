import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Home,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Quote,
  Star,
  TrendingUp,
  Youtube,
} from "lucide-react";
import provisionLogo from "@/assets/provision-logo.png";
import expWhite from "@/assets/exp-logo-white.png";
import headshot from "@/assets/lucas-murphy-headshot.jpeg";
import skyline from "@/assets/milwaukee-skyline.jpg";
import property1 from "@/assets/property-1.jpg";
import soldPhoto from "@/assets/sold-photo.jpg";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import { IMG, VID, SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";

/*
 * REDESIGN PREVIEW — Direction 1: "Local Guide"
 * Aesthetic: clean-modern editorial (East Dallas Living-inspired).
 * Flow (Schraner Realty-inspired): animated county hero → about/origin →
 * guides → reviews → get started. Standalone, additive; live "/" untouched.
 *
 * Scroll behavior mirrors Schraner's Wix "Parallax / ParallaxZoom": background
 * photos translate slower than content + slowly zoom as they scroll past them.
 *
 * IMAGES: real, free-license photos from Wikimedia Commons (CC BY / CC BY-SA /
 * public domain) — confirm each file's license + add attribution before launch,
 * or swap for licensed stock / Lucas's own photography.
 * STILL PLACEHOLDER: origin-story copy, reviews, and the headline stats.
 */

// Card images are temporary free-license placeholders (Pexels) — swap for Lucas's own listing photos.
const guides = [
  {
    icon: Home,
    kicker: "For Buyers",
    title: "Buying a Home",
    question: "Buying a home in Metro Milwaukee?",
    description:
      "From your first pre-approval conversation to keys in hand, I'll guide you through finding the right neighborhood, writing an offer that wins, and closing with confidence. You'll always know what comes next and why.",
    href: "/preview/v1/buying",
    img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
    panel: "#1b2d49",
  },
  {
    icon: KeyRound,
    kicker: "For Sellers",
    title: "Selling Your Home",
    question: "Selling your home for top dollar?",
    description:
      "I price your home on real local data, market it so the right buyers actually see it, and negotiate hard to net you more. A clear plan, honest expectations, and a partner who sweats every detail from listing photos to the closing table.",
    href: "/preview/v1/selling",
    img: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600",
    panel: "#13233b",
  },
  {
    icon: TrendingUp,
    kicker: "For Investors",
    title: "Investing & House Hacking",
    question: "Investing in Milwaukee real estate?",
    description:
      "I came up house hacking, so I speak this language fluently. Whether it's your first duplex or your fiftieth door, we'll run the real numbers together, pressure test the deal, and find properties that actually cash flow.",
    href: "/preview/v1/investing",
    img: "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1600",
    panel: "#0a1424",
  },
];

// Real client testimonials (long ones excerpted for the homepage — full text can live on a /reviews page).
const reviews = [
  {
    quote:
      "As first-time homebuyers, we didn't have much experience with the process. Lucas was incredibly knowledgeable and informative from start to finish — his organization and prompt communication made our search smooth and timely. We're so excited to be in our first home, and we have Lucas to thank!",
    name: "Courtney Peterson",
    detail: "First-time buyers",
  },
  {
    quote:
      "We were relocating from Michigan and met Lucas at an open house. His system and attention to detail in understanding what we wanted helped us get an offer accepted on a beautiful home that had multiple offers. Our Michigan realtor was a top-selling agent in the state — Lucas's service matched and even exceeded it.",
    name: "Richard Painter",
    detail: "Relocated from Michigan",
  },
  {
    quote:
      "We were referred to Lucas when buying in the Waukesha area and didn't know where to start. What stood out most was his hard work, responsiveness, and patience — he got us answers fast and never made us feel rushed. When we needed to move quickly on an offer, he'd stay up late with us to give us the best chance. Professional, dedicated, and he truly cares.",
    name: "Noah Graebel",
    detail: "First-time buyers · Waukesha",
  },
  {
    quote:
      "We weren't sure how to begin selling our Waukesha home. Lucas and Jacob outlined every option with zero pressure — when to list, what to update, how to stage. He lined up a contractor, a power washer, and the photographer, and put in tremendous effort. The marketing worked and we had a strong offer in just four days. He may be new to real estate, but it never showed.",
    name: "Linda & Tom Wetzel",
    detail: "Home sellers · Waukesha",
  },
  {
    quote:
      "I was referred to Lucas by a coworker when searching for our first home, and right away he made us feel comfortable, informed, and supported. My favorite part was how responsive and down-to-earth he was — no matter how many questions we had, he explained everything clearly and never made us feel pressured. He truly had our best interests in mind.",
    name: "Pres Kinee",
    detail: "First-time buyers",
  },
  {
    quote:
      "Lucas was always available, always professional, and understood exactly what we were looking for. His communication was clear and timely — scheduling showings, negotiating offers, working through paperwork. I'm thankful to have known Lucas since we were babies, which made him an even better choice to help find our dream home!",
    name: "Sara Rodríguez Mora",
    detail: "First-time buyers",
  },
];

const stats: [string, string][] = [
  ["4", "Counties served"],
  ["100+", "Local moves guided"],
  ["5★", "Average client rating"],
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const nav = [
  { label: "Areas", href: "/preview/v1/market" },
  { label: "About", href: "#about" },
  { label: "Guides", href: "/preview/v1/guides" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "/preview/v1/contact" },
];

const ROTATE_MS = 5000;

/* Official multi-color Google "G" mark for the reviews badge. */
function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/* Auto-advancing reviews with a segmented timer, hover-to-pause, and click-through arrows. */
function ReviewsPanel() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const DURATION = 7000;

  useEffect(() => {
    if (paused) return;
    const step = 50;
    const id = setInterval(() => {
      setProgress((pr) => {
        const next = pr + (100 * step) / DURATION;
        if (next >= 100) {
          setActive((a) => (a + 1) % reviews.length);
          return 0;
        }
        return next;
      });
    }, step);
    return () => clearInterval(id);
  }, [paused]);

  const go = (i: number) => {
    setActive((i + reviews.length) % reviews.length);
    setProgress(0);
  };

  const r = reviews[active];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative">
      {/* Segmented timer — active segment fills to show time remaining */}
      <div className="mb-9 flex gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Show review ${i + 1}`}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: i < active ? "100%" : i === active ? `${progress}%` : "0%" }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 flex items-center gap-1.5 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <blockquote className="font-display text-2xl font-medium italic leading-relaxed text-white lg:text-[1.7rem]">
            "{r.quote}"
          </blockquote>
          <figcaption className="mt-6">
            <p className="font-semibold text-white">{r.name}</p>
            <p className="text-sm text-white/55">{r.detail}</p>
          </figcaption>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="ml-1 text-xs font-medium text-white/55">
            {paused ? "Paused · browse with the arrows" : "Hover to pause"}
          </span>
        </div>
        <a
          href={SOCIAL.google}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent"
        >
          <GoogleG className="h-4 w-4" /> Read on Google
          <ArrowUpRight className="h-4 w-4 text-accent" />
        </a>
      </div>
    </div>
  );
}

/* Years + certifications condensed into one auto-advancing row: segmented timer, hover-to-pause, click-through arrows. */
const credentials = [
  { value: "PSA", title: "Pricing Strategy Advisor", blurb: "An NAR certification in pricing, so I value homes and structure offers on rigorous market data." },
  { value: "ABR", title: "Accredited Buyer's Representative", blurb: "The premier NAR buyer designation, so I negotiate the strongest terms in your corner." },
  { value: "4+", title: "Years investing in real estate", blurb: "House hacking and analyzing deals before I ever listed one." },
  { value: "2+", title: "Years as a licensed agent", blurb: "Full-time in the Milwaukee and Waukesha markets I call home." },
];

function CredentialsCarousel() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const DURATION = 5000;

  useEffect(() => {
    if (paused) return;
    const step = 50;
    const id = setInterval(() => {
      setProgress((pr) => {
        const next = pr + (100 * step) / DURATION;
        if (next >= 100) {
          setActive((a) => (a + 1) % credentials.length);
          return 0;
        }
        return next;
      });
    }, step);
    return () => clearInterval(id);
  }, [paused]);

  const go = (i: number) => {
    setActive((i + credentials.length) % credentials.length);
    setProgress(0);
  };

  const c = credentials[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="mt-9 border-y border-border py-6"
    >
      {/* Segmented timer — active segment fills to show time remaining */}
      <div className="mb-6 flex gap-2">
        {credentials.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Show credential ${i + 1}`}
            className="h-1 flex-1 overflow-hidden rounded-full bg-border"
          >
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: i < active ? "100%" : i === active ? `${progress}%` : "0%" }}
            />
          </button>
        ))}
      </div>

      <div className="flex min-h-[5rem] items-center justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-w-0 flex-1 items-center gap-5"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-accent/15 font-display text-xl font-bold tracking-tight text-accent">
              {c.value}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold leading-tight">{c.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous credential"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next credential"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PreviewV1() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % heroCounties.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  // Parallax for the rotating hero background.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgY = useTransform(heroProgress, [0, 1], ["0%", "12%"]);

  const current = heroCounties[active];

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <PreviewHeader />

      {/* ===== Animated county hero (rotating + parallax background) ===== */}
      <section ref={heroRef} id="hero" className="relative flex min-h-screen items-center overflow-hidden">
        {/* Parallax wrapper for the cross-fading, slowly-zooming county photos */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-x-0 -top-[20%] h-[140%]">
          <AnimatePresence>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.3 }, scale: { duration: ROTATE_MS / 1000 + 1.5, ease: "linear" } }}
              className="absolute inset-0"
            >
              {current.video ? (
                <video
                  src={current.video}
                  poster={current.img}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src={current.img} alt={current.name} className="h-full w-full object-cover" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/85 via-[#0a1424]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1424]/70 via-[#0a1424]/15 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl py-32">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent"
            >
              <span className="h-px w-10 bg-accent" /> Metro Milwaukee Real Estate
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="font-display text-5xl font-medium leading-[1.04] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl"
            >
              Find your place across <span className="italic text-accent">Metro Milwaukee.</span>
            </motion.h1>

            {/* Rotating local highlight */}
            <div className="mt-7 h-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Now exploring</p>
                  <p className="font-display text-2xl text-white sm:text-3xl">
                    {current.name} <span className="text-white/55">— {current.place}</span>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="https://calendly.com/lucasmurphyrei"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                Schedule a Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                Meet Lucas
              </a>
            </motion.div>
          </div>

          {/* County indicators with progress */}
          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {heroCounties.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className="group text-left"
                aria-label={`Show ${c.name}`}
              >
                <span
                  className={`block text-sm font-semibold transition-colors duration-300 ${
                    i === active ? "text-accent" : "text-white/55 group-hover:text-white/80"
                  }`}
                >
                  {c.name.replace(" County", "")}
                </span>
                <span className="mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-white/20">
                  {i === active && (
                    <motion.span
                      key={active}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                      className="block h-full bg-accent"
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== About / how I got started ===== */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_hsl(216_52%_11%/0.4)]">
                <img src={headshot} alt="Lucas Murphy" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="absolute -right-2 -bottom-6 hidden rounded-sm bg-accent px-5 py-4 text-accent-foreground shadow-xl sm:block lg:-right-6">
                <p className="font-display text-lg font-semibold leading-tight">Licensed REALTOR&reg;</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide">eXp Realty · Provision Properties</p>
              </div>
              <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-sm border border-accent/40 lg:-left-6 lg:-top-6" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">How I Got Started</p>
            <h2 className="font-display text-4xl font-medium leading-[1.12] tracking-[-0.02em] sm:text-5xl">
              Hi, I'm Lucas Murphy.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I grew up in Milwaukee and have spent the last six years working in Waukesha, so this market
                is home in every sense. I specialize in Milwaukee and Waukesha counties, and alongside my
                team, the Provision Properties Core Team, I now serve buyers and sellers across Ozaukee and
                Washington counties too. If I'm ever not the right fit for your search, I'll gladly point you
                toward one of the many great agents I trust.
              </p>
              <p>
                I came to real estate through investing. I started by house hacking a duplex, letting my
                tenant's rent cover most of my mortgage. Cutting down my biggest monthly expense gave me the
                freedom to spend my time on work I care about instead of chasing whatever paid the most.
                That's still how I operate: I'll never push you into a home that doesn't fit. I make sure the
                numbers actually work, and I'm always happy to walk first-time buyers through the hidden
                costs of ownership so there are no surprises.
              </p>
              <p>
                Buying or selling a home is one of the biggest decisions you'll make, so I lead with honesty
                and keep your best interests at the center of every conversation. I love helping first-time
                buyers understand the market and the process, helping investors land their first property or
                their fiftieth, and helping sellers price their homes to match their goals.
              </p>
            </div>

            {/* Years + certifications — condensed auto-advancing row */}
            <p className="mb-1 mt-9 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Award className="h-4 w-4 text-accent" /> Experience &amp; Credentials
            </p>
            <CredentialsCarousel />

            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="font-display text-2xl italic">Lucas Murphy</p>
              <a
                href="#guides"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                See how I can help <ArrowRight className="h-4 w-4 text-accent" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Parallax pull-quote band ===== */}
      <ParallaxBand
        src={skyline}
        align="end"
        objectPosition="center bottom"
        minH="min-h-screen"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.05)_0%,rgba(10,20,36,0.18)_34%,rgba(10,20,36,0.85)_60%,rgb(10,20,36)_100%)]"
      >
        <div className="mx-auto max-w-4xl pb-10 text-center lg:pb-14">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">My Mission</p>
          <Quote className="mx-auto h-9 w-9 text-accent" />
          <p className="mt-6 font-display text-lg font-medium italic leading-relaxed text-white sm:text-xl lg:text-2xl">
            As a dedicated REALTOR&reg;, my mission is to provide exceptional customer service, ensuring my
            clients feel supported and confident every step of the way. I prioritize transparent and timely
            communication, answering all questions with honesty and insights backed by the market. With my
            clients' best interests as my own, I am committed to fostering lasting relationships built on
            trust. I measure my success by the repeat business I receive from my clients and the referrals
            to their friends and family.
          </p>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
            Lucas Murphy · eXp Realty
          </p>
        </div>
      </ParallaxBand>

      {/* ===== Guides — picturesque band + photo cards (Schraner "Ways to Work With Us" style) ===== */}
      <div id="guides">
        <ParallaxBand
          src={property1}
          split
          fixedBg
          minH="min-h-screen"
          cornerLabel={
            <span className="relative inline-block -rotate-6 text-accent [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
              <span style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl font-bold lg:text-5xl">
                Start Here!
              </span>
              <svg className="mt-1 w-full text-accent" height="14" viewBox="0 0 150 14" fill="none" preserveAspectRatio="none">
                <path d="M3 8 C 45 1, 105 2, 147 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          }
        >
          <div className="flex min-h-[82vh] flex-col justify-between gap-16">
            <div className="pt-6 text-center">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-accent sm:text-sm">
                How I Can Help You
              </p>
              <h2 className="mx-auto max-w-4xl font-display text-5xl font-medium leading-[1.03] tracking-[-0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl xl:text-8xl">
                Wherever you are in the <span className="italic text-accent">journey.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {guides.map((g, i) => (
              <motion.div
                key={g.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Link
                  to={g.href}
                  style={{ backgroundColor: g.panel }}
                  className="group flex h-full flex-col overflow-hidden rounded-sm shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_44px_80px_-30px_rgba(0,0,0,0.9)] hover:ring-accent/60"
                >
                  {/* Photo on top (clean) */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={g.img}
                      alt={g.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    />
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                  {/* Solid stepped-navy panel, centered text */}
                  <div className="flex flex-1 flex-col items-center px-7 py-12 text-center lg:px-9 lg:py-16">
                    <h3 className="font-display text-2xl font-medium leading-snug text-white lg:text-[1.85rem]">{g.question}</h3>
                    <p className="mt-5 flex-1 text-[15px] leading-relaxed text-white/65">{g.description}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Read the guide
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          </div>
        </ParallaxBand>
      </div>

      {/* ===== Parallax stat band ===== */}
      <ParallaxBand src={IMG.lacLaBelle} video={VID.autumn} overlay="bg-[#0a1424]/62" minH="min-h-[52vh]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">From the lakefront to Lake Country</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
            Wherever home is in southeastern Wisconsin, you've got a guide.
          </h2>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-6">
            {stats.map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-4xl font-semibold text-accent sm:text-5xl">{n}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxBand>

      {/* ===== Reviews — light band, oversized title, photo left + auto-scrolling panel right ===== */}
      <section id="reviews" className="relative overflow-hidden bg-background">
        {/* Soft light interior backdrop */}
        <img
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-[#0a1424]/90" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Kind Words</p>
            <h2 className="font-display text-6xl font-medium tracking-[-0.02em] text-white sm:text-7xl lg:text-8xl">
              Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Photo — cropped to focus on Lucas, edges feathered into the navy */}
            <div className="relative">
              <img
                src={soldPhoto}
                alt="Lucas Murphy with happy clients"
                className="mx-auto aspect-[4/5] w-full max-w-md object-cover object-center [mask-image:radial-gradient(145%_140%_at_50%_45%,#000_76%,transparent_100%)] [-webkit-mask-image:radial-gradient(145%_140%_at_50%_45%,#000_76%,transparent_100%)]"
              />
            </div>

            {/* Auto-scrolling reviews */}
            <ReviewsPanel />
          </div>
        </div>
      </section>

      {/* ===== Get started now (parallax) ===== */}
      <ParallaxBand src={IMG.portSunrise} video={VID.sunset} overlay="bg-[#0a1424]/65" minH="min-h-[72vh]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Let's Begin</p>
          <h2 className="font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
            Get started <span className="italic text-accent">now.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Grab 20 minutes with me — no pressure, no obligation. Just a clear next step for your move
            across Metro Milwaukee.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://calendly.com/lucasmurphyrei"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Schedule a Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="tel:+14144581952" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Phone className="h-4 w-4 text-accent" /> (414) 458-1952
            </a>
          </div>
        </div>
      </ParallaxBand>

      {/* Sticky Google reviews badge is now rendered globally by PreviewHeader. */}

      {/* ===== Footer ===== */}
      <footer className="bg-[#0a1424] text-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-12 md:flex-row">
            <div className="max-w-sm">
              <p className="font-display text-2xl font-bold text-white">Lucas Murphy</p>
              <p className="mt-1 text-sm font-medium text-white/80">eXp Realty · Provision Properties Core Team</p>
              <div className="mt-5 space-y-2 text-sm">
                <a href="tel:+14144581952" className="flex items-center gap-2 transition-colors hover:text-accent">
                  <Phone className="h-4 w-4 text-accent" /> (414) 458-1952
                </a>
                <a href="mailto:lucas.murphy@exprealty.com" className="flex items-center gap-2 transition-colors hover:text-accent">
                  <Mail className="h-4 w-4 text-accent" /> lucas.murphy@exprealty.com
                </a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" /> Milwaukee · Waukesha · Ozaukee · Washington
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                Metro Milwaukee market insights, guides &amp; strategy.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 text-sm sm:grid-cols-3">
              <div>
                <p className="mb-4 font-semibold uppercase tracking-wide text-white">Areas</p>
                <ul className="space-y-2.5">
                  {heroCounties.map((c) => (
                    <li key={c.name}>
                      <Link to={`/preview/v1/market/${c.path.split("/").pop()}`} className="inline-flex items-center gap-1 transition-colors hover:text-accent">
                        {c.name} <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 font-semibold uppercase tracking-wide text-white">Guides</p>
                <ul className="space-y-2.5">
                  {guides.map((g) => (
                    <li key={g.title}>
                      <Link to={g.href} className="transition-colors hover:text-accent">{g.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 font-semibold uppercase tracking-wide text-white">Resources</p>
                <ul className="space-y-2.5">
                  <li><Link to="/resources/contractors" className="transition-colors hover:text-accent">Contractors</Link></li>
                  <li><Link to="/resources/lenders" className="transition-colors hover:text-accent">Lenders</Link></li>
                  <li><Link to="/resources/home-inspectors" className="transition-colors hover:text-accent">Home Inspectors</Link></li>
                  <li><Link to="/resources/home-insurance" className="transition-colors hover:text-accent">Home Insurance</Link></li>
                  <li><Link to="/resources/movers" className="transition-colors hover:text-accent">Movers</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6">
            <img src={provisionLogo} alt="Provision Properties Core Team logo" className="h-48 w-auto brightness-0 invert" />
            <img src={expWhite} alt="eXp Realty logo" className="h-12 w-auto" />
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs">
            © 2026 Provision Properties Core Team · eXp Realty. Preview design, not the live site.
          </div>
        </div>
      </footer>
    </div>
  );
}

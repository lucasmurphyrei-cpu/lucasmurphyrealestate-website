import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

/* One normalized vendor shape the five directories (lenders, inspectors,
   insurance, contractors, movers) all map onto. */
export interface Vendor {
  name: string;
  business: string;
  title?: string;
  website?: string;
  email?: string;
  phone?: string;
  officePhone?: string;
  location?: string;
  image?: string;
  bio: string;
  tags?: string[];
  nmls?: string;
  isLogo?: boolean;
}

export interface VendorCategory {
  name: string;
  items: Vendor[];
}

export interface VendorDirectoryProps {
  icon: LucideIcon;
  kicker: string;
  title: string;
  intro: string;
  heroImg: string;
  canonicalPath: string;
  metaTitle: string;
  metaDescription: string;
  categories: VendorCategory[];
  ctaTitle?: string;
  ctaBody?: string;
}

function VendorCard({ v }: { v: Vendor }) {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_60px_-32px_hsl(216_52%_11%/0.5)]">
      <div className="flex flex-col sm:flex-row">
        {/* Photo / logo */}
        {v.image && (
          <div
            className={`relative shrink-0 sm:w-52 ${
              v.isLogo ? "flex items-center justify-center bg-secondary/40 p-6" : ""
            }`}
          >
            <img
              src={v.image}
              alt={v.name}
              className={
                v.isLogo
                  ? "h-32 w-32 object-contain"
                  : "h-60 w-full object-cover object-top sm:h-full sm:object-center"
              }
            />
            {!v.isLogo && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/45 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0a1424]/15" />
            )}
          </div>
        )}

        {/* Details */}
        <div className="min-w-0 flex-1 p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{v.business}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.01em]">{v.name}</h3>
          {v.title && <p className="mt-0.5 text-sm text-muted-foreground">{v.title}</p>}
          {v.nmls && <p className="mt-1 text-xs text-muted-foreground">NMLS #{v.nmls}</p>}

          {v.tags && v.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {v.tags.map((t) => (
                <span key={t} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {t}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.bio}</p>

          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            {v.phone && (
              <a href={`tel:${v.phone}`} className="inline-flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="h-4 w-4 shrink-0 text-accent/70" /> {v.phone}
                {v.officePhone && <span className="text-muted-foreground/70">(cell)</span>}
              </a>
            )}
            {v.officePhone && (
              <a href={`tel:${v.officePhone}`} className="inline-flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="h-4 w-4 shrink-0 text-accent/70" /> {v.officePhone}{" "}
                <span className="text-muted-foreground/70">(office)</span>
              </a>
            )}
            {v.email && (
              <a href={`mailto:${v.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-accent">
                <Mail className="h-4 w-4 shrink-0 text-accent/70" /> {v.email}
              </a>
            )}
            {v.location && (
              <span className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" /> {v.location}
              </span>
            )}
          </div>

          {v.website && (
            <a
              href={v.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
            >
              <Globe className="h-4 w-4" /> Visit website
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorDirectory({
  icon: Icon,
  kicker,
  title,
  intro,
  heroImg,
  canonicalPath,
  metaTitle,
  metaDescription,
  categories,
  ctaTitle = "Know a great pro I should add?",
  ctaBody = "I only list people I'd send my own clients to. If you've had a great experience with a local pro, tell me about them.",
}: VendorDirectoryProps) {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo title={metaTitle} description={metaDescription} canonicalPath={canonicalPath} />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={heroImg}
        align="end"
        objectPosition="center 42%"
        minH="min-h-[52vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.42)_0%,rgba(10,20,36,0.58)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Icon className="h-4 w-4" /> {kicker}
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{intro}</p>
        </div>
      </ParallaxBand>

      {/* ===== Directory ===== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="space-y-14 lg:space-y-16">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <h2 className="font-display text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{cat.name}</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent" />
              </div>
              <div className="mt-6 space-y-5">
                {cat.items.map((v, i) => (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.32) }}
                  >
                    <VendorCard v={v} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">{ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">{ctaBody}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Recommend a pro
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              <Calendar className="h-4 w-4" /> Schedule a consultation
            </a>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}

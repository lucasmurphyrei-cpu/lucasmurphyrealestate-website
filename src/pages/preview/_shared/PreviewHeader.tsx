import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Phone, Youtube } from "lucide-react";
import provisionLogo from "@/assets/provision-logo.png";
import { SOCIAL } from "@/pages/preview/_shared/tokens";

const NAV = [
  { label: "About", href: "/preview/v1#about" },
  { label: "Market", href: "/preview/v1/market" },
  { label: "Guides", href: "/preview/v1#guides" },
  { label: "Reviews", href: "/preview/v1#reviews" },
  { label: "Contact", href: "/preview/v1#contact" },
];

export default function PreviewHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a1424]/95 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 lg:px-10 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <img
          src={provisionLogo}
          alt="Provision Properties"
          className={`w-auto brightness-0 invert transition-all duration-300 ${
            scrolled ? "h-12 lg:h-14" : "h-20 lg:h-24"
          }`}
        />
        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide text-white/90 lg:flex">
          {NAV.map((n) =>
            n.label === "Market" ? (
              <Link
                key={n.label}
                to={n.href}
                className="relative py-1 transition-colors hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.label}
                href={n.href}
                className="relative py-1 transition-colors hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {n.label}
              </a>
            )
          )}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={SOCIAL.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4 text-accent" /> {SOCIAL.phone}
          </a>
          <span className="h-5 w-px bg-white/25" />
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <Youtube className="h-4 w-4" />
          </a>
          <a
            href="https://calendly.com/lucasmurphyrei"
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_-10px_hsl(44_96%_50%/0.7)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Schedule a Consultation
          </a>
        </div>
      </div>
    </header>
  );
}

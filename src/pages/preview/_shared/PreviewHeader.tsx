import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Facebook, Menu, Phone, X, Youtube } from "lucide-react";
import provisionLogo from "@/assets/provision-logo.png";
import expWhite from "@/assets/exp-logo-white.png";
import { SOCIAL } from "@/pages/preview/_shared/tokens";
import GoogleReviewsBadge from "@/pages/preview/_shared/GoogleReviewsBadge";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

export type NavItem = { label: string; href: string; children?: NavItem[] };

const DEFAULT_NAV: NavItem[] = [
  { label: "About", href: "/preview/v1/about" },
  {
    label: "Services",
    href: "/preview/v1/services",
    children: [
      { label: "Home Buyers", href: "/preview/v1/buying" },
      { label: "Home Sellers", href: "/preview/v1/selling" },
      { label: "Real Estate Investing", href: "/preview/v1/investing" },
      { label: "Relocation", href: "/preview/v1/market" },
    ],
  },
  { label: "Listings", href: "/preview/v1/listings" },
  { label: "Areas", href: "/preview/v1/market" },
  {
    label: "Free Resources",
    href: "/preview/v1/guides",
    children: [
      { label: "All Guides", href: "/preview/v1/guides" },
      { label: "All Tools", href: "/preview/v1/tools" },
      { label: "All Vendors", href: "/preview/v1/vendors" },
    ],
  },
  { label: "Contact", href: "/preview/v1/contact" },
];

const linkBase =
  "relative py-1 transition-colors hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100";

/** Route paths use react-router Link; in-page hash anchors use a plain <a>. */
function NavLink({ item, className, onClick }: { item: NavItem; className?: string; onClick?: () => void }) {
  const cls = className ?? linkBase;
  return item.href.startsWith("/") ? (
    <Link to={item.href} className={cls} onClick={onClick}>
      {item.label}
    </Link>
  ) : (
    <a href={item.href} className={cls} onClick={onClick}>
      {item.label}
    </a>
  );
}

export default function PreviewHeader({ nav = DEFAULT_NAV }: { nav?: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid ? "bg-[#0a1424]/95 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-all duration-300 lg:gap-6 lg:px-10 ${
          scrolled ? "py-3" : "py-4 lg:py-5"
        }`}
      >
        {/* Logo lockup — scales with screen, glyph stays aligned to the content edge */}
        <Link
          to="/preview/v1"
          onClick={() => setOpen(false)}
          className={`flex shrink-0 items-center gap-2 transition-all duration-300 sm:gap-3 lg:gap-3 xl:gap-4 ${
            scrolled ? "" : "-ml-3 sm:-ml-4 md:-ml-5 lg:-ml-4 xl:-ml-6 2xl:-ml-[34px]"
          }`}
        >
          <img
            src={provisionLogo}
            alt="Provision Properties"
            className={`w-auto brightness-0 invert transition-all duration-300 ${
              scrolled ? "h-10 sm:h-11 lg:h-12 xl:h-16 2xl:h-20" : "h-14 sm:h-20 md:h-24 lg:h-12 xl:h-24 2xl:h-32"
            }`}
          />
          <span
            className={`w-px bg-white/25 transition-all duration-300 ${
              scrolled ? "h-6 sm:h-7 lg:h-8 xl:h-12 2xl:h-14" : "h-8 sm:h-10 md:h-12 lg:h-8 xl:h-14 2xl:h-16"
            }`}
            aria-hidden="true"
          />
          <img
            src={expWhite}
            alt="eXp Realty"
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-5 sm:h-6 lg:h-7 xl:h-9 2xl:h-11" : "h-6 sm:h-8 md:h-10 lg:h-7 xl:h-11 2xl:h-14"
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-medium tracking-wide text-white/90 lg:flex xl:gap-8">
          {nav.map((n) =>
            n.children ? (
              <div key={n.label} className="group relative">
                <Link to={n.href} className={`${linkBase} inline-flex items-center gap-1`}>
                  {n.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                {/* pt-3 is a transparent hover bridge so the menu doesn't close in the gap */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="w-60 overflow-hidden rounded-sm border border-white/10 bg-[#0a1424]/98 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md">
                    {n.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        className="block rounded-sm px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-accent"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={n.label} item={n} />
            )
          )}
        </nav>

        {/* Desktop right cluster */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={SOCIAL.phoneHref}
            className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/90 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4 text-accent" /> {SOCIAL.phone}
          </a>
          <span className="hidden h-5 w-px bg-white/25 xl:block" />
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-300 hover:border-accent hover:text-accent xl:flex"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-300 hover:border-accent hover:text-accent xl:flex"
          >
            <Youtube className="h-4 w-4" />
          </a>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_-10px_hsl(44_96%_50%/0.7)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Schedule a Consultation
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-sm text-white transition-colors hover:text-accent lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-white/10 bg-[#0a1424]/98 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((n) => (
              <div key={n.label}>
                <NavLink
                  item={n}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm px-2 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-accent"
                />
                {n.children && (
                  <div className="mb-1 ml-3 flex flex-col border-l border-white/10 pl-3">
                    {n.children.map((c) => (
                      <NavLink
                        key={c.label}
                        item={c}
                        onClick={() => setOpen(false)}
                        className="block rounded-sm px-2 py-2.5 text-sm text-white/65 transition-colors hover:text-accent"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 flex items-center gap-4 border-t border-white/10 px-2 pt-4">
              <a
                href={SOCIAL.phoneHref}
                className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4 text-accent" /> {SOCIAL.phone}
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors hover:border-accent hover:text-accent"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors hover:border-accent hover:text-accent"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
            >
              Schedule a Consultation
            </a>
          </nav>
        </div>
      )}
    </header>
    <GoogleReviewsBadge />
    </>
  );
}

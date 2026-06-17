import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import provisionLogo from "@/assets/provision-logo.png";
import expWhite from "@/assets/exp-logo-white.png";
import { SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";

const guides = [
  { title: "Buying a Home", href: "/guides/first-time-home-buyers" },
  { title: "Selling Your Home", href: "/guides/sellers" },
  { title: "Investing & House Hacking", href: "/guides/house-hacking" },
];

export default function PreviewFooter() {
  return (
    <footer className="bg-[#0a1424] text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-12 md:flex-row">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-bold text-white">Lucas Murphy</p>
            <p className="mt-1 text-sm font-medium text-white/80">eXp Realty · Provision Properties Core Team</p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={SOCIAL.phoneHref} className="flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="h-4 w-4 text-accent" /> {SOCIAL.phone}
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
                    <Link to={`/market/${c.path.split("/").pop()}`} className="inline-flex items-center gap-1 transition-colors hover:text-accent">
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
  );
}

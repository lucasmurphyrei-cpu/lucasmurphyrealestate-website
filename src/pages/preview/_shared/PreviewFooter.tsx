import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import provisionLogo from "@/assets/provision-logo.png";
import expWhite from "@/assets/exp-logo-white.png";
import { SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";

const guides = [
  { title: "Buying a Home", href: "/guides/first-time-home-buyers" },
  { title: "Selling Your Home", href: "/guides/sellers" },
  { title: "Investing & House Hacking", href: "/guides/investors" },
];

export default function PreviewFooter() {
  return (
    <footer className="bg-[#0a1424] text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-12 md:flex-row">
          <div className="max-w-sm">
            <img src={provisionLogo} alt="Provision Properties" className="h-11 w-auto brightness-0 invert" />
            <p className="mt-5 text-sm leading-relaxed">
              Lucas Murphy · eXp Realty — Provision Properties Core Team. Metro Milwaukee market
              insights, guides &amp; strategy.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent" /> Milwaukee · Waukesha · Ozaukee · Washington
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-4 font-semibold uppercase tracking-wide text-white">Areas</p>
              <ul className="space-y-2.5">
                {heroCounties.map((c) => (
                  <li key={c.name}>
                    <Link to={c.path} className="inline-flex items-center gap-1 transition-colors hover:text-accent">
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
              <p className="mb-4 font-semibold uppercase tracking-wide text-white">Contact</p>
              <ul className="space-y-2.5">
                <li><a href={SOCIAL.phoneHref} className="transition-colors hover:text-accent">{SOCIAL.phone}</a></li>
                <li><a href="mailto:lucas.murphy@exprealty.com" className="transition-colors hover:text-accent">Email Lucas</a></li>
                <li><Link to="/contact" className="transition-colors hover:text-accent">Contact Page</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs sm:flex-row">
          <p>© 2026 Lucas Murphy Real Estate. Preview design — not the live site.</p>
          <img src={expWhite} alt="eXp Realty" className="h-6 w-auto opacity-80" />
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import provisionLogo from "@/assets/provision-logo.png";
import expLogo from "@/assets/exp-logo.png";

const guideCategories = [
  {
    heading: "Buyer Guides",
    items: [
      { label: "First-Time Home Buyers", to: "https://www.lucasmurphyrealestate.com/guide/first-time-homebuyer-metro-milwaukee", newTab: true },
      { label: "First-Time Condo Buyers", to: "https://www.lucasmurphyrealestate.com/guide/condominium-ownership-guide", newTab: true },
      { label: "Relocation Guide", to: "https://www.lucasmurphyrealestate.com/guide/relocation-guide-metro-milwaukee", newTab: true },
    ],
  },
  {
    heading: "Investor Guides",
    items: [
      { label: "House Hacking", to: "/guides/house-hacking" },
      { label: "Investors", to: "/guides/investors" },
    ],
  },
  {
    heading: "Seller Guides",
    items: [
      { label: "Seller's Guide", to: "/guides/sellers" },
    ],
  },
];

const guides = guideCategories.flatMap((c) => c.items);

const resources = [
  { label: "Contractors", to: "/resources/contractors" },
  { label: "Lenders", to: "/resources/lenders" },
  { label: "Home Inspectors", to: "/resources/home-inspectors" },
  { label: "Home Insurance", to: "/resources/home-insurance" },
  { label: "Seasonal Guide", to: "/resources/seasonal-guide" },
];

const tools = [
  { label: "Mortgage Calculator", to: "/tools/mortgage-calculator" },
  { label: "Budget Spreadsheet", to: "/tools/budget-spreadsheet" },
  { label: "House Hack Calculator", to: "/tools/house-hack-calculator" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container flex h-24 items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="font-display text-sm font-bold text-foreground whitespace-nowrap">
            Lucas Murphy | eXp Realty — Provision Properties Core Team
          </span>
          <span className="text-xs text-muted-foreground">
            Phone: <a href="tel:4144581952" className="hover:text-primary">(414) 458-1952</a> | Email: <a href="mailto:lucasmurphyrei@gmail.com" className="hover:text-primary">lucasmurphyrei@gmail.com</a>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <div className="group relative">
            <button className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
              Guides <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full min-w-[220px] rounded-md border border-border bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              {guideCategories.map((cat, ci) => (
                <div key={cat.heading}>
                  {ci > 0 && <div className="my-1.5 border-t border-border" />}
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{cat.heading}</p>
                  {cat.items.map((g) =>
                    "newTab" in g && g.newTab ? (
                      <a key={g.to} href={g.to} target="_blank" rel="noopener noreferrer" className="block rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary">
                        {g.label}
                      </a>
                    ) : (
                      <Link key={g.to} to={g.to} className="block rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary">
                        {g.label}
                      </Link>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="group relative">
            <button className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
              Tools <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full min-w-[220px] rounded-md border border-border bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              {tools.map((t) => (
                <Link key={t.to} to={t.to} className="block rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary">
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <button className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
              Resources <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full min-w-[200px] rounded-md border border-border bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              {resources.map((r) => (
                <Link key={r.to} to={r.to} className="block rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary">
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/contact" className="rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
            Contact
          </Link>
          <Button asChild size="sm" className="ml-2">
            <a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noopener noreferrer">Schedule a Consultation</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-6 pt-2 md:hidden">
          <button onClick={() => setGuidesOpen(!guidesOpen)} className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground">
            Guides <ChevronDown className={`h-4 w-4 transition-transform ${guidesOpen ? "rotate-180" : ""}`} />
          </button>
          {guidesOpen && guides.map((g) =>
            "newTab" in g && g.newTab ? (
              <a key={g.to} href={g.to} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm text-muted-foreground hover:text-primary">{g.label}</a>
            ) : (
              <Link key={g.to} to={g.to} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm text-muted-foreground hover:text-primary">{g.label}</Link>
            )
          )}
          <button onClick={() => setResourcesOpen(!resourcesOpen)} className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground">
            Resources <ChevronDown className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
          </button>
          {resourcesOpen && resources.map((r) => (
            <Link key={r.to} to={r.to} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm text-muted-foreground hover:text-primary">{r.label}</Link>
          ))}
          <button onClick={() => setToolsOpen(!toolsOpen)} className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground">
            Tools <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
          </button>
          {toolsOpen && tools.map((t) => (
            <Link key={t.to} to={t.to} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm text-muted-foreground hover:text-primary">{t.label}</Link>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">Contact</Link>
          <Button asChild className="mt-2 w-full">
            <a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>Schedule a Consultation</a>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;

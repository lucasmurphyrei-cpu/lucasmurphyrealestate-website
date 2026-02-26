import { Link } from "react-router-dom";
import provisionLogo from "@/assets/provision-logo.png";
import expLogo from "@/assets/exp-logo.png";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container py-12">
      <div className="grid items-start gap-x-12 gap-y-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-bold text-foreground">Lucas Murphy</p>
          <h3 className="mt-1 text-sm font-medium text-muted-foreground whitespace-nowrap">eXp Realty — Provision Properties Core Team</h3>
          <p className="mt-4 text-sm text-muted-foreground">Serving Milwaukee, Waukesha, Washington & Ozaukee Counties with expert real estate guidance.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Guides</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://www.lucasmurphyrealestate.com/guide/first-time-homebuyer-metro-milwaukee" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">First-Time Home Buyers</a></li>
            <li><a href="https://www.lucasmurphyrealestate.com/guide/condominium-ownership-guide" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">First-Time Condo Buyers</a></li>
            <li><Link to="/guides/relocation" className="hover:text-primary transition-colors">Relocation Guide</Link></li>
            <li><Link to="/guides/house-hacking" className="hover:text-primary transition-colors">House Hacking</Link></li>
            <li><Link to="/guides/investors" className="hover:text-primary transition-colors">Investors</Link></li>
            <li><Link to="/guides/sellers" className="hover:text-primary transition-colors">Seller's Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/resources/contractors" className="hover:text-primary transition-colors">Contractors</Link></li>
            <li><Link to="/resources/lenders" className="hover:text-primary transition-colors">Lenders</Link></li>
            <li><Link to="/resources/home-inspectors" className="hover:text-primary transition-colors">Home Inspectors</Link></li>
            <li><Link to="/resources/home-insurance" className="hover:text-primary transition-colors">Home Insurance</Link></li>
            <li><Link to="/resources/seasonal-guide" className="hover:text-primary transition-colors">Seasonal Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-primary transition-colors">Get In Touch</Link></li>
            <li><a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Schedule a Consultation</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center gap-6">
        <img src={provisionLogo} alt="Provision Properties Core Team logo" className="h-48 w-auto" />
        <img src={expLogo} alt="eXp Realty logo" className="h-12 w-auto" />
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Provision Properties Core Team — eXp Realty. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

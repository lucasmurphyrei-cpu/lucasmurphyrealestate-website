import { Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 bg-navy-deep text-white/60 border-t border-white/10">
      <div className="container mx-auto px-4 text-center font-sans">
        <p className="font-bold text-white text-lg mb-1">Lucas Murphy</p>
        <p className="text-sm mb-4">Realtor® – eXp Realty | Milwaukee, Wisconsin</p>
        <div className="flex items-center justify-center gap-6 mb-4">
          <a href="mailto:Lucas.Murphy@exprealty.com" className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
            <Mail className="h-4 w-4" />
            Lucas.Murphy@exprealty.com
          </a>
          <a href="https://LucasMurphy.exprealty.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
            <Globe className="h-4 w-4" />
            LucasMurphy.exprealty.com
          </a>
        </div>
        <p className="text-xs text-white/30">© 2026 Lucas Murphy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

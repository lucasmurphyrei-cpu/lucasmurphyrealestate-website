import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LayoutRoute from "@/components/LayoutRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import FirstTimeHomeBuyers from "./pages/guides/FirstTimeHomeBuyers";
import FirstTimeCondoBuyers from "./pages/guides/FirstTimeCondoBuyers";
import Relocation from "./pages/guides/Relocation";
import HouseHacking from "./pages/guides/HouseHacking";
import Investors from "./pages/guides/Investors";
import ContractorsPage from "./pages/resources/Contractors";
import LendersPage from "./pages/resources/Lenders";
import HomeInspectorsPage from "./pages/resources/HomeInspectors";
import HomeInsurancePage from "./pages/resources/HomeInsurance";
import MortgageCalculator from "./pages/tools/MortgageCalculator";
import BudgetSpreadsheet from "./pages/tools/BudgetSpreadsheet";
import HouseHackCalculator from "./pages/tools/HouseHackCalculator";
import MilwaukeeCounty from "./pages/areas/MilwaukeeCounty";
import OzaukeeCounty from "./pages/areas/OzaukeeCounty";
import WaukeshaCounty from "./pages/areas/WaukeshaCounty";
import WashingtonCounty from "./pages/areas/WashingtonCounty";
import MunicipalityReport from "./pages/areas/MunicipalityReport";
import FirstTimeHomeBuyersGuide from "./pages/FirstTimeHomeBuyersGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Standalone landing page — no main site navbar/footer */}
            <Route path="/first-time-homebuyers-guide" element={<FirstTimeHomeBuyersGuide />} />

            {/* All other pages use the main site Layout (navbar + footer) */}
            <Route element={<LayoutRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guides/first-time-home-buyers" element={<FirstTimeHomeBuyers />} />
              <Route path="/guides/first-time-condo-buyers" element={<FirstTimeCondoBuyers />} />
              <Route path="/guides/relocation" element={<Relocation />} />
              <Route path="/guides/house-hacking" element={<HouseHacking />} />
              <Route path="/guides/investors" element={<Investors />} />
              <Route path="/resources/contractors" element={<ContractorsPage />} />
              <Route path="/resources/lenders" element={<LendersPage />} />
              <Route path="/resources/home-inspectors" element={<HomeInspectorsPage />} />
              <Route path="/resources/home-insurance" element={<HomeInsurancePage />} />
              <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/tools/budget-spreadsheet" element={<BudgetSpreadsheet />} />
              <Route path="/tools/house-hack-calculator" element={<HouseHackCalculator />} />
              <Route path="/areas/milwaukee-county" element={<MilwaukeeCounty />} />
              <Route path="/areas/ozaukee-county" element={<OzaukeeCounty />} />
              <Route path="/areas/waukesha-county" element={<WaukeshaCounty />} />
              <Route path="/areas/washington-county" element={<WashingtonCounty />} />
              <Route path="/areas/:county/:municipality" element={<MunicipalityReport />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

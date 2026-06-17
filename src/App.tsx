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
import Investors from "./pages/guides/Investors";
import GuidesOverview from "./pages/guides/GuidesOverview";
import SellersPage from "./pages/guides/Sellers";
import ContractorsPage from "./pages/resources/Contractors";
import LendersPage from "./pages/resources/Lenders";
import HomeInspectorsPage from "./pages/resources/HomeInspectors";
import HomeInsurancePage from "./pages/resources/HomeInsurance";
import SeasonalGuidePage from "./pages/resources/SeasonalGuide";
import MoversPage from "./pages/resources/Movers";
import MortgageCalculator from "./pages/tools/MortgageCalculator";
import BudgetSpreadsheet from "./pages/tools/BudgetSpreadsheet";
import BudgetPlanner from "./pages/tools/budget-planner/BudgetPlanner";
import HouseHackCalculator from "./pages/tools/HouseHackCalculator";
import InvestorSpreadsheets from "./pages/tools/InvestorSpreadsheets";
import CMA from "./pages/tools/CMA";
import MilwaukeeCounty from "./pages/areas/MilwaukeeCounty";
import OzaukeeCounty from "./pages/areas/OzaukeeCounty";
import WaukeshaCounty from "./pages/areas/WaukeshaCounty";
import WashingtonCounty from "./pages/areas/WashingtonCounty";
import MunicipalityReport from "./pages/areas/MunicipalityReport";
import FirstTimeHomeBuyersGuide from "./pages/FirstTimeHomeBuyersGuide";
import PreviewV1 from "./pages/preview/PreviewV1";
import PreviewV2 from "./pages/preview/PreviewV2";
import MarketHub from "./pages/preview/market/MarketHub";
import MarketCounty from "./pages/preview/market/MarketCounty";
import MarketMunicipality from "./pages/preview/market/MarketMunicipality";
import ListingsHub from "./pages/preview/listings/ListingsHub";
import ListingsCounty from "./pages/preview/listings/ListingsCounty";
import PreviewContact from "./pages/preview/PreviewContact";
import PreviewAbout from "./pages/preview/PreviewAbout";
import PreviewServices from "./pages/preview/PreviewServices";
import PreviewGuides from "./pages/preview/PreviewGuides";
import GuideLeadLanding from "./pages/preview/guides/GuideLeadLanding";
import ResourceListing from "./pages/preview/ResourceListing";
import SellerNetSheet from "./pages/preview/tools/SellerNetSheet";
import PreviewMortgageCalculator from "./pages/preview/tools/MortgageCalculator";
import PreviewBudgetPlanner from "./pages/preview/tools/BudgetPlanner";
import PreviewBudgetPlannerDetailed from "./pages/preview/tools/BudgetPlannerDetailed";
import PreviewBudgetPlannerStart from "./pages/preview/tools/BudgetPlannerStart";
import PreviewBudgetSpreadsheet from "./pages/preview/tools/BudgetSpreadsheet";
import PreviewCMA from "./pages/preview/tools/CMA";
import PreviewHouseHack from "./pages/preview/tools/HouseHackCalculator";
import PreviewInvestorSpreadsheets from "./pages/preview/tools/InvestorSpreadsheets";
import ServiceLanding from "./pages/preview/services/ServiceLanding";
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

            {/* ===== Primary site — promoted redesign, standalone header/footer ===== */}
            <Route path="/" element={<PreviewV1 />} />
            <Route path="/about" element={<PreviewAbout />} />
            <Route path="/services" element={<PreviewServices />} />
            <Route path="/buying" element={<ServiceLanding service="buying" />} />
            <Route path="/selling" element={<ServiceLanding service="selling" />} />
            <Route path="/investing" element={<ServiceLanding service="investing" />} />
            <Route path="/contact" element={<PreviewContact />} />

            {/* Guides */}
            <Route path="/guides" element={<PreviewGuides />} />
            <Route path="/guides/first-time-home-buyers" element={<GuideLeadLanding slug="first-time-home-buyers" />} />
            <Route path="/guides/relocation" element={<GuideLeadLanding slug="relocation" />} />
            <Route path="/guides/first-time-condo-buyers" element={<GuideLeadLanding slug="first-time-condo-buyers" />} />
            <Route path="/guides/house-hacking" element={<GuideLeadLanding slug="house-hacking" />} />
            <Route path="/guides/sellers" element={<GuideLeadLanding slug="sellers" />} />
            <Route path="/guides/investors" element={<GuideLeadLanding slug="investors" />} />

            {/* Tools + vendors */}
            <Route path="/tools" element={<ResourceListing variant="tools" />} />
            <Route path="/vendors" element={<ResourceListing variant="vendors" />} />
            <Route path="/tools/seller-net-sheet" element={<SellerNetSheet />} />
            <Route path="/tools/mortgage-calculator" element={<PreviewMortgageCalculator />} />
            <Route path="/tools/budget-planner" element={<PreviewBudgetPlannerStart />} />
            <Route path="/tools/budget-planner/quick" element={<PreviewBudgetPlanner />} />
            <Route path="/tools/budget-planner/in-depth" element={<PreviewBudgetPlannerDetailed />} />
            <Route path="/tools/budget-spreadsheet" element={<PreviewBudgetSpreadsheet />} />
            <Route path="/tools/cma" element={<PreviewCMA />} />
            <Route path="/tools/house-hack-calculator" element={<PreviewHouseHack />} />
            <Route path="/tools/investor-spreadsheets" element={<PreviewInvestorSpreadsheets />} />

            {/* Listings */}
            <Route path="/listings" element={<ListingsHub />} />
            <Route path="/listings/:county" element={<ListingsCounty />} />

            {/* Market */}
            <Route path="/market" element={<MarketHub />} />
            <Route path="/market/:county" element={<MarketCounty />} />
            <Route path="/market/:county/:municipality" element={<MarketMunicipality />} />

            {/* Secondary preview kept reachable */}
            <Route path="/preview/v2" element={<PreviewV2 />} />

            {/* ===== Legacy resource pages kept live (old layout) until redesigned ===== */}
            <Route element={<LayoutRoute />}>
              <Route path="/resources/contractors" element={<ContractorsPage />} />
              <Route path="/resources/lenders" element={<LendersPage />} />
              <Route path="/resources/home-inspectors" element={<HomeInspectorsPage />} />
              <Route path="/resources/home-insurance" element={<HomeInsurancePage />} />
              <Route path="/resources/seasonal-guide" element={<SeasonalGuidePage />} />
              <Route path="/resources/movers" element={<MoversPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

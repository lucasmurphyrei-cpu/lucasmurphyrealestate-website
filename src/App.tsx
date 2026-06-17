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

            {/* Redesign previews — standalone, additive, non-destructive (not linked in nav) */}
            <Route path="/preview/v1" element={<PreviewV1 />} />
            <Route path="/preview/v2" element={<PreviewV2 />} />
            <Route path="/preview/v1/contact" element={<PreviewContact />} />
            <Route path="/preview/v1/about" element={<PreviewAbout />} />
            <Route path="/preview/v1/services" element={<PreviewServices />} />
            <Route path="/preview/v1/guides" element={<PreviewGuides />} />
            <Route path="/preview/v1/guides/first-time-home-buyers" element={<GuideLeadLanding slug="first-time-home-buyers" />} />
            <Route path="/preview/v1/guides/relocation" element={<GuideLeadLanding slug="relocation" />} />
            <Route path="/preview/v1/guides/first-time-condo-buyers" element={<GuideLeadLanding slug="first-time-condo-buyers" />} />
            <Route path="/preview/v1/guides/house-hacking" element={<GuideLeadLanding slug="house-hacking" />} />
            <Route path="/preview/v1/guides/sellers" element={<GuideLeadLanding slug="sellers" />} />
            <Route path="/preview/v1/guides/investors" element={<GuideLeadLanding slug="investors" />} />
            <Route path="/preview/v1/tools" element={<ResourceListing variant="tools" />} />
            <Route path="/preview/v1/vendors" element={<ResourceListing variant="vendors" />} />
            <Route path="/preview/v1/tools/seller-net-sheet" element={<SellerNetSheet />} />
            <Route path="/preview/v1/tools/mortgage-calculator" element={<PreviewMortgageCalculator />} />
            <Route path="/preview/v1/tools/budget-planner" element={<PreviewBudgetPlannerStart />} />
            <Route path="/preview/v1/tools/budget-planner/quick" element={<PreviewBudgetPlanner />} />
            <Route path="/preview/v1/tools/budget-planner/in-depth" element={<PreviewBudgetPlannerDetailed />} />
            <Route path="/preview/v1/tools/budget-spreadsheet" element={<PreviewBudgetSpreadsheet />} />
            <Route path="/preview/v1/tools/cma" element={<PreviewCMA />} />
            <Route path="/preview/v1/tools/house-hack-calculator" element={<PreviewHouseHack />} />
            <Route path="/preview/v1/tools/investor-spreadsheets" element={<PreviewInvestorSpreadsheets />} />
            <Route path="/preview/v1/buying" element={<ServiceLanding service="buying" />} />
            <Route path="/preview/v1/selling" element={<ServiceLanding service="selling" />} />
            <Route path="/preview/v1/investing" element={<ServiceLanding service="investing" />} />
            <Route path="/preview/v1/listings" element={<ListingsHub />} />
            <Route path="/preview/v1/listings/:county" element={<ListingsCounty />} />
            <Route path="/preview/v1/market" element={<MarketHub />} />
            <Route path="/preview/v1/market/:county" element={<MarketCounty />} />
            <Route path="/preview/v1/market/:county/:municipality" element={<MarketMunicipality />} />

            {/* All other pages use the main site Layout (navbar + footer) */}
            <Route element={<LayoutRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guides" element={<GuidesOverview />} />
              <Route path="/guides/first-time-home-buyers" element={<FirstTimeHomeBuyers />} />
              <Route path="/guides/first-time-condo-buyers" element={<FirstTimeCondoBuyers />} />
              <Route path="/guides/relocation" element={<Relocation />} />
              <Route path="/guides/investors" element={<Investors />} />
              <Route path="/guides/sellers" element={<SellersPage />} />
              <Route path="/resources/contractors" element={<ContractorsPage />} />
              <Route path="/resources/lenders" element={<LendersPage />} />
              <Route path="/resources/home-inspectors" element={<HomeInspectorsPage />} />
              <Route path="/resources/home-insurance" element={<HomeInsurancePage />} />
              <Route path="/resources/seasonal-guide" element={<SeasonalGuidePage />} />
              <Route path="/resources/movers" element={<MoversPage />} />
              <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/tools/budget-spreadsheet" element={<BudgetSpreadsheet />} />
              <Route path="/tools/budget-planner" element={<BudgetPlanner />} />
              <Route path="/tools/house-hack-calculator" element={<HouseHackCalculator />} />
              <Route path="/tools/investor-spreadsheets" element={<InvestorSpreadsheets />} />
              <Route path="/tools/cma" element={<CMA />} />
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

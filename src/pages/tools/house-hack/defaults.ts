import type { HouseHackState } from "./types";

export const DEFAULT_STATE: HouseHackState = {
  propertyType: "duplex",
  mode: "owner-occupied",
  investment: {
    purchasePrice: 0,
    downPaymentPercent: 0,
    financingType: "conventional",
    fhaUpfrontMIPPercent: 1.75,
    downPaymentAssistance: 0,
    closingCostsPercent: 0,
    initialRepairs: 0,
    interestRate: 0,
    loanTermYears: 30,
    monthlyTaxes: 0,
    monthlyInsurance: 0,
    monthlyMortgageInsurance: 0,
  },
  ownerOccupiedIncome: {
    unit1Rent: 0,
    unit2Rent: 0,
    unit3Rent: 0,
    unit4Rent: 0,
    otherIncome: 0,
    vacancyPercent: 0,
  },
  allUnitsIncome: {
    unit1Rent: 0,
    unit2Rent: 0,
    unit3Rent: 0,
    unit4Rent: 0,
    otherIncome: 0,
    vacancyPercent: 0,
  },
  ownerOccupiedExpenses: {
    maintenanceDollar: 0,
    capexDollar: 0,
    vacancyDollar: 0,
    managementDollar: 0,
    utilities: 0,
    trash: 0,
    lawnSnow: 0,
    other: 0,
  },
  allUnitsExpenses: {
    maintenanceDollar: 0,
    capexDollar: 0,
    vacancyDollar: 0,
    managementDollar: 0,
    utilities: 0,
    trash: 0,
    lawnSnow: 0,
    other: 0,
  },
  ownerOccupiedExtras: {
    currentRent: 0,
    appreciationPercent: 0,
    rentGrowthPercent: 0,
  },
  allUnitsExtras: {
    appreciationPercent: 0,
  },
};

// Re-exported from the single table in src/lib/countyTaxRates.ts. These values used to
// live here, which made a page component the de facto owner of a business fact.
export { COUNTY_TAX_RATES } from "@/lib/countyTaxRates";

export const PROPERTY_TYPE_UNITS = {
  duplex: 2,
  triplex: 3,
  fourplex: 4,
} as const;

export const FREDDIE_MAC_RATES_URL = "https://www.freddiemac.com/pmms";

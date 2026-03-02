import type { HouseHackState } from "./types";

export const DEFAULT_STATE: HouseHackState = {
  propertyType: "duplex",
  mode: "owner-occupied",
  investment: {
    purchasePrice: 295000,
    downPaymentPercent: 3.0,
    financingType: "conventional",
    fhaUpfrontMIPPercent: 1.75,
    downPaymentAssistance: 0,
    closingCostsPercent: 2.4,
    initialRepairs: 0,
    interestRate: 6.0,
    loanTermYears: 30,
    monthlyTaxes: 358,
    monthlyInsurance: 125,
    monthlyMortgageInsurance: 71,
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
    vacancyPercent: 5,
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
    appreciationPercent: 3.0,
    rentGrowthPercent: 3.0,
  },
  allUnitsExtras: {
    appreciationPercent: 3.0,
  },
};

export const COUNTY_TAX_RATES = {
  milwaukee: { name: "Milwaukee County", rate: 2.58 },
  waukesha: { name: "Waukesha County", rate: 1.856 },
  ozaukee: { name: "Ozaukee County", rate: 1.58 },
  washington: { name: "Washington County", rate: 1.76 },
} as const;

export const PROPERTY_TYPE_UNITS = {
  duplex: 2,
  triplex: 3,
  fourplex: 4,
} as const;

export const FREDDIE_MAC_RATES_URL = "https://www.freddiemac.com/pmms";

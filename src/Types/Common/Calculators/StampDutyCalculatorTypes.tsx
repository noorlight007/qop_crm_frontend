export interface FormData {
  propertyType: "freehold" | "leasehold" | "";
  propertyUse: "residential" | "non-residential" | "";
  effectiveDay: string;
  effectiveMonth: string;
  effectiveYear: string;
  isNonUKResident: boolean | null;
  isPurchasingAsIndividual: boolean | null;
  willOwnMultipleProperties: boolean | null;
  isReplacingMainResidence: boolean | null;
  hasEverOwnedProperty: boolean | null;
  willThisBeMainResidence: boolean | null;
  isSharedOwnership: boolean | null;
  sharedMarketValueOption: "lte500k" | "gt500k" | "";
  sharedMarketValueElection: "market" | "stages" | "";
  sharedOwnershipMarketValue: string;
  sharedOwnershipInitialShare: string;
  leaseStartDay: string;
  leaseStartMonth: string;
  leaseStartYear: string;
  leaseEndDay: string;
  leaseEndMonth: string;
  leaseEndYear: string;
  purchasePrice: string;
  yearlyRents: string[]; // Dynamic array for each year's rent
}

export interface CalculationBreakdown {
  band: string;
  amount: number;
  rate: number;
  tax: number;
}

export interface LeaseTerm {
  years: number;
  days: number;
  totalDays: number;
  totalYears: number;
  calendarYearsSpanned?: number; // Number of distinct calendar years
}
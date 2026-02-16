import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Progress,
  Row,
  Table,
} from "reactstrap";

// Types
interface FormData {
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

interface CalculationBreakdown {
  band: string;
  amount: number;
  rate: number;
  tax: number;
}

interface LeaseTerm {
  years: number;
  days: number;
  totalDays: number;
  totalYears: number;
  calendarYearsSpanned?: number; // Number of distinct calendar years
}

const StampDutyCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    propertyUse: "",
    effectiveDay: "",
    effectiveMonth: "",
    effectiveYear: "",
    isNonUKResident: null,
    isPurchasingAsIndividual: null,
    willOwnMultipleProperties: null,
    isReplacingMainResidence: null,
    hasEverOwnedProperty: null,
    willThisBeMainResidence: null,
    isSharedOwnership: null,
    sharedMarketValueOption: "",
    sharedMarketValueElection: "",
    sharedOwnershipMarketValue: "",
    sharedOwnershipInitialShare: "",
    leaseStartDay: "",
    leaseStartMonth: "",
    leaseStartYear: "",
    leaseEndDay: "",
    leaseEndMonth: "",
    leaseEndYear: "",
    purchasePrice: "",
    yearlyRents: [],
  });

  const [leaseTerm, setLeaseTerm] = useState<LeaseTerm | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calculationResult, setCalculationResult] = useState<{
    totalTax: number;
    premiumBreakdown: CalculationBreakdown[];
    rentBreakdown: CalculationBreakdown[];
    rentNPV: number;
    premiumTax: number;
    rentTax: number;
  } | null>(null);

  // Calculate lease term when dates are set
  useEffect(() => {
    if (
      formData.propertyType === "leasehold" &&
      formData.leaseStartDay &&
      formData.leaseStartMonth &&
      formData.leaseStartYear &&
      formData.leaseEndDay &&
      formData.leaseEndMonth &&
      formData.leaseEndYear
    ) {
      // Validate dates are complete and numeric
      const startDay = parseInt(formData.leaseStartDay);
      const startMonth = parseInt(formData.leaseStartMonth);
      const startYear = parseInt(formData.leaseStartYear);
      const endDay = parseInt(formData.leaseEndDay);
      const endMonth = parseInt(formData.leaseEndMonth);
      const endYear = parseInt(formData.leaseEndYear);

      // Check all values are valid numbers
      if (
        isNaN(startDay) ||
        isNaN(startMonth) ||
        isNaN(startYear) ||
        isNaN(endDay) ||
        isNaN(endMonth) ||
        isNaN(endYear)
      ) {
        return;
      }

      try {
        const term = calculateLeaseTerm();

        // Validate lease term
        if (
          !term ||
          isNaN(term.totalYears) ||
          term.totalYears <= 0 ||
          !isFinite(term.totalYears)
        ) {
          return;
        }

        setLeaseTerm(term);

        // Initialize rent array based on calendar years spanned (up to 5 years max)
        const yearsToCollect = Math.min(
          term.calendarYearsSpanned || Math.ceil(term.totalYears),
          5,
        );

        // Additional validation for array length
        if (
          isNaN(yearsToCollect) ||
          yearsToCollect < 1 ||
          yearsToCollect > 100
        ) {
          return;
        }

        if (formData.yearlyRents.length !== yearsToCollect) {
          setFormData((prev) => ({
            ...prev,
            yearlyRents: new Array(yearsToCollect).fill(""),
          }));
        }
      } catch (error) {
        console.error("Error calculating lease term:", error);
      }
    }
  }, [
    formData.leaseStartDay,
    formData.leaseStartMonth,
    formData.leaseStartYear,
    formData.leaseEndDay,
    formData.leaseEndMonth,
    formData.leaseEndYear,
    formData.propertyType,
  ]);

  const calculateLeaseTerm = (): LeaseTerm => {
    const startDate = new Date(
      parseInt(formData.leaseStartYear),
      parseInt(formData.leaseStartMonth) - 1,
      parseInt(formData.leaseStartDay),
    );
    const endDate = new Date(
      parseInt(formData.leaseEndYear),
      parseInt(formData.leaseEndMonth) - 1,
      parseInt(formData.leaseEndDay),
    );

    // Validate dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { years: 0, days: 0, totalDays: 0, totalYears: 0 };
    }

    // Ensure end date is after start date
    if (endDate <= startDate) {
      return { years: 0, days: 0, totalDays: 0, totalYears: 0 };
    }

    const diffTime = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays - years * 365;

    // ✅ Calculate calendar years spanned (for rent input fields)
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const calendarYearsSpanned = endYear - startYear + 1;

    return {
      years,
      days: remainingDays,
      totalDays,
      totalYears: totalDays / 365.25,
      calendarYearsSpanned, // NEW: number of distinct calendar years
    };
  };

  // NPV Calculation following HMRC rules
  const calculateNPV = (
    yearlyRents: number[],
    totalYears: number,
    calendarYearsSpanned?: number,
  ): number => {
    // Validate inputs
    if (
      !yearlyRents ||
      yearlyRents.length === 0 ||
      isNaN(totalYears) ||
      totalYears <= 0 ||
      !isFinite(totalYears)
    ) {
      return 0;
    }

    const discountRate = 0.035; // 3.5% HMRC standard rate
    let npv = 0;

    // ✅ Use calendar years spanned for NPV calculation (each calendar year gets full year treatment)
    const yearsToCalculate =
      calendarYearsSpanned || Math.min(Math.ceil(totalYears), 5);

    // Validate yearsToCalculate
    if (isNaN(yearsToCalculate) || yearsToCalculate < 1) {
      return 0;
    }

    // Calculate NPV for each calendar year (up to 5 years)
    const yearsToUse = Math.min(yearsToCalculate, 5);

    for (let i = 0; i < yearsToUse && i < yearlyRents.length; i++) {
      const rent = yearlyRents[i] || 0;
      if (isFinite(rent) && rent >= 0) {
        npv += rent / Math.pow(1 + discountRate, i + 1);
      }
    }

    // If lease spans more than 5 calendar years, use highest rent from first 5 years for remaining years
    if (yearsToCalculate > 5) {
      const validRents = yearlyRents
        .slice(0, yearsToUse)
        .filter((r) => isFinite(r) && r >= 0);
      if (validRents.length > 0) {
        const highestRent = Math.max(...validRents);
        const remainingYears = yearsToCalculate - yearsToUse;

        for (let i = yearsToUse; i < yearsToUse + remainingYears; i++) {
          npv += highestRent / Math.pow(1 + discountRate, i + 1);
        }
      }
    }

    return npv;
  };

  const calculateSDLT = () => {
    // ✅ Determine which price to use based on shared ownership selection
    let price;

    if (
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === "lte500k"
    ) {
      if (formData.sharedMarketValueElection === "market") {
        price = parseFloat(
          formData.sharedOwnershipMarketValue.replace(/,/g, ""),
        );
      } else if (formData.sharedMarketValueElection === "stages") {
        price = parseFloat(
          formData.sharedOwnershipInitialShare.replace(/,/g, ""),
        );
      } else {
        price = parseFloat(formData.purchasePrice.replace(/,/g, ""));
      }
    } else {
      price = parseFloat(formData.purchasePrice.replace(/,/g, ""));
    }

    const {
      propertyUse,
      propertyType,
      isNonUKResident,
      isPurchasingAsIndividual,
      willOwnMultipleProperties,
      isReplacingMainResidence,
    } = formData;

    let premiumTax = 0;
    let rentTax = 0;
    const premiumBreakdown: CalculationBreakdown[] = [];
    const rentBreakdown: CalculationBreakdown[] = [];
    let rentNPV = 0;

    // CORRECTED SURCHARGE LOGIC FOR RESIDENTIAL PROPERTIES
    let purchasePriceSurcharge = 0;
    let rentSurcharge = 0;

    if (propertyUse === "residential") {
      if (isPurchasingAsIndividual === true) {
        // INDIVIDUAL PURCHASERS

        // Additional property surcharge: +5%
        // ONLY applies when:
        // 1. willOwnMultipleProperties === true (owning 2+ properties after purchase)
        // 2. isReplacingMainResidence !== true (not replacing main residence)
        if (
          willOwnMultipleProperties === true &&
          isReplacingMainResidence !== true
        ) {
          // For FREEHOLD: surcharge applies to purchase price
          if (propertyType === "freehold") {
            purchasePriceSurcharge += 5;
          }
          // For LEASEHOLD: surcharge applies to both premium and rent
          else if (propertyType === "leasehold") {
            purchasePriceSurcharge += 5;
            rentSurcharge += 5;
          }
        }

        // Non-UK resident individual: +2%
        // ONLY applies when willOwnMultipleProperties === true OR when replacing main residence
        if (isNonUKResident === true) {
          if (propertyType === "freehold") {
            // Freehold: non-resident surcharge applies when:
            // - Owning multiple properties (regardless of replacing main residence)
            // - OR replacing main residence
            if (
              willOwnMultipleProperties === true ||
              isReplacingMainResidence === true
            ) {
              purchasePriceSurcharge += 2;
            }
          } else if (propertyType === "leasehold") {
            // Leasehold: non-resident surcharge applies ONLY when:
            // - willOwnMultipleProperties === true AND isReplacingMainResidence !== true
            if (
              willOwnMultipleProperties === true &&
              isReplacingMainResidence !== true
            ) {
              purchasePriceSurcharge += 2;
              rentSurcharge += 2;
            }
          }
        }
      } else if (isPurchasingAsIndividual === false) {
        // COMPANY/TRUST PURCHASERS
        // Company surcharge ONLY applies to FREEHOLD, NOT leasehold
        if (propertyType === "freehold") {
          if (isNonUKResident === true) {
            // Non-UK resident company (freehold): +7%
            purchasePriceSurcharge = 7;
          } else {
            // UK resident company (freehold): +5%
            purchasePriceSurcharge = 5;
          }
        }
        // For leasehold: no company surcharge applies (purchasePriceSurcharge stays 0)
      }
    }

    // Calculate premium/purchase price tax
    if (propertyUse === "residential") {
      // ✅ Check if First-Time Buyers Relief applies
      // Applies when:
      // 1. Never owned property before (hasEverOwnedProperty === false)
      // 2. Will be main residence (willThisBeMainResidence === true)
      // 3. Shared ownership with market value ≤£500k
      const qualifiesForFTBRelief =
        formData.hasEverOwnedProperty === false &&
        formData.willThisBeMainResidence === true &&
        formData.isSharedOwnership === true &&
        formData.sharedMarketValueOption === "lte500k";

      let rates;

      if (qualifiesForFTBRelief) {
        // First-Time Buyers Relief rates for shared ownership
        rates = [
          { min: 0, max: 300000, rate: 0 },
          { min: 300001, max: 500000, rate: 5 },
          { min: 500001, max: Infinity, rate: 5 }, // Fallback (shouldn't reach here if ≤500k)
        ];
      } else {
        // Standard residential rates
        rates = [
          { min: 0, max: 125000, rate: 0 },
          { min: 125001, max: 250000, rate: 2 },
          { min: 250001, max: 925000, rate: 5 },
          { min: 925001, max: 1500000, rate: 10 },
          { min: 1500001, max: Infinity, rate: 12 },
        ];
      }

      for (const band of rates) {
        if (price > band.min) {
          const taxableAmount =
            Math.min(price, band.max) - Math.max(band.min - 1, 0);
          if (taxableAmount > 0) {
            let effectiveRate = band.rate + purchasePriceSurcharge;

            const bandTax = (taxableAmount * effectiveRate) / 100;
            premiumTax += bandTax;

            // Format band description
            let bandDescription;
            if (qualifiesForFTBRelief) {
              // First-Time Buyers Relief band descriptions
              if (band.min === 0) {
                bandDescription = `Up to ${band.max.toLocaleString()}`;
              } else if (band.max === Infinity) {
                bandDescription = `Above ${(band.min - 1).toLocaleString()}+`;
              } else {
                bandDescription = `Above ${(band.min - 1).toLocaleString()} and up to ${band.max.toLocaleString()}`;
              }
            } else {
              // Standard band descriptions
              bandDescription =
                band.min === 0
                  ? `Up to ${band.max.toLocaleString()}`
                  : band.max === Infinity
                    ? `Above ${(band.min - 1).toLocaleString()}+`
                    : `Above ${(band.min - 1).toLocaleString()} and up to ${band.max.toLocaleString()}`;
            }

            premiumBreakdown.push({
              band: bandDescription,
              amount: taxableAmount,
              rate: effectiveRate,
              tax: bandTax,
            });
          }
        }
      }
    } else {
      // Non-residential rates (NO surcharges apply)
      const rates = [
        { min: 0, max: 150000, rate: 0 },
        { min: 150001, max: 250000, rate: 2 },
        { min: 250001, max: Infinity, rate: 5 },
      ];

      for (const band of rates) {
        if (price > band.min) {
          const taxableAmount =
            Math.min(price, band.max) - Math.max(band.min - 1, 0);
          if (taxableAmount > 0) {
            const bandTax = (taxableAmount * band.rate) / 100;
            premiumTax += bandTax;

            premiumBreakdown.push({
              band:
                band.min === 0
                  ? `Up to ${band.max.toLocaleString()}`
                  : band.max === Infinity
                    ? `Above ${(band.min - 1).toLocaleString()}+`
                    : `Above ${(band.min - 1).toLocaleString()} and up to ${band.max.toLocaleString()}`,
              amount: taxableAmount,
              rate: band.rate,
              tax: bandTax,
            });
          }
        }
      }
    }

    // Calculate leasehold rent tax
    if (propertyType === "leasehold" && leaseTerm && leaseTerm.totalYears > 0) {
      const yearlyRentValues = formData.yearlyRents.map(
        (r) => parseFloat(r.replace(/,/g, "")) || 0,
      );
      rentNPV = calculateNPV(
        yearlyRentValues,
        leaseTerm.totalYears,
        leaseTerm.calendarYearsSpanned,
      );

      if (propertyUse === "residential") {
        if (rentNPV > 125000) {
          const taxableRent = rentNPV - 125000;
          let rentRate = 1 + rentSurcharge;

          rentTax = (taxableRent * rentRate) / 100;

          rentBreakdown.push({
            band: "Up to 125,000",
            amount: 125000,
            rate: 0,
            tax: 0,
          });
          rentBreakdown.push({
            band: "Above 125,000+",
            amount: taxableRent,
            rate: rentRate,
            tax: rentTax,
          });
        } else {
          rentBreakdown.push({
            band: "Up to 125,000",
            amount: rentNPV,
            rate: 0,
            tax: 0,
          });
        }
      } else {
        // Non-residential leasehold rent (NO surcharges)
        if (rentNPV > 150000) {
          const firstBandAmount = Math.min(rentNPV - 150000, 5000000 - 150000);
          const secondBandAmount = Math.max(0, rentNPV - 5000000);

          rentBreakdown.push({
            band: "Up to 150,000",
            amount: 150000,
            rate: 0,
            tax: 0,
          });

          if (firstBandAmount > 0) {
            const firstBandTax = (firstBandAmount * 1) / 100;
            rentTax += firstBandTax;

            rentBreakdown.push({
              band: "Above 150,000 and up to 5,000,000",
              amount: firstBandAmount,
              rate: 1,
              tax: firstBandTax,
            });
          }

          if (secondBandAmount > 0) {
            const secondBandTax = (secondBandAmount * 2) / 100;
            rentTax += secondBandTax;

            rentBreakdown.push({
              band: "Above 5,000,000+",
              amount: secondBandAmount,
              rate: 2,
              tax: secondBandTax,
            });
          }
        } else {
          rentBreakdown.push({
            band: "Up to 150,000",
            amount: rentNPV,
            rate: 0,
            tax: 0,
          });
        }
      }
    }

    setCalculationResult({
      totalTax: premiumTax + rentTax,
      premiumBreakdown,
      rentBreakdown,
      rentNPV,
      premiumTax,
      rentTax,
    });
  };

  const getTotalSteps = (): number => {
    let steps = 3; // Property type, property use, effective date

    if (formData.propertyUse === "residential") {
      steps++; // Non-UK resident question

      if (formData.isNonUKResident !== null) {
        steps++; // Individual purchase question

        if (formData.isPurchasingAsIndividual === true) {
          steps++; // Multiple properties question

          if (formData.willOwnMultipleProperties === true) {
            steps++; // Replacing main residence question
          } else if (formData.willOwnMultipleProperties === false) {
            steps++; // Have you ever owned or part-owned another property?

            if (formData.hasEverOwnedProperty === true) {
              // No additional questions - go straight to lease dates
            } else if (formData.hasEverOwnedProperty === false) {
              steps++; // Will this property be your main residence?

              // ✅ After main residence question, ask shared ownership ONLY if:
              // - leasehold AND willThisBeMainResidence === true
              if (
                formData.propertyType === "leasehold" &&
                formData.willThisBeMainResidence === true
              ) {
                steps++; // Shared ownership question
                if (formData.isSharedOwnership === true) {
                  steps++; // Market value question
                  if (formData.sharedMarketValueOption === "lte500k") {
                    steps++; // Market value election

                    // ✅ Price input after election
                    if (
                      formData.sharedMarketValueElection === "market" ||
                      formData.sharedMarketValueElection === "stages"
                    ) {
                      steps++; // Price input (market value or initial share)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (formData.propertyType === "leasehold") {
      steps += 2; // Lease start and end dates
    }

    // ✅ Only add purchase price step if NOT in shared ownership ≤500k with election
    const skipPurchasePrice =
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === "lte500k" &&
      (formData.sharedMarketValueElection === "market" ||
        formData.sharedMarketValueElection === "stages");

    if (!skipPurchasePrice) {
      steps++; // Purchase price
    }

    if (formData.propertyType === "leasehold") {
      steps++; // Rent inputs
    }

    return steps;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let stepCounter = 1;

    // Step 1: Property Type
    if (currentStep === stepCounter) {
      if (!formData.propertyType) {
        newErrors.propertyType = "Please select property type";
      }
    }
    stepCounter++;

    // Step 2: Property Use
    if (currentStep === stepCounter) {
      if (!formData.propertyUse) {
        newErrors.propertyUse = "Please select property use";
      }
    }
    stepCounter++;

    // Step 3: Effective Date
    if (currentStep === stepCounter) {
      if (
        !formData.effectiveDay ||
        !formData.effectiveMonth ||
        !formData.effectiveYear
      ) {
        newErrors.effectiveDate = "Please enter complete date";
      } else {
        const day = parseInt(formData.effectiveDay);
        const month = parseInt(formData.effectiveMonth);
        const year = parseInt(formData.effectiveYear);

        if (
          day < 1 ||
          day > 31 ||
          month < 1 ||
          month > 12 ||
          year < 1900 ||
          year > 2100
        ) {
          newErrors.effectiveDate = "Please enter a valid date";
        }
      }
    }
    stepCounter++;

    // Conditional steps for residential
    if (formData.propertyUse === "residential") {
      // Step 4: Non-UK Resident
      if (currentStep === stepCounter) {
        if (formData.isNonUKResident === null) {
          newErrors.isNonUKResident = "Please select yes or no";
        }
      }
      stepCounter++;

      // Step 5: Purchasing as Individual
      if (formData.isNonUKResident !== null) {
        if (currentStep === stepCounter) {
          if (formData.isPurchasingAsIndividual === null) {
            newErrors.isPurchasingAsIndividual = "Please select yes or no";
          }
        }
        stepCounter++;

        // Step 6: Multiple Properties
        if (formData.isPurchasingAsIndividual === true) {
          if (currentStep === stepCounter) {
            if (formData.willOwnMultipleProperties === null) {
              newErrors.willOwnMultipleProperties = "Please select yes or no";
            }
          }
          stepCounter++;

          // Step 7: Replacing Main Residence OR Previous Ownership
          if (formData.willOwnMultipleProperties === true) {
            if (currentStep === stepCounter) {
              if (formData.isReplacingMainResidence === null) {
                newErrors.isReplacingMainResidence = "Please select yes or no";
              }
            }
            stepCounter++;
          } else if (formData.willOwnMultipleProperties === false) {
            // Ask about previous ownership
            if (currentStep === stepCounter) {
              if (formData.hasEverOwnedProperty === null) {
                newErrors.hasEverOwnedProperty = "Please select yes or no";
              }
            }
            stepCounter++;

            // If never owned before, ask if this will be main residence
            if (formData.hasEverOwnedProperty === false) {
              if (currentStep === stepCounter) {
                if (formData.willThisBeMainResidence === null) {
                  newErrors.willThisBeMainResidence = "Please select yes or no";
                }
              }
              stepCounter++;

              // ✅ Shared ownership questions ONLY if:
              // - leasehold AND willThisBeMainResidence === true
              if (
                formData.propertyType === "leasehold" &&
                formData.willThisBeMainResidence === true
              ) {
                if (currentStep === stepCounter) {
                  if (formData.isSharedOwnership === null) {
                    newErrors.isSharedOwnership = "Please select yes or no";
                  }
                }
                stepCounter++;

                if (formData.isSharedOwnership === true) {
                  if (currentStep === stepCounter) {
                    if (!formData.sharedMarketValueOption) {
                      newErrors.sharedMarketValueOption =
                        "Please select market value option";
                    }
                  }
                  stepCounter++;

                  if (formData.sharedMarketValueOption === "lte500k") {
                    if (currentStep === stepCounter) {
                      if (!formData.sharedMarketValueElection) {
                        newErrors.sharedMarketValueElection =
                          "Please select an election";
                      }
                    }
                    stepCounter++;

                    // ✅ Validate the price input after election with 500k limit
                    if (
                      formData.sharedMarketValueElection === "market" ||
                      formData.sharedMarketValueElection === "stages"
                    ) {
                      if (currentStep === stepCounter) {
                        if (formData.sharedMarketValueElection === "market") {
                          if (!formData.sharedOwnershipMarketValue) {
                            newErrors.sharedOwnershipMarketValue =
                              "Please enter market value";
                          } else {
                            const value = parseFloat(
                              formData.sharedOwnershipMarketValue.replace(
                                /,/g,
                                "",
                              ),
                            );
                            if (isNaN(value) || value <= 0) {
                              newErrors.sharedOwnershipMarketValue =
                                "Please enter a valid price";
                            } else if (value > 500000) {
                              newErrors.sharedOwnershipMarketValue =
                                "Market value cannot exceed £500,000 for this option";
                            }
                          }
                        } else if (
                          formData.sharedMarketValueElection === "stages"
                        ) {
                          if (!formData.sharedOwnershipInitialShare) {
                            newErrors.sharedOwnershipInitialShare =
                              "Please enter initial share price";
                          } else {
                            const value = parseFloat(
                              formData.sharedOwnershipInitialShare.replace(
                                /,/g,
                                "",
                              ),
                            );
                            if (isNaN(value) || value <= 0) {
                              newErrors.sharedOwnershipInitialShare =
                                "Please enter a valid price";
                            } else if (value > 500000) {
                              newErrors.sharedOwnershipInitialShare =
                                "Initial share price cannot exceed £500,000 for this option";
                            }
                          }
                        }
                      }
                      stepCounter++;
                    }
                  }
                }
              }
            }
            // If hasEverOwnedProperty === true, no additional questions - go to lease dates
          }
        }
      }
    }

    // Leasehold dates
    if (formData.propertyType === "leasehold") {
      // Lease Start Date
      if (currentStep === stepCounter) {
        if (
          !formData.leaseStartDay ||
          !formData.leaseStartMonth ||
          !formData.leaseStartYear
        ) {
          newErrors.leaseStartDate = "Please enter complete lease start date";
        } else {
          const day = parseInt(formData.leaseStartDay);
          const month = parseInt(formData.leaseStartMonth);
          const year = parseInt(formData.leaseStartYear);

          if (
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1900 ||
            year > 2100
          ) {
            newErrors.leaseStartDate = "Please enter a valid date";
          }
        }
      }
      stepCounter++;

      // Lease End Date
      if (currentStep === stepCounter) {
        if (
          !formData.leaseEndDay ||
          !formData.leaseEndMonth ||
          !formData.leaseEndYear
        ) {
          newErrors.leaseEndDate = "Please enter complete lease end date";
        } else {
          const startDay = parseInt(formData.leaseStartDay);
          const startMonth = parseInt(formData.leaseStartMonth);
          const startYear = parseInt(formData.leaseStartYear);
          const endDay = parseInt(formData.leaseEndDay);
          const endMonth = parseInt(formData.leaseEndMonth);
          const endYear = parseInt(formData.leaseEndYear);

          if (
            endDay < 1 ||
            endDay > 31 ||
            endMonth < 1 ||
            endMonth > 12 ||
            endYear < 1900 ||
            endYear > 2100
          ) {
            newErrors.leaseEndDate = "Please enter a valid date";
          } else {
            const startDate = new Date(startYear, startMonth - 1, startDay);
            const endDate = new Date(endYear, endMonth - 1, endDay);

            if (endDate <= startDate) {
              newErrors.leaseEndDate = "End date must be after start date";
            }
          }
        }
      }
      stepCounter++;
    }

    // Purchase Price
    const skipPurchasePrice =
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === "lte500k" &&
      (formData.sharedMarketValueElection === "market" ||
        formData.sharedMarketValueElection === "stages");

    if (!skipPurchasePrice && currentStep === stepCounter) {
      if (!formData.purchasePrice) {
        newErrors.purchasePrice = "Please enter purchase price";
      } else {
        const price = parseFloat(formData.purchasePrice.replace(/,/g, ""));
        if (isNaN(price) || price <= 0) {
          newErrors.purchasePrice = "Please enter a valid price";
        }
      }
    }

    if (!skipPurchasePrice) {
      stepCounter++;
    }

    // Annual Rent (leasehold only) - Dynamic based on lease years
    if (formData.propertyType === "leasehold" && currentStep === stepCounter) {
      if (!leaseTerm || !leaseTerm.totalYears || leaseTerm.totalYears <= 0) {
        newErrors.yearlyRents =
          "Please ensure you have entered valid lease dates";
      } else {
        const yearsToCollect = Math.min(Math.ceil(leaseTerm.totalYears), 5);

        // At least one rent value must be entered
        const hasAnyRent = formData.yearlyRents.some((rent) => {
          const rentValue = parseFloat(rent.replace(/,/g, ""));
          return !isNaN(rentValue) && rentValue > 0;
        });

        if (!hasAnyRent) {
          newErrors.yearlyRents = "Please enter at least one year of rent";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleCalculate = () => {
    calculateSDLT();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setFormData({
      propertyType: "",
      propertyUse: "",
      effectiveDay: "",
      effectiveMonth: "",
      effectiveYear: "",
      isNonUKResident: null,
      isPurchasingAsIndividual: null,
      willOwnMultipleProperties: null,
      isReplacingMainResidence: null,
      hasEverOwnedProperty: null,
      willThisBeMainResidence: null,
      isSharedOwnership: null,
      sharedMarketValueOption: "",
      sharedMarketValueElection: "",
      sharedOwnershipMarketValue: "",
      sharedOwnershipInitialShare: "",
      leaseStartDay: "",
      leaseStartMonth: "",
      leaseStartYear: "",
      leaseEndDay: "",
      leaseEndMonth: "",
      leaseEndYear: "",
      purchasePrice: "",
      yearlyRents: [],
    });
    setLeaseTerm(null);
    setErrors({});
    setCalculationResult(null);
  };

  // Render current step
  const renderStep = () => {
    let stepCounter = 1;

    // Step 1: Property Type
    if (currentStep === stepCounter) {
      return (
        <div>
          <h5 className="mb-4">Is your transaction freehold or leasehold?</h5>
          <FormGroup tag="fieldset">
            <FormGroup check className="my-3 mx-3">
              <Label check>
                <Input
                  type="radio"
                  name="propertyType"
                  className="border-2 border-primary"
                  checked={formData.propertyType === "freehold"}
                  onChange={() =>
                    setFormData({ ...formData, propertyType: "freehold" })
                  }
                />{" "}
                Freehold
              </Label>
            </FormGroup>
            <FormGroup check className="my-3 mx-3">
              <Label check>
                <Input
                  type="radio"
                  name="propertyType"
                  className="border-2 border-primary"
                  checked={formData.propertyType === "leasehold"}
                  onChange={() =>
                    setFormData({ ...formData, propertyType: "leasehold" })
                  }
                />{" "}
                Leasehold
              </Label>
            </FormGroup>
          </FormGroup>
          {errors.propertyType && (
            <Alert color="danger">{errors.propertyType}</Alert>
          )}
        </div>
      );
    }
    stepCounter++;

    // Step 2: Property Use
    if (currentStep === stepCounter) {
      return (
        <div>
          <h5 className="mb-4">
            Is the transaction residential or non-residential?
          </h5>
          <p className="text-muted small mb-3">
            If it's a mixed transaction, choose 'Non-residential'.
          </p>
          <FormGroup tag="fieldset">
            <FormGroup check className="my-3 mx-3">
              <Label check>
                <Input
                  type="radio"
                  name="propertyUse"
                  className="border-2 border-primary"
                  checked={formData.propertyUse === "residential"}
                  onChange={() =>
                    setFormData({ ...formData, propertyUse: "residential" })
                  }
                />{" "}
                Residential
              </Label>
            </FormGroup>
            <FormGroup check className="my-3 mx-3">
              <Label check>
                <Input
                  type="radio"
                  name="propertyUse"
                  className="border-2 border-primary"
                  checked={formData.propertyUse === "non-residential"}
                  onChange={() =>
                    setFormData({ ...formData, propertyUse: "non-residential" })
                  }
                />{" "}
                Non-residential
              </Label>
            </FormGroup>
          </FormGroup>
          {errors.propertyUse && (
            <Alert color="danger">{errors.propertyUse}</Alert>
          )}
        </div>
      );
    }
    stepCounter++;

    // Step 3: Effective Date
    if (currentStep === stepCounter) {
      return (
        <div>
          <h5 className="mb-3">Effective date of your transaction</h5>
          <p className="text-muted small mb-3">
            This is usually the completion date.
          </p>
          <p className="text-muted small mb-3">For example, 31 3 2014.</p>

          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="effectiveDay">Day</Label>
                <Input
                  type="text"
                  id="effectiveDay"
                  placeholder="DD"
                  maxLength={2}
                  value={formData.effectiveDay}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, effectiveDay: value });
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="effectiveMonth">Month</Label>
                <Input
                  type="text"
                  id="effectiveMonth"
                  placeholder="MM"
                  maxLength={2}
                  value={formData.effectiveMonth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, effectiveMonth: value });
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="effectiveYear">Year</Label>
                <Input
                  type="text"
                  id="effectiveYear"
                  placeholder="YYYY"
                  maxLength={4}
                  value={formData.effectiveYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, effectiveYear: value });
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          {errors.effectiveDate && (
            <Alert color="danger">{errors.effectiveDate}</Alert>
          )}
        </div>
      );
    }
    stepCounter++;

    // Conditional steps for residential
    if (formData.propertyUse === "residential") {
      // Non-UK Resident
      if (currentStep === stepCounter) {
        return (
          <div>
            <h5 className="mb-4">Are any of the purchasers non-UK resident?</h5>
            <FormGroup tag="fieldset">
              <FormGroup check className="my-3 mx-3">
                <Label check>
                  <Input
                    type="radio"
                    name="isNonUKResident"
                    className="border-2 border-primary"
                    checked={formData.isNonUKResident === true}
                    onChange={() =>
                      setFormData({ ...formData, isNonUKResident: true })
                    }
                  />{" "}
                  Yes
                </Label>
              </FormGroup>
              <FormGroup check className="my-3 mx-3">
                <Label check>
                  <Input
                    type="radio"
                    name="isNonUKResident"
                    className="border-2 border-primary"
                    checked={formData.isNonUKResident === false}
                    onChange={() =>
                      setFormData({ ...formData, isNonUKResident: false })
                    }
                  />{" "}
                  No
                </Label>
              </FormGroup>
            </FormGroup>
            {errors.isNonUKResident && (
              <Alert color="danger">{errors.isNonUKResident}</Alert>
            )}
          </div>
        );
      }
      stepCounter++;

      // Purchasing as Individual
      if (currentStep === stepCounter) {
        return (
          <div>
            <h5 className="mb-3">
              Are you purchasing the property as an individual?
            </h5>
            <p className="text-muted small mb-3">
              Choose 'Yes' if you're buying on your own, or you're married or in
              a civil partnership. Choose 'No' if you're a company or trust.
            </p>
            <FormGroup tag="fieldset">
              <FormGroup check className="my-3 mx-3">
                <Label check>
                  <Input
                    type="radio"
                    name="isPurchasingAsIndividual"
                    className="border-2 border-primary"
                    checked={formData.isPurchasingAsIndividual === true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isPurchasingAsIndividual: true,
                      })
                    }
                  />{" "}
                  Yes
                </Label>
              </FormGroup>
              <FormGroup check className="my-3 mx-3">
                <Label check>
                  <Input
                    type="radio"
                    name="isPurchasingAsIndividual"
                    className="border-2 border-primary"
                    checked={formData.isPurchasingAsIndividual === false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isPurchasingAsIndividual: false,
                      })
                    }
                  />{" "}
                  No
                </Label>
              </FormGroup>
            </FormGroup>
            {errors.isPurchasingAsIndividual && (
              <Alert color="danger">{errors.isPurchasingAsIndividual}</Alert>
            )}
          </div>
        );
      }
      stepCounter++;

      // Multiple Properties (only for individuals)
      if (formData.isPurchasingAsIndividual === true) {
        if (currentStep === stepCounter) {
          return (
            <div>
              <h5 className="mb-4">
                Will the purchase of the property result in owning two or more
                properties?
              </h5>
              <FormGroup tag="fieldset">
                <FormGroup check className="my-3 mx-3">
                  <Label check>
                    <Input
                      type="radio"
                      name="willOwnMultipleProperties"
                      className="border-2 border-primary"
                      checked={formData.willOwnMultipleProperties === true}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          willOwnMultipleProperties: true,
                        })
                      }
                    />{" "}
                    Yes
                  </Label>
                </FormGroup>
                <FormGroup check className="my-3 mx-3">
                  <Label check>
                    <Input
                      type="radio"
                      name="willOwnMultipleProperties"
                      className="border-2 border-primary"
                      checked={formData.willOwnMultipleProperties === false}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          willOwnMultipleProperties: false,
                        })
                      }
                    />{" "}
                    No
                  </Label>
                </FormGroup>
              </FormGroup>
              {errors.willOwnMultipleProperties && (
                <Alert color="danger">{errors.willOwnMultipleProperties}</Alert>
              )}
            </div>
          );
        }
        stepCounter++;

        // Replacing Main Residence
        if (formData.willOwnMultipleProperties === true) {
          if (currentStep === stepCounter) {
            return (
              <div>
                <h5 className="mb-3">
                  Is the property being purchased replacing your main residence?
                </h5>
                <p className="text-muted small mb-3">
                  If your previous main residence has not yet been sold choose
                  "No". A refund may be available if the previous main residence
                  is sold within 3 years.
                </p>
                <FormGroup tag="fieldset">
                  <FormGroup check className="my-3 mx-3">
                    <Label check>
                      <Input
                        type="radio"
                        name="isReplacingMainResidence"
                        className="border-2 border-primary"
                        checked={formData.isReplacingMainResidence === true}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isReplacingMainResidence: true,
                          })
                        }
                      />{" "}
                      Yes
                    </Label>
                  </FormGroup>
                  <FormGroup check className="my-3 mx-3">
                    <Label check>
                      <Input
                        type="radio"
                        name="isReplacingMainResidence"
                        className="border-2 border-primary"
                        checked={formData.isReplacingMainResidence === false}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isReplacingMainResidence: false,
                          })
                        }
                      />{" "}
                      No
                    </Label>
                  </FormGroup>
                </FormGroup>
                {errors.isReplacingMainResidence && (
                  <Alert color="danger">
                    {errors.isReplacingMainResidence}
                  </Alert>
                )}
              </div>
            );
          }
          stepCounter++;
        } else if (formData.willOwnMultipleProperties === false) {
          // NEW FLOW: Ask about previous ownership
          if (currentStep === stepCounter) {
            return (
              <div>
                <h5 className="mb-3">
                  Have you ever owned or part owned another property?
                </h5>
                <p className="text-muted small mb-3">
                  We only need to know about residential property, or property
                  that has both residential and non-residential use. This
                  includes freehold property, or leasehold property of at least
                  21 years. Select yes if you either:
                </p>
                <ul className="text-muted small mb-3">
                  <li>bought a property</li>
                  <li>inherited a property</li>
                  <li>are a beneficiary of a trust that owns a property</li>
                </ul>
                <FormGroup tag="fieldset">
                  <FormGroup check className="my-3 mx-3">
                    <Label check>
                      <Input
                        type="radio"
                        name="hasEverOwnedProperty"
                        className="border-2 border-primary"
                        checked={formData.hasEverOwnedProperty === true}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            hasEverOwnedProperty: true,
                          })
                        }
                      />{" "}
                      Yes
                    </Label>
                  </FormGroup>
                  <FormGroup check className="my-3 mx-3">
                    <Label check>
                      <Input
                        type="radio"
                        name="hasEverOwnedProperty"
                        className="border-2 border-primary"
                        checked={formData.hasEverOwnedProperty === false}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            hasEverOwnedProperty: false,
                          })
                        }
                      />{" "}
                      No
                    </Label>
                  </FormGroup>
                </FormGroup>
                {errors.hasEverOwnedProperty && (
                  <Alert color="danger">{errors.hasEverOwnedProperty}</Alert>
                )}
              </div>
            );
          }
          stepCounter++;

          // NEW: If never owned before, ask if this will be main residence
          if (formData.hasEverOwnedProperty === false) {
            if (currentStep === stepCounter) {
              return (
                <div>
                  <h5 className="mb-4">
                    Will this property be your main residence?
                  </h5>
                  <FormGroup tag="fieldset">
                    <FormGroup check className="my-3 mx-3">
                      <Label check>
                        <Input
                          type="radio"
                          name="willThisBeMainResidence"
                          className="border-2 border-primary"
                          checked={formData.willThisBeMainResidence === true}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              willThisBeMainResidence: true,
                            })
                          }
                        />{" "}
                        Yes
                      </Label>
                    </FormGroup>
                    <FormGroup check className="my-3 mx-3">
                      <Label check>
                        <Input
                          type="radio"
                          name="willThisBeMainResidence"
                          className="border-2 border-primary"
                          checked={formData.willThisBeMainResidence === false}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              willThisBeMainResidence: false,
                            })
                          }
                        />{" "}
                        No
                      </Label>
                    </FormGroup>
                  </FormGroup>
                  {errors.willThisBeMainResidence && (
                    <Alert color="danger">
                      {errors.willThisBeMainResidence}
                    </Alert>
                  )}
                </div>
              );
            }
            stepCounter++;

            // ✅ Shared ownership ONLY if: leasehold AND willThisBeMainResidence === true
            if (
              formData.propertyType === "leasehold" &&
              formData.willThisBeMainResidence === true
            ) {
              if (currentStep === stepCounter) {
                return (
                  <div>
                    <h5 className="mb-3">
                      Are you buying the property through a shared ownership
                      scheme?
                    </h5>
                    <FormGroup tag="fieldset">
                      <FormGroup check className="my-3 mx-3">
                        <Label check>
                          <Input
                            type="radio"
                            name="isSharedOwnership"
                            className="border-2 border-primary"
                            checked={formData.isSharedOwnership === true}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                isSharedOwnership: true,
                              })
                            }
                          />{" "}
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check className="my-3 mx-3">
                        <Label check>
                          <Input
                            type="radio"
                            name="isSharedOwnership"
                            className="border-2 border-primary"
                            checked={formData.isSharedOwnership === false}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                isSharedOwnership: false,
                              })
                            }
                          />{" "}
                          No
                        </Label>
                      </FormGroup>
                    </FormGroup>
                    {errors.isSharedOwnership && (
                      <Alert color="danger">{errors.isSharedOwnership}</Alert>
                    )}
                  </div>
                );
              }
              stepCounter++;

              // If shared ownership, ask market value option
              if (formData.isSharedOwnership === true) {
                if (currentStep === stepCounter) {
                  return (
                    <div>
                      <h5 className="mb-3">
                        What is the market value of the property?
                      </h5>
                      <FormGroup tag="fieldset">
                        <FormGroup check className="my-3 mx-3">
                          <Label check>
                            <Input
                              type="radio"
                              name="sharedMarketValueOption"
                              className="border-2 border-primary"
                              checked={
                                formData.sharedMarketValueOption === "lte500k"
                              }
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  sharedMarketValueOption: "lte500k",
                                })
                              }
                            />{" "}
                            £500,000 or less
                          </Label>
                        </FormGroup>
                        <FormGroup check className="my-3 mx-3">
                          <Label check>
                            <Input
                              type="radio"
                              name="sharedMarketValueOption"
                              className="border-2 border-primary"
                              checked={
                                formData.sharedMarketValueOption === "gt500k"
                              }
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  sharedMarketValueOption: "gt500k",
                                })
                              }
                            />{" "}
                            More than £500,000
                          </Label>
                        </FormGroup>
                      </FormGroup>
                      {errors.sharedMarketValueOption && (
                        <Alert color="danger">
                          {errors.sharedMarketValueOption}
                        </Alert>
                      )}
                    </div>
                  );
                }
                stepCounter++;

                // If market value <= 500k, ask election
                if (formData.sharedMarketValueOption === "lte500k") {
                  if (currentStep === stepCounter) {
                    return (
                      <div>
                        <h5 className="mb-3">
                          Do you want to pay SDLT on the market value or only on
                          the percentage of the property you are buying?
                        </h5>
                        <FormGroup tag="fieldset">
                          <FormGroup check className="my-3 mx-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="sharedMarketValueElection"
                                className="border-2 border-primary"
                                checked={
                                  formData.sharedMarketValueElection ===
                                  "market"
                                }
                                onChange={() =>
                                  setFormData({
                                    ...formData,
                                    sharedMarketValueElection: "market",
                                  })
                                }
                              />{" "}
                              Pay SDLT up front by making a market value
                              election
                            </Label>
                          </FormGroup>
                          <FormGroup check className="my-3 mx-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="sharedMarketValueElection"
                                className="border-2 border-primary"
                                checked={
                                  formData.sharedMarketValueElection ===
                                  "stages"
                                }
                                onChange={() =>
                                  setFormData({
                                    ...formData,
                                    sharedMarketValueElection: "stages",
                                  })
                                }
                              />{" "}
                              Pay SDLT in stages
                            </Label>
                          </FormGroup>
                        </FormGroup>
                        {errors.sharedMarketValueElection && (
                          <Alert color="danger">
                            {errors.sharedMarketValueElection}
                          </Alert>
                        )}
                      </div>
                    );
                  }
                  stepCounter++;

                  // ✅ Render price input based on election choice
                  if (
                    formData.sharedMarketValueElection === "market" ||
                    formData.sharedMarketValueElection === "stages"
                  ) {
                    if (currentStep === stepCounter) {
                      return (
                        <div>
                          <h5 className="mb-3">
                            {formData.sharedMarketValueElection === "market"
                              ? "Market value of the property you are buying"
                              : "Price of initial share of the property"}
                          </h5>

                          <FormGroup>
                            <div className="input-group">
                              <span className="input-group-text">£</span>
                              <Input
                                type="text"
                                value={
                                  formData.sharedMarketValueElection ===
                                  "market"
                                    ? formData.sharedOwnershipMarketValue
                                    : formData.sharedOwnershipInitialShare
                                }
                                onChange={(e) => {
                                  const formatted = formatNumber(
                                    e.target.value,
                                  );
                                  if (
                                    formData.sharedMarketValueElection ===
                                    "market"
                                  ) {
                                    setFormData({
                                      ...formData,
                                      sharedOwnershipMarketValue: formatted,
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      sharedOwnershipInitialShare: formatted,
                                    });
                                  }
                                }}
                                placeholder="e.g., 500,000"
                              />
                            </div>
                          </FormGroup>

                          {formData.sharedMarketValueElection === "market" &&
                            errors.sharedOwnershipMarketValue && (
                              <Alert color="danger">
                                {errors.sharedOwnershipMarketValue}
                              </Alert>
                            )}
                          {formData.sharedMarketValueElection === "stages" &&
                            errors.sharedOwnershipInitialShare && (
                              <Alert color="danger">
                                {errors.sharedOwnershipInitialShare}
                              </Alert>
                            )}
                        </div>
                      );
                    }
                    stepCounter++;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Leasehold dates
    if (formData.propertyType === "leasehold") {
      // Lease Start Date
      if (currentStep === stepCounter) {
        return (
          <div>
            <h5 className="mb-3">Start date shown in your lease</h5>
            <p className="text-muted small mb-3">
              This is the date your term starts.
            </p>
            <p className="text-muted small mb-3">For example, 31 3 2014.</p>

            <Row>
              <Col md={3}>
                <FormGroup>
                  <Label for="leaseStartDay">Day</Label>
                  <Input
                    type="text"
                    id="leaseStartDay"
                    placeholder="DD"
                    maxLength={2}
                    value={formData.leaseStartDay}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, leaseStartDay: value });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="leaseStartMonth">Month</Label>
                  <Input
                    type="text"
                    id="leaseStartMonth"
                    placeholder="MM"
                    maxLength={2}
                    value={formData.leaseStartMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, leaseStartMonth: value });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="leaseStartYear">Year</Label>
                  <Input
                    type="text"
                    id="leaseStartYear"
                    placeholder="YYYY"
                    maxLength={4}
                    value={formData.leaseStartYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, leaseStartYear: value });
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            {errors.leaseStartDate && (
              <Alert color="danger">{errors.leaseStartDate}</Alert>
            )}
          </div>
        );
      }
      stepCounter++;

      // Lease End Date
      if (currentStep === stepCounter) {
        return (
          <div>
            <h5 className="mb-3">End date shown in your lease</h5>
            <p className="text-muted small mb-3">
              This is the date your term ends.
            </p>
            <p className="text-muted small mb-3">For example, 31 3 2017.</p>

            <Row>
              <Col md={3}>
                <FormGroup>
                  <Label for="leaseEndDay">Day</Label>
                  <Input
                    type="text"
                    id="leaseEndDay"
                    placeholder="DD"
                    maxLength={2}
                    value={formData.leaseEndDay}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, leaseEndDay: value });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="leaseEndMonth">Month</Label>
                  <Input
                    type="text"
                    id="leaseEndMonth"
                    placeholder="MM"
                    maxLength={2}
                    value={formData.leaseEndMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, leaseEndMonth: value });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="leaseEndYear">Year</Label>
                  <Input
                    type="text"
                    id="leaseEndYear"
                    placeholder="YYYY"
                    maxLength={4}
                    value={formData.leaseEndYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, leaseEndYear: value });
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            {leaseTerm && (
              <Alert color="info" className="mt-3">
                <strong>Term of lease:</strong> {leaseTerm.years} years{" "}
                {leaseTerm.days} days
              </Alert>
            )}
            {errors.leaseEndDate && (
              <Alert color="danger">{errors.leaseEndDate}</Alert>
            )}
          </div>
        );
      }
      stepCounter++;
    }

    // Purchase Price
    const skipPurchasePrice =
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === "lte500k" &&
      (formData.sharedMarketValueElection === "market" ||
        formData.sharedMarketValueElection === "stages");

    if (!skipPurchasePrice && currentStep === stepCounter) {
      return (
        <div>
          <h5 className="mb-3">Enter the purchase price</h5>
          <p className="text-muted small mb-3">
            This is the chargeable consideration.
          </p>

          <FormGroup>
            <div className="input-group">
              <span className="input-group-text">£</span>
              <Input
                type="text"
                value={formData.purchasePrice}
                onChange={(e) => {
                  const formatted = formatNumber(e.target.value);
                  setFormData({ ...formData, purchasePrice: formatted });
                }}
                placeholder="e.g., 300,000"
              />
            </div>
          </FormGroup>
          {errors.purchasePrice && (
            <Alert color="danger">{errors.purchasePrice}</Alert>
          )}
        </div>
      );
    }

    if (!skipPurchasePrice) {
      stepCounter++;
    }

    // Annual Rent (leasehold only) - Dynamic based on calendar years spanned
    if (formData.propertyType === "leasehold" && currentStep === stepCounter) {
      // Validate leaseTerm exists and is valid
      if (!leaseTerm || !leaseTerm.totalYears || leaseTerm.totalYears <= 0) {
        return (
          <div>
            <Alert color="warning">
              Please ensure you have entered valid lease start and end dates in
              the previous steps.
            </Alert>
          </div>
        );
      }

      const yearsToCollect = Math.min(
        leaseTerm.calendarYearsSpanned || Math.ceil(leaseTerm.totalYears),
        5,
      );

      // Additional validation
      if (isNaN(yearsToCollect) || yearsToCollect < 1 || yearsToCollect > 100) {
        return (
          <div>
            <Alert color="danger">
              Invalid lease term calculated. Please check your lease dates.
            </Alert>
          </div>
        );
      }

      return (
        <div>
          <h5 className="mb-4">Enter the annual rent due</h5>

          <Alert color="info" className="mb-3">
            <small>
              <strong>Note:</strong> Enter the rent for each calendar year of
              the lease (up to 5 years).
              {leaseTerm.totalYears > 5 &&
                " The highest rent from the first 5 years will be used for remaining years."}
            </small>
          </Alert>

          {Array.from({ length: yearsToCollect }).map((_, index) => (
            <FormGroup key={index}>
              <Label for={`year${index + 1}Rent`}>Year {index + 1} rent</Label>
              <div className="input-group mb-2">
                <span className="input-group-text">£</span>
                <Input
                  type="text"
                  id={`year${index + 1}Rent`}
                  value={formData.yearlyRents[index] || ""}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value);
                    const newRents = [...formData.yearlyRents];
                    newRents[index] = formatted;
                    setFormData({ ...formData, yearlyRents: newRents });
                  }}
                  placeholder="e.g., 5,000"
                />
              </div>
            </FormGroup>
          ))}

          {leaseTerm.totalYears > 5 && (
            <Alert color="warning" className="mt-3">
              <small>
                <strong>
                  Highest rent from years 1-5 will be used for years 6-
                  {Math.ceil(leaseTerm.totalYears)}
                </strong>
              </small>
            </Alert>
          )}
          {errors.yearlyRents && (
            <Alert color="danger">{errors.yearlyRents}</Alert>
          )}
        </div>
      );
    }

    return null;
  };

  const totalSteps = getTotalSteps();
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  // Results page
  if (calculationResult) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col>
            <Card>
              <CardHeader className="bg-success text-white">
                <h3 className="mb-0">SDLT Calculation Result</h3>
              </CardHeader>
              <CardBody>
                {/* Summary */}
                <div className="mb-4">
                  <h4 className="mb-3">
                    Results of calculation based on SDLT rules for the effective
                    date entered
                  </h4>
                  <Card className="border-success">
                    <CardBody>
                      <h5 className="mb-3">Result of SDLT calculation</h5>

                      <div className="mb-4 pb-3 border-bottom">
                        <div className="text-muted small mb-1">
                          Total amount of tax for this transaction
                        </div>
                        <h2 className="mb-0 text-success fw-bold">
                          {formatCurrency(calculationResult.totalTax)}
                        </h2>
                      </div>

                      {formData.propertyType === "leasehold" && (
                        <>
                          <Row className="mb-2">
                            <Col xs={8}>
                              <strong>Net present value</strong>
                            </Col>
                            <Col xs={4} className="text-end">
                              {formatCurrency(calculationResult.rentNPV)}
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col xs={8}>
                              <strong>SDLT on rent</strong>
                            </Col>
                            <Col xs={4} className="text-end">
                              {formatCurrency(calculationResult.rentTax)}
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col xs={8}>
                              <strong>SDLT on premium</strong>
                            </Col>
                            <Col xs={4} className="text-end">
                              {formatCurrency(calculationResult.premiumTax)}
                            </Col>
                          </Row>
                        </>
                      )}

                      {formData.propertyType === "freehold" && (
                        <Row>
                          <Col xs={8}>
                            <strong>Purchase Price:</strong>
                          </Col>
                          <Col xs={4} className="text-end">
                            {formatCurrency(
                              parseFloat(
                                formData.purchasePrice.replace(/,/g, ""),
                              ),
                            )}
                          </Col>
                        </Row>
                      )}

                      {formData.propertyType === "leasehold" &&
                        formData.isSharedOwnership === true && (
                          <Row className="mb-2">
                            <Col xs={8}>
                              <strong>
                                {formData.sharedMarketValueElection === "market"
                                  ? "Market Value:"
                                  : "Initial Share Price:"}
                              </strong>
                            </Col>
                            <Col xs={4} className="text-end">
                              {formatCurrency(
                                parseFloat(
                                  (formData.sharedMarketValueElection ===
                                  "market"
                                    ? formData.sharedOwnershipMarketValue
                                    : formData.sharedOwnershipInitialShare
                                  ).replace(/,/g, ""),
                                ),
                              )}
                            </Col>
                          </Row>
                        )}
                    </CardBody>
                  </Card>
                </div>

                {/* Applied Conditions */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Transaction Details:</h6>
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    <Badge color="primary">
                      {formData.propertyType === "freehold"
                        ? "Freehold"
                        : "Leasehold"}
                    </Badge>
                    <Badge color="primary">
                      {formData.propertyUse === "residential"
                        ? "Residential"
                        : "Non-Residential"}
                    </Badge>
                    {formData.isNonUKResident &&
                      !formData.isReplacingMainResidence && (
                        <Badge color="warning">Non-UK Resident (+2%)</Badge>
                      )}
                    {formData.isPurchasingAsIndividual === true &&
                      formData.willOwnMultipleProperties === true &&
                      formData.isReplacingMainResidence !== true && (
                        <Badge color="danger">Additional Property (+5%)</Badge>
                      )}
                    {formData.isReplacingMainResidence === true && (
                      <Badge color="info">
                        Replacing Main Residence (No Surcharges)
                      </Badge>
                    )}
                    {formData.isSharedOwnership === true && (
                      <Badge color="info">Shared Ownership</Badge>
                    )}
                  </div>

                  {formData.propertyType === "leasehold" && leaseTerm && (
                    <div className="text-muted small mt-2">
                      <strong>Term of lease:</strong> {leaseTerm.years} years{" "}
                      {leaseTerm.days} days
                    </div>
                  )}
                </div>

                {/* Premium/Purchase Price Breakdown */}
                <h5 className="mb-3">
                  SDLT on{" "}
                  {formData.propertyType === "leasehold"
                    ? "premium"
                    : "purchase price"}
                </h5>
                <Table bordered responsive hover className="mb-4">
                  <thead className="table-light">
                    <tr>
                      <th>
                        {formData.propertyType === "leasehold"
                          ? "Premium"
                          : "Purchase price"}{" "}
                        bands (£)
                      </th>
                      <th className="text-center">Percentage rate (%)</th>
                      <th className="text-end">SDLT due (£)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResult.premiumBreakdown.map((item, index) => (
                      <tr key={index}>
                        <td>{item.band}</td>
                        <td className="text-center">{item.rate}</td>
                        <td className="text-end">{formatCurrency(item.tax)}</td>
                      </tr>
                    ))}
                    <tr className="table-light fw-bold">
                      <td colSpan={2}>
                        SDLT due on the{" "}
                        {formData.propertyType === "leasehold"
                          ? "premium"
                          : "purchase price"}
                      </td>
                      <td className="text-end">
                        {formatCurrency(calculationResult.premiumTax)}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                {/* Rent Breakdown (leasehold only) */}
                {formData.propertyType === "leasehold" &&
                  calculationResult.rentBreakdown.length > 0 && (
                    <>
                      <h5 className="mb-3">SDLT on rent</h5>
                      <Alert color="info" className="mb-3">
                        <strong>Net present value:</strong>{" "}
                        {formatCurrency(calculationResult.rentNPV)}
                      </Alert>
                      <Table bordered responsive hover className="mb-4">
                        <thead className="table-light">
                          <tr>
                            <th>Rent bands (£)</th>
                            <th className="text-center">Percentage rate (%)</th>
                            <th className="text-end">SDLT due (£)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculationResult.rentBreakdown.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{item.band}</td>
                                <td className="text-center">{item.rate}</td>
                                <td className="text-end">
                                  {formatCurrency(item.tax)}
                                </td>
                              </tr>
                            ),
                          )}
                          <tr className="table-light fw-bold">
                            <td colSpan={2}>SDLT due on the rent</td>
                            <td className="text-end">
                              {formatCurrency(calculationResult.rentTax)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )}

                <div className="mt-4">
                  <Button color="primary" onClick={resetCalculator}>
                    Start New Calculation
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col>
          <Card>
            <CardHeader className="bg-primary text-white">
              <h3 className="mb-0">Stamp Duty Land Tax Calculator</h3>
            </CardHeader>
            <CardBody>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="small">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
                <Progress
                  animated
                  striped
                  value={progressPercentage}
                  color="primary"
                  style={{ height: "10px" }}
                />
              </div>

              {/* Current Step Content */}
              <Form>{renderStep()}</Form>

              {/* Navigation Buttons */}
              <div className="mt-4 d-flex justify-content-between">
                <Button
                  color="secondary"
                  outline
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  ← Back
                </Button>

                {currentStep < totalSteps ? (
                  <Button color="primary" onClick={handleNext}>
                    Continue →
                  </Button>
                ) : (
                  <Button color="success" onClick={handleCalculate}>
                    Calculate SDLT
                  </Button>
                )}
              </div>

              {/* Reset option */}
              <div className="mt-3 text-center">
                <Button color="link" size="sm" onClick={resetCalculator}>
                  Start Over
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Information Panel */}
          <Card className="mt-3 border-0">
            <CardBody className="small">
              <h6 className="fw-bold">About SDLT</h6>
              <p className="mb-0">
                Stamp Duty Land Tax (SDLT) is a tax paid when purchasing
                property in England and Northern Ireland. The amount depends on
                the property price, type, and your circumstances.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StampDutyCalculator;

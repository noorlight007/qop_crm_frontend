import {
  InsuranceAASDTabTitleData,
  InsuranceAORTabTitleData,
  InsuranceEnquiryTabTitleData,
  InsuranceFFDTabTitleData,
  InsuranceNPDTabTitleData,
  InsuranceSubmissionTabTitleData,
  MortgageCompletionTabTitleData,
  MortgageDIPTabTitleData,
  MortgageEnquiryTabTitleData,
  MortgageFFDTabTitleData,
  MortgageFMATabTitleData,
  MortgageFOPTabTitleData,
  MortgageLegalTabTitleData,
  MortgageNPDTabTitleData,
  MortgageOFBTabTitleData,
  MortgageRCCTabTitleData,
  MortgageSubmissionTabTitleData,
} from "@/Data/Cases/CaseDetailsTabTitleData";

export const getNextTabNav = (
  caseStage: string,
  caseCategory: string,
  currentTabNav: string,
): string | null => {
  console.log(caseStage);
  // Map case stages to corresponding tab title data
  const mortgageTabDataMap: Record<string, any[]> = {
    ENQUIRY: MortgageEnquiryTabTitleData,
    FACT_FIND: MortgageFFDTabTitleData,
    RESEARCH_COMPLIANCE_CHECK: MortgageRCCTabTitleData,
    DECISION_IN_PRINCIPLE: MortgageDIPTabTitleData,
    FULL_MORTGAGE_APPLICATION: MortgageFMATabTitleData,
    SUBMISSION: MortgageSubmissionTabTitleData,
    OFFER_FROM_BANK: MortgageOFBTabTitleData,
    LEGAL: MortgageLegalTabTitleData,
    COMPLETION: MortgageCompletionTabTitleData,
    FUTURE_OPPORTUNITY: MortgageFOPTabTitleData,
    NOT_PROCEED: MortgageNPDTabTitleData,
  };
  const insuranceTabDataMap: Record<string, any[]> = {
    ENQUIRY: InsuranceEnquiryTabTitleData,
    FACT_FIND: InsuranceFFDTabTitleData,
    SUBMISSION: InsuranceSubmissionTabTitleData,
    ACCEPT_WAITING_START_DATE: InsuranceAASDTabTitleData,
    ACCEPTED_ON_RISK: InsuranceAORTabTitleData,
    FURTHER_MEDICAL_REQUIRED: InsuranceFFDTabTitleData,
    NOT_PROCEED: InsuranceNPDTabTitleData,
  };

  // Get the current tab data based on caseStage and caseCategory
  let currentTabData: any[] = [];

  if (caseCategory === "MORTGAGE") {
    currentTabData = mortgageTabDataMap[caseStage] || [];
  } else if (
    caseCategory === "PROTECTION" ||
    caseCategory === "GENERAL_INSURANCE"
  ) {
    currentTabData = insuranceTabDataMap[caseStage] || [];
  } else {
    currentTabData = mortgageTabDataMap[caseStage] || [];
  }

  // If caseStage is invalid or currentTabData is empty, return null
  if (!currentTabData || currentTabData.length === 0) {
    return null;
  }

  // Find the index of the current tab by its nav name
  const currentIndex = currentTabData.findIndex(
    (tab) => tab.nav === currentTabNav,
  );

  // If current tab is not found or it's the last tab, return null
  if (currentIndex === -1 || currentIndex === currentTabData.length - 1) {
    return null;
  }

  // Return the nav name of the next tab
  return currentTabData[currentIndex + 1].nav;
};

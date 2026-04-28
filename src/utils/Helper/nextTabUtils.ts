import {
  ApplicantInsuranceCaseDetailsTabTitleData,
  ApplicantMortgageCaseDetailsTabTitleData,
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
  MortgageREFTabTitleData,
  MortgageSubmissionTabTitleData,
} from "@/Data/Cases/CaseDetailsTabTitleData";

export const getNextTabNav = (
  caseStage: string,
  caseCategory: string,
  currentTabNav: string,
  userRole?: string,
): string | null => {
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
    REFERRED: MortgageREFTabTitleData,
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

  // Applicant maps — same tab list for every stage
  // const mortgageApplicantStages = Object.keys(mortgageTabDataMap);
  // const insuranceApplicantStages = Object.keys(insuranceTabDataMap);

  const mortgageApplicantStages = [
    "ENQUIRY",
    "FACT_FIND",
    "RESEARCH_COMPLIANCE_CHECK",
    "DECISION_IN_PRINCIPLE",
    "FULL_MORTGAGE_APPLICATION",
    "SUBMISSION",
    "OFFER_FROM_BANK",
    "LEGAL",
    "COMPLETION",
    "REFERRED",
    "FUTURE_OPPORTUNITY",
    "NOT_PROCEED",
  ];

  const insuranceApplicantStages = [
    "ENQUIRY",
    "FACT_FIND",
    "SUBMISSION",
    "ACCEPT_WAITING_START_DATE",
    "ACCEPTED_ON_RISK",
    "FURTHER_MEDICAL_REQUIRED",
    "COMPLETION",
    "REFERRED",
    "FUTURE_OPPORTUNITY",
    "NOT_PROCEED",
  ];

  const mortgageApplicantTabDataMap: Record<string, any[]> = Object.fromEntries(
    mortgageApplicantStages.map((stage) => [
      stage,
      ApplicantMortgageCaseDetailsTabTitleData,
    ]),
  );

  const insuranceApplicantTabDataMap: Record<string, any[]> =
    Object.fromEntries(
      insuranceApplicantStages.map((stage) => [
        stage,
        ApplicantInsuranceCaseDetailsTabTitleData,
      ]),
    );

  let currentTabData: any[] = [];

  if (caseCategory === "MORTGAGE") {
    currentTabData =
      userRole === "APPLICANT"
        ? mortgageApplicantTabDataMap[caseStage] || []
        : mortgageTabDataMap[caseStage] || [];
  } else if (
    caseCategory === "PROTECTION" ||
    caseCategory === "GENERAL_INSURANCE"
  ) {
    currentTabData =
      userRole === "APPLICANT"
        ? insuranceApplicantTabDataMap[caseStage] || []
        : insuranceTabDataMap[caseStage] || [];
  } else {
    currentTabData =
      userRole === "APPLICANT"
        ? mortgageApplicantTabDataMap[caseStage] || []
        : mortgageTabDataMap[caseStage] || [];
  }

  if (!currentTabData || currentTabData.length === 0) return null;

  const currentIndex = currentTabData.findIndex(
    (tab) => tab.nav === currentTabNav,
  );

  if (currentIndex === -1 || currentIndex === currentTabData.length - 1) {
    return null;
  }

  return currentTabData[currentIndex + 1].nav;
};

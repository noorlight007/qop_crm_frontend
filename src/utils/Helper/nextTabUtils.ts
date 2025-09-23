import {
  CompletionTabTitleData,
  DIPTabTitleData,
  EnqueryTabTitleData,
  FFDTabTitleData,
  FMATabTitleData,
  FOPTabTitleData,
  LegalTabTitleData,
  NPDTabTitleData,
  OFBTabTitleData,
  RCCTabTitleData,
} from "@/Data/CommonComponentsData/SingleCaseInfo/CaseDetailsData/CaseDetailsTabTitleData";

export const getNextTabNav = (
  caseStage: string,
  currentTabNav: string
): string | null => {
  console.log(caseStage);
  // Map case stages to corresponding tab title data
  const tabDataMap: Record<string, any[]> = {
    ENQUIRY: EnqueryTabTitleData,
    FACT_FIND: FFDTabTitleData,
    RESEARCH_COMPLIANCE_CHECK: RCCTabTitleData,
    DECISION_IN_PRINCIPLE: DIPTabTitleData,
    FULL_MORTGAGE_APPLICATION: FMATabTitleData,
    OFFER_FROM_BANK: OFBTabTitleData,
    LEGAL: LegalTabTitleData,
    COMPLETION: CompletionTabTitleData,
    FUTURE_OPPORTUNITY: FOPTabTitleData,
    NOT_PROCEED: NPDTabTitleData,
  };

  // Get the tab data for the provided caseStage
  const tabData = tabDataMap[caseStage];

  // If caseStage is invalid or tabData is empty, return null
  if (!tabData || tabData.length === 0) {
    return null;
  }

  // Find the index of the current tab by its nav name
  const currentIndex = tabData.findIndex((tab) => tab.nav === currentTabNav);

  // If current tab is not found or it's the last tab, return null
  if (currentIndex === -1 || currentIndex === tabData.length - 1) {
    return null;
  }

  // Return the nav name of the next tab
  return tabData[currentIndex + 1].nav;
};

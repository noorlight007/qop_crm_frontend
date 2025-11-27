import {
  InsuranceAASDTabTitleData,
  InsuranceAORTabTitleData,
  InsuranceEnquiryTabTitleData,
  InsuranceFFDTabTitleData,
  InsuranceNPWTabTitleData,
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
} from "@/Data/CommonComponentsData/SingleCaseInfo/CaseDetailsData/CaseDetailsTabTitleData";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  basicTabIndicator,
  restoreBasicTab,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useGetSectionCompleteStatusQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SectionCompleteApi";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { CaseDetailsTabContent } from "./Components/CaseDetailsTabContent";

const CaseDetails: React.FC<{ caseStage: string; caseCategory: string }> = ({
  caseStage,
  caseCategory,
}) => {
  const { casealias } = useParams();
  const basicTab = useAppSelector((state: any) => state.caseDetails.basicTabId);
  const dispatch = useAppDispatch();

  const { data: SectionCompleteStatusData } = useGetSectionCompleteStatusQuery({
    case_alias: casealias,
  });

  // Map case stages to corresponding tab title data
  const mortgageTabDataMap: Record<string, any[]> = {
    ENQUIRY: MortgageEnquiryTabTitleData,
    FACT_FIND: MortgageFFDTabTitleData,
    RESEARCH_COMPLIANCE_CHECK: MortgageRCCTabTitleData,
    DECISION_IN_PRINCIPLE: MortgageDIPTabTitleData,
    FULL_MORTGAGE_APPLICATION: MortgageFMATabTitleData,
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
    NOT_PROCEED_WITH: InsuranceNPWTabTitleData,
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

  // Restore tab from localStorage or set the first tab as default when caseStage changes
  useEffect(() => {
    if (currentTabData.length > 0) {
      // First, check if there's a saved tab in localStorage
      if (typeof window !== "undefined") {
        const savedTab = localStorage.getItem("caseDetailsActiveTab");
        if (savedTab && currentTabData.some((tab) => tab.nav === savedTab)) {
          dispatch(restoreBasicTab(savedTab));
        } else {
          // Otherwise, use the first tab
          dispatch(basicTabIndicator(currentTabData[0].nav));
        }
      } else {
        // Server-side fallback
        dispatch(basicTabIndicator(currentTabData[0].nav));
      }
    }
  }, [caseStage, dispatch, caseCategory]);

  const navToStatusKey = (nav: string) => {
    if (!nav) return "";

    // Explicit mapping for tab labels that don't map cleanly via simple normalization
    const explicitMap: Record<string, string> = {
      "Loan Details": "is_loan_details",
      "Application Overview": "is_loan_details",
      "Applicant(s) Details": "is_applicants_details",
      "Employment/Income": "is_employment_income",
      "Credit Commitments": "is_credit_commitments",
      Adverse: "is_adverse",
      Portfolio: "is_portfolio",
      "Security Property": "is_security_property",
      "Solicitors & Accountants": "is_solicitors_accountants",
      "Budget Planner": "is_budget_planner",
      "Existing Protection": "is_existing_protection",
      "Mortgage Your Needs": "is_mortgage_your_needs",
      Notes: "is_notes",
      Product: "is_product",
      "DIP History": "is_dip_history",
      Suitability: "is_suitability",
      "Insurance Health": "is_health_insurance",
      Fees: "is_fees",
      Compliance: "is_compliance",
      "Client Survey": "is_client_survey",
      Documents: "is_documents",
    };

    if (explicitMap[nav]) return explicitMap[nav];

    // Fallback normalization: remove problematic characters, lowercase, split, join with underscores
    const words = nav
      .replace(/[\/:&(),.-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .split(" ")
      .filter(Boolean);
    return `is_${words.join("_")}`;
  };

  const isSectionComplete = (nav: string) => {
    try {
      const key = navToStatusKey(nav);
      return !!(
        SectionCompleteStatusData &&
        key &&
        SectionCompleteStatusData[key]
      );
    } catch (err) {
      return false;
    }
  };

  return (
    <Col sm="12" className="box-col-12">
      <Card>
        <CardHeader>
          <Col md="3">
            <h3>Case Details</h3>
          </Col>
        </CardHeader>
        {/* Tabs for Case Details */}
        <CardBody>
          <CardHeader className="p-0">
            <Nav
              className="nav-success d-flex justify-content-center align-items-center flex-wrap gap-1 pb-2"
              pills
            >
              {currentTabData.map((item, index) => (
                <NavItem
                  key={index}
                  className="d-flex justify-content-center"
                  style={{
                    flex: "1 1 auto",
                    maxWidth: "300px",
                    cursor: "pointer",
                  }}
                >
                  <NavLink
                    outline
                    className={`${basicTab === item.nav ? "active" : ""} 
                     m-2 border d-flex justify-content-center  rounded p-3 text-center w-100`}
                    onClick={() => {
                      dispatch(basicTabIndicator(item.nav));
                    }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <span>{item.nav}</span>
                      {isSectionComplete(item.nav) && (
                        <FaCheckCircle size={16} className="ms-2" />
                      )}
                    </span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </CardHeader>
          {/* Case Details Tab Content */}
          <CardBody className="px-0 pb-0">
            <div>
              <div className="custom-casedetails-scroll">
                <CaseDetailsTabContent />
              </div>
            </div>
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CaseDetails;

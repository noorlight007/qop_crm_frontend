import {
  ApplicantInsuranceCaseDetailsTabTitleData,
  ApplicantMortgageCaseDetailsTabTitleData,
  InsuranceAASDTabTitleData,
  InsuranceAORTabTitleData,
  InsuranceEnquiryTabTitleData,
  InsuranceFFDTabTitleData,
  InsuranceNPDTabTitleData,
  InsuranceREFTabTitleData,
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
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  basicTabIndicator,
  restoreBasicTab,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetSectionCompleteStatusQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { useSession } from "next-auth/react";
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
import { CaseSectionsTabContent } from "./Components/CaseSectionsTabContent";

const CaseSections: React.FC<{ caseStage: string; caseCategory: string }> = ({
  caseStage,
  caseCategory,
}) => {
  const { casealias } = useParams();
  const session = useSession();
  const userRole = session?.data?.user?.role;
  const basicTab = useAppSelector(
    (state: any) => state.caseSections.basicTabId,
  );
  const dispatch = useAppDispatch();

  const { data: sectionCompleteStatusData } = useGetSectionCompleteStatusQuery({
    case_alias: casealias,
  });

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
    REFERRED: InsuranceREFTabTitleData,
    NOT_PROCEED: InsuranceNPDTabTitleData,
  };

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

  const mortgageApplicantTabDataMap: Record<string, any[]> = Object.fromEntries(
    mortgageApplicantStages.map((stage) => [
      stage,
      ApplicantMortgageCaseDetailsTabTitleData,
    ]),
  );

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

  const insuranceApplicantTabDataMap: Record<string, any[]> =
    Object.fromEntries(
      insuranceApplicantStages.map((stage) => [
        stage,
        ApplicantInsuranceCaseDetailsTabTitleData,
      ]),
    );

  // Get the current tab data based on caseStage and caseCategory
  let currentTabData: any[] = [];

  if (caseCategory === "MORTGAGE") {
    if (userRole === "APPLICANT") {
      currentTabData = mortgageApplicantTabDataMap[caseStage] || [];
    } else {
      currentTabData = mortgageTabDataMap[caseStage] || [];
    }
  } else if (
    caseCategory === "PROTECTION" ||
    caseCategory === "GENERAL_INSURANCE"
  ) {
    if (userRole === "APPLICANT") {
      currentTabData = insuranceApplicantTabDataMap[caseStage] || [];
    } else {
      currentTabData = insuranceTabDataMap[caseStage] || [];
    }
  } else {
    currentTabData = mortgageTabDataMap[caseStage] || [];
  }

  const visibleTabData = currentTabData;

  // Restore tab from localStorage or set the first tab as default when caseStage changes
  useEffect(() => {
    if (visibleTabData.length > 0) {
      if (typeof window !== "undefined") {
        const savedTab = localStorage.getItem("caseDetailsActiveTab");
        if (savedTab && visibleTabData.some((tab) => tab.nav === savedTab)) {
          dispatch(restoreBasicTab(savedTab));
        } else {
          dispatch(basicTabIndicator(visibleTabData[0].nav));
        }
      } else {
        dispatch(basicTabIndicator(visibleTabData[0].nav));
      }
    }
  }, [caseStage, dispatch, caseCategory, userRole]); // 👈 userRole added

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
      "Needs & Preferences": "is_needs_and_preferences",
      Notes: "is_notes",
      Product: "is_product",
      "DIP History": "is_dip_history",
      Suitability: "is_suitability",
      "Insurance Health": "is_health_insurance",
      Fees: "is_fees",
      Compliance: "is_compliance",
      "Client Survey": "is_client_survey",
      Vulnerability: "is_vulnerability",
      Documents: "is_documents",

      // Additional tabs for Insurance case
      "Insurance Overview": "is_insurance_loan_details",
      "Health Check": "is_health_check",
      Commission: "is_commission",
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
        sectionCompleteStatusData &&
        key &&
        sectionCompleteStatusData[key]
      );
    } catch (err) {
      return false;
    }
  };

  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  return (
    <Col sm="12" className="box-col-12">
      <Card>
        <CardHeader>
          <Col md="3">
            <h3>
              {session.data?.user?.role === "APPLICANT" ? (
                <span>{caseData?.name}</span>
              ) : (
                <span>Case Details</span>
              )}
            </h3>
          </Col>
        </CardHeader>
        {/* Tabs for Case Sections */}
        <CardBody>
          <CardHeader className="p-0">
            <Nav
              className="nav-secondary d-flex justify-content-center align-items-center flex-wrap gap-1 pb-2"
              pills
            >
              {visibleTabData.map((item, index) => (
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
                     m-2 border border-secondary d-flex justify-content-center  rounded p-3 text-center w-100`}
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
          {/* Case Sections Tab Content */}
          <CardBody className="px-0 pb-0">
            <div>
              <CaseSectionsTabContent />
            </div>
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CaseSections;

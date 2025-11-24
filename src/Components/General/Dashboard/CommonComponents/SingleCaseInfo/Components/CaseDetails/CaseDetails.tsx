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
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  basicTabIndicator,
  restoreBasicTab,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useEffect } from "react";
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

const CaseDetails: React.FC<{ caseStage: string }> = ({ caseStage }) => {
  const basicTab = useAppSelector((state: any) => state.caseDetails.basicTabId);
  const isRequired = useAppSelector(
    (state: any) => state.caseDetails.isRequired
  );
  const requiredFilledTabId = useAppSelector(
    (state: any) => state.caseDetails.requiredFilledTabId
  );
  const dispatch = useAppDispatch();

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

  // Get the current tab data based on caseStage
  const currentTabData = tabDataMap[caseStage] || [];

  // Restore tab from localStorage or set the first tab as default when caseStage changes
  useEffect(() => {
    if (currentTabData.length > 0) {
      // First, check if there's a saved tab in localStorage
      if (typeof window !== "undefined") {
        const savedTab = localStorage.getItem("caseDetailsActiveTab");
        if (savedTab && currentTabData.some((tab) => tab.nav === savedTab)) {
          // Use the saved tab if it exists in the current stage's tabs
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
  }, [caseStage, dispatch, currentTabData]);

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
                    {item.nav}
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

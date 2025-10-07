import { useAppSelector } from "@/Redux/Hooks";
import { TabContent } from "reactstrap";
import { AdverseTab } from "./Adverse/AdverseTab";
import { ApplicantsDetailsTab } from "./ApplicantsDetails/ApplicantsDetailsTab";
import BudgetPlanner from "./BudgetPlanner/BudgetPlanner";
import ClientSurveyContent from "./ClientSurvey/ClientSurveyContent";
import { ComplianceTab } from "./Compliance/ComplianceTab";
import CreditCommitmentsContent from "./CreditCommitments/CreditCommitmentsContent";
import DIPHistoryTab from "./DIPHistory/DIPHistoryTab";
import Documents from "./Documents/Documents";
import { EmploymentTab } from "./Employment/EmploymentTab";
import ExistingProtectionTab from "./ExistingProtection/ExistingProtectionTab";
import FeesTab from "./Fees/FeesTab";
import { LoanDetailsTab } from "./LoanDetails/LoanDetailsTab";
import MortgageYourNeedsContent from "./MortgageYourNeeds/MortgageYourNeedsContent";
import { NotesTab } from "./Notes/NotesTab";
import PortfolioContent from "./Portfolio/PortfolioContent";
import ProductContent from "./Product/ProductContent";
import SecurityProperty from "./SecurityProperty/SecurityProperty";
import SolicitorsAndAccountantsTab from "./SolicitorsAndAccountants/SolicitorsAndAccountantsTab";
import SuitabilityContent from "./Suitability/SuitabilityContent";

// Define a mapping of tab names to components
const tabComponents: Record<string, React.FC> = {
  "Loan Details": LoanDetailsTab,
  "Application Overview": LoanDetailsTab,
  "Applicant(s) Details": ApplicantsDetailsTab,
  "Employment/Income": EmploymentTab,
  "Credit Commitments": CreditCommitmentsContent,
  Adverse: AdverseTab,
  Portfolio: PortfolioContent,
  "Security Property": SecurityProperty,
  "Solicitors & Accountants": SolicitorsAndAccountantsTab,
  "Budget Planner": BudgetPlanner,
  "Existing Protection": ExistingProtectionTab,
  "Mortgage Your Needs": MortgageYourNeedsContent,
  Notes: NotesTab,
  Product: ProductContent,
  "DIP History": DIPHistoryTab,
  Suitability: SuitabilityContent,
  Fees: FeesTab,
  Compliance: ComplianceTab,
  "Client Survey": ClientSurveyContent,
  Documents: Documents,
};

export const CaseDetailsTabContent: React.FC = () => {
  const basicTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const ActiveTabComponent = basicTab ? tabComponents[basicTab] : null; // Fix: Ensure basicTab is not null

  return (
    <TabContent>
      {ActiveTabComponent ? (
        <ActiveTabComponent />
      ) : (
        <div className=" text-center text-warning fs-3">
          No Content Available
        </div>
      )}
    </TabContent>
  );
};

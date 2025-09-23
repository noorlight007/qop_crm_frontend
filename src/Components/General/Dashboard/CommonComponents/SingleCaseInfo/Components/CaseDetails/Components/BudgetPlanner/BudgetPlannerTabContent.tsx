import LoadingSpinner from "@/app/loading";
import { useGetCaseBudgetPlannerQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/BudgetPlanner/BudgetPlannerApi";
import { initializeBudgetPlannerForm } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/BudgetPlanner/BudgetPlannerFormSlice";
import { BudgetPlannerTabContentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/BudgetPlannerTypes";
import { useParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, TabContent, TabPane } from "reactstrap";
import DebtRepaymentTabContent from "./BudgetPlannerTabContents/DebtRepaymentTabContent";
import DisclaimerTabContents from "./BudgetPlannerTabContents/DisclaimerTabContents";
import HouseHoldIncomeTabContent from "./BudgetPlannerTabContents/HouseHoldIncomeTabContent";
import LivingExpensesTabContents from "./BudgetPlannerTabContents/LivingExpensesTabContents";
import MonthlyBudgetTabContents from "./BudgetPlannerTabContents/MonthlyBudgetTabContents";

const tabs = [
  { id: 1, Component: HouseHoldIncomeTabContent },
  { id: 2, Component: DebtRepaymentTabContent },
  { id: 3, Component: LivingExpensesTabContents },
  { id: 4, Component: MonthlyBudgetTabContents },
  { id: 5, Component: DisclaimerTabContents },
];

const BudgetPlannerTabContent: FC<BudgetPlannerTabContentProps> = ({
  tabId,
  setTabId,
  updateField,
}) => {
  const { casealias } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCaseBudgetPlannerQuery(
    { case_alias: casealias as string },
    { skip: !casealias }
  );
  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (data && data[0]) {
      const alias = (data[0] as any)?.alias ?? JSON.stringify(data[0]);
      if (initializedRef.current !== alias) {
        dispatch(initializeBudgetPlannerForm(data[0]));
        initializedRef.current = alias;
      }
    }
  }, [data, dispatch]);

  // Don't hard-block UI; only show spinner if no data has been initialized yet
  if (isLoading && !initializedRef.current) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <TabContent activeTab={tabId ?? undefined}>
      {tabs.map(({ id, Component }) => (
        <TabPane key={id} tabId={id}>
          <Component updateField={updateField} />{" "}
          {/* Pass updateField to each tab */}
          {id !== 5 && (
            <Button
              color="primary"
              onClick={() => tabId !== null && setTabId(tabId + 1)}
              className="float-end mt-2"
            >
              Next
            </Button>
          )}
        </TabPane>
      ))}
    </TabContent>
  );
};

export default BudgetPlannerTabContent;

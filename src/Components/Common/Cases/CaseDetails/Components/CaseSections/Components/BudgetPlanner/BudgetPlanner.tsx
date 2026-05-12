import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetCaseBudgetPlannerQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";

import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import BudgetPlannerInline, {
  BudgetPlannerInlineHandle,
} from "./BudgetPlannerInline";

const BudgetPlanner: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { casealias } = params;
  const dispatch = useAppDispatch();
  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const { isLoading: isBudgetPlannerLoading, refetch: refetchBudgetPlanner } =
    useGetCaseBudgetPlannerQuery(
      { case_alias: casealias as string },
      { skip: !casealias, refetchOnMountOrArgChange: true },
    );
  const [plannerTab, setPlannerTab] = useState<number>(1);
  const plannerRef = useRef<BudgetPlannerInlineHandle | null>(null);
  const [isPlannerSaving, setIsPlannerSaving] = useState(false);
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const budgetPlannerState = useAppSelector(
    (state: any) => state.budgetPlanner,
  );

  useEffect(() => {
    if (currentTab === "Budget Planner" && casealias) {
      refetchBudgetPlanner();
    }
  }, [currentTab, casealias, refetchBudgetPlanner]);

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.info("This is the last tab.");
    }
  };

  const handleSaveAndNext = async () => {
    const isSaved = await saveAll();
    if (isSaved) handleNextTab();
  };

  const canSavePlanner =
    plannerTab === 5 &&
    Boolean((budgetPlannerState as any)?.alias) &&
    Boolean((budgetPlannerState as any)?.disclaimer);

  const saveAll = async (): Promise<boolean> => {
    if (!canSavePlanner) return false;
    try {
      setIsPlannerSaving(true);
      return (await plannerRef.current?.savePlanner?.()) ?? false;
    } finally {
      setIsPlannerSaving(false);
    }
  };

  const isApplicant = session?.user?.role === "APPLICANT";
  const isEditable = caseData?.is_editable !== false;
  const isLocked = isApplicant && !isEditable;

  return (
    <div>
      <div style={{ position: "relative" }}>
        {isLocked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              cursor: "not-allowed",
              backgroundColor: "rgba(0,0,0,0.0001)",
            }}
          />
        )}
        <div
          style={{
            opacity: isLocked ? 0.45 : 1,
            pointerEvents: isLocked ? "none" : "auto",
          }}
        >
          <BudgetPlannerInline
            ref={plannerRef as any}
            onTabChange={setPlannerTab}
          />
          <div>
            <div className="mt-2 d-flex justify-content-end w-100 gap-2">
              <Button
                color="primary"
                onClick={saveAll}
                disabled={
                  !canSavePlanner || isPlannerSaving || isBudgetPlannerLoading
                }
              >
                {isPlannerSaving ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                color="secondary"
                onClick={handleSaveAndNext}
                disabled={
                  !canSavePlanner || isPlannerSaving || isBudgetPlannerLoading
                }
              >
                Save & Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;

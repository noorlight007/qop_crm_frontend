import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";

import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Input } from "reactstrap";
import BudgetPlannerModal from "./BudgetPlannerModals/BudgetPlannerModal";

const BudgetPlanner: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { casealias } = params;
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

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

  return (
    <div>
      <div className="d-flex flex-column gap-3">
        <Button color="primary" onClick={toggleModal}>
          Complete Budget Planner
        </Button>
        <Input type="textarea" placeholder="Enter notes..." rows={4} />
        <div className="mt-auto d-flex justify-content-end w-100 gap-2">
          <Button color="primary" title="Api Error!" disabled>
            Save Changes
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              handleNextTab();
            }}
          >
            {session?.user?.user_type === "CLIENT"
              ? "Go To Next"
              : "Save & Next"}
          </Button>
        </div>
      </div>

      <BudgetPlannerModal isOpen={isModalOpen} toggle={toggleModal} />
    </div>
  );
};

export default BudgetPlanner;

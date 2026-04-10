import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  useGetCaseBudgetPlannerQuery,
  useUpdateBudgectPlannerNoteMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";

import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Input } from "reactstrap";
import BudgetPlannerModal from "./BudgetPlannerModals/BudgetPlannerModal";

const BudgetPlanner: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { casealias } = params;
  const dispatch = useAppDispatch();
  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const {
    data: budgetPlannerData,
    isLoading: isBudgetPlannerLoading,
    refetch: refetchBudgetPlanner,
  } = useGetCaseBudgetPlannerQuery(
    { case_alias: casealias as string },
    { skip: !casealias, refetchOnMountOrArgChange: true },
  );
  const [updateBudgectPlannerNote, { isLoading: isSaving }] =
    useUpdateBudgectPlannerNoteMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [initialNotes, setInitialNotes] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const plannerRecord = Array.isArray(budgetPlannerData)
    ? budgetPlannerData[0]
    : budgetPlannerData;

  useEffect(() => {
    const plannerNote = (plannerRecord as any)?.note || "";
    setNotes(plannerNote);
    setInitialNotes(plannerNote);
  }, [plannerRecord]);

  useEffect(() => {
    if (currentTab === "Budget Planner" && casealias) {
      refetchBudgetPlanner();
    }
  }, [currentTab, casealias, refetchBudgetPlanner]);

  const hasNoteChanges = notes !== initialNotes;

  const saveNotes = async (): Promise<boolean> => {
    try {
      if (!hasNoteChanges) {
        return true;
      }

      if (!caseData?.alias) {
        toast.error("Case details are not available.");
        return false;
      }

      let budgetPlannerAlias = (plannerRecord as any)?.alias;
      if (!budgetPlannerAlias && casealias) {
        const refreshed = await refetchBudgetPlanner();
        const refreshedPlanner = Array.isArray((refreshed as any)?.data)
          ? (refreshed as any)?.data?.[0]
          : (refreshed as any)?.data;
        budgetPlannerAlias = refreshedPlanner?.alias;
      }

      if (!budgetPlannerAlias) {
        if (isBudgetPlannerLoading) {
          toast.info("Budget planner is still loading. Please try again.");
        } else {
          toast.error(
            "Budget planner details are not available. Please complete Budget Planner first.",
          );
        }
        return false;
      }

      const res = await updateBudgectPlannerNote({
        case_alias: caseData.alias,
        budgetplanner_alias: budgetPlannerAlias,
        note: notes,
      });

      if (res.data) {
        setInitialNotes(notes);
        toast.success("Notes saved successfully.");
        return true;
      }

      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to save notes.";
      toast.error(errorMessage);
      return false;
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes. Please try again.");
      return false;
    }
  };

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
    if (session?.user?.role === "APPLICANT") {
      handleNextTab();
      return;
    }

    const isSaved = await saveNotes();
    if (isSaved) {
      handleNextTab();
    }
  };

  return (
    <div>
      <div className="d-flex flex-column gap-3">
        <Button color="primary" onClick={toggleModal}>
          Complete Budget Planner
        </Button>
        <Input
          type="textarea"
          placeholder="Enter notes..."
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-auto d-flex justify-content-end w-100 gap-2">
          <Button
            color="primary"
            onClick={saveNotes}
            disabled={!hasNoteChanges || isSaving || isBudgetPlannerLoading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            color="secondary"
            onClick={handleSaveAndNext}
            disabled={isSaving || isBudgetPlannerLoading}
          >
            {session?.user?.role === "APPLICANT" ? "Go To Next" : "Save & Next"}
          </Button>
        </div>
      </div>

      <BudgetPlannerModal isOpen={isModalOpen} toggle={toggleModal} />
    </div>
  );
};

export default BudgetPlanner;

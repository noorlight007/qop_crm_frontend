import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useGetNotesQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/NotesApi";
import { NotesTabContentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesAndTaskTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, TabContent, TabPane } from "reactstrap";
import NotesViewTab from "./NotesViewTabs/NotesViewTab";
import TasksViewTab from "./NotesViewTabs/TasksViewTab";

export const NotesTabContent: React.FC<NotesTabContentProps> = ({
  tabId,
  setTabId,
}) => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const {
    data: caseData,
    isLoading: isCaseFetching,
    isError,
  } = useGetSingleCaseQuery({ case_alias: casealias }, { skip: !casealias });
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetNotesQuery({ case_alias: casealias });

  const handleNext = () => setTabId((parseInt(tabId) + 1).toString());
  // Use API data if available, otherwise use static data
  const notes = data?.filter((item: NoteTask) => item.note_task === "NOTE");
  const tasks = data?.filter((item: NoteTask) => item.note_task === "TASK");
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );
  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <TabContent activeTab={tabId} className="w-full">
        <TabPane tabId="1">
          <NotesViewTab notes={notes} />
          <Button color="primary" onClick={handleNext} className="float-end">
            Next
          </Button>
        </TabPane>
        <TabPane tabId="2">
          <TasksViewTab tasks={tasks} />
          <div className=" d-flex justify-content-end">
            <Button
              type="submit"
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
        </TabPane>
      </TabContent>
    </div>
  );
};

export interface NoteTask {
  alias: string;
  case: {
    alias: string;
    name: string;
    case_category: "MORTGAGE" | string; // Add other possible categories if known
    applicant_type: "SINGLE" | string; // Add other possible types if known
    case_status: "NEW_LEAD" | string; // Add other possible statuses if known
    case_stage: "DECISION_IN_PRINCIPLE" | string; // Add other possible stages if known
    created_at: string; // ISO 8601 date string
  };
  note_task: "TASK" | "NOTE";
  note_visible_to_introducer: boolean;
  note_visible_to_client: boolean;
  category: string | null;
  task_priority: "HIGH" | "LOW" | "" | string | null; // Add other possible priorities if known
  due_date: string | null; // ISO 8601 date string or null
  assigned_to: number | null;
  note: string | null;
  created_by: {
    id: number;
    alias: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: "LEAD" | string; // Add other possible user types if known
  };
  updated_by: null | {
    id: number;
    alias: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    user_type: string;
  };
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

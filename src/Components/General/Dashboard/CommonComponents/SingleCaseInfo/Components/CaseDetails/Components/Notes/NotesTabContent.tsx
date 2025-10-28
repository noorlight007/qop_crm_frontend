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
import Notes from "./Notes/Notes";
import TasksViewTab from "./NotesViewTabs/TasksViewTab";
import { NoteTask } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesTypes";

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
          {/* <NotesViewTab notes={notes} /> */}
          <Notes />
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



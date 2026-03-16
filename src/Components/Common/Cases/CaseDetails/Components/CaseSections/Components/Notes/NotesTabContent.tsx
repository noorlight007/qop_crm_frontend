import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { NotesTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, TabContent, TabPane } from "reactstrap";
import Notes from "./Notes/Notes";
import Tasks from "./Tasks/Tasks";

export const NotesTabContent: React.FC<NotesTabContentProps> = ({
  tabId,
  setTabId,
}) => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const dispatch = useAppDispatch();

  const handleNext = () => setTabId((parseInt(tabId) + 1).toString());

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
      toast.warning("This is the last tab.");
    }
  };

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
          <Tasks />
          <div className=" d-flex justify-content-end">
            <Button
              type="submit"
              color="secondary"
              onClick={() => {
                handleNextTab();
              }}
            >
              Go to Next
            </Button>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

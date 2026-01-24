import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { NotesTabContentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesAndTaskTypes";
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
    { skip: !casealias }
  );
  const dispatch = useAppDispatch();

  const handleNext = () => setTabId((parseInt(tabId) + 1).toString());

  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );
  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!
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

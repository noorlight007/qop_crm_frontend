import LoadingSpinner from "@/app/loading";
import { useGetDIPHistoryDetailsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/DIPHistoryDetails/DIPHistoryDetailsApi";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import DIPHistoryContent from "./DIPHistoryContent";
import AddNewLenderHistoryModal from "./Modals/AddNewLenderHistoryModal";

interface DIPHistoryProps {
  alias: string;
  is_this_application_had_a_decision_in_principle: boolean;
  lender: string;
  dip_date: string;
  dip_decision: string;
  dip_reference_number: string;
  notes: string;
}

const DIPHistoryTab: React.FC = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>("1");
  const { casealias } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const { data: dipHistories, isLoading } = useGetDIPHistoryDetailsQuery({
    case_alias: casealias,
  });

  const histories = dipHistories?.results ?? [];

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-1">
      {histories.length > 0 ? (
        <>
          <Nav className="nav-warning justify-content-center" pills>
            {histories.map((_: any, index: number) => (
              <NavItem key={index}>
                <NavLink
                  className={`${
                    activeTab === String(index + 1) ? "active" : ""
                  }`}
                  onClick={() => toggle(String(index + 1))}
                  style={{ cursor: "pointer" }}
                >
                  DIP History {index + 1}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeTab}>
            {histories.map((dipHistory: DIPHistoryProps, index: number) => (
              <TabPane key={index} tabId={String(index + 1)}>
                <div className="p-1">
                  <DIPHistoryContent dipData={dipHistory} />
                </div>
              </TabPane>
            ))}
          </TabContent>
        </>
      ) : (
        <div className="text-center mt-4">
          <p className="mb-3">No DIP History found</p>
          <Button
            color="success"
            onClick={() => setModalIsOpen(true)}
            type="button"
            disabled={
              session?.user?.role === "APPLICANT" && histories.length > 0
            }
          >
            Add New Lender History
          </Button>
        </div>
      )}
      {/* Modal Component */}
      <AddNewLenderHistoryModal
        isOpen={modalIsOpen}
        toggle={() => setModalIsOpen(!modalIsOpen)}
      />
    </div>
  );
};

export default DIPHistoryTab;

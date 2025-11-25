import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useUpdateComplianceMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Compliance/ComplianceApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SectionCompleteApi";
import { RootState } from "@/Redux/Store";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { ComplianceTabContents } from "./ComplianceTabContents";
import { ComplianceRatingCard } from "./ComplianceTabContents/ComplianceRatingCard";

export const ComplianceTab = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  const [basicTab, setBasicTab] = useState("1");
  const complianceState = useAppSelector(
    (state: RootState) => state.compliance
  );
  const [updateCompliance, { isLoading: isUpdating }] =
    useUpdateComplianceMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  // Update this to use the Redux state
  const handleUpdateAll = async () => {
    try {
      const changedFields = Object.entries(complianceState).reduce(
        (acc, [key, value]) => {
          if (value !== null) {
            (acc as Record<string, any>)[key] = value;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(changedFields).length > 0) {
        const res = await updateCompliance({
          case_alias: casealias,
          payload: changedFields,
        });
        if (res.data) {
          toast.success("Compliance data updated successfully");
          try {
            await updateSectionCompleteStatus({
              case_alias: casealias,
              section_data: { is_compliance: true },
            });
          } catch (err) {
            console.error("Failed to update section complete status:", err);
          }
        } else if (res.error) {
          const errorMessage =
            (res.error as any)?.data?.detail ||
            "Failed to update compliance data!";
          toast.error(errorMessage);
        } else {
          toast.error("Failed to update compliance data");
        }
      }
    } catch (error) {
      console.error("Failed to update compliance data:", error);
    }
  };

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

  return (
    <Col xxl="12">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <section className=" mb-4">
              <ComplianceRatingCard />
            </section>
            <Nav
              className="nav-warning d-flex justify-content-center align-content-center"
              pills
            >
              {[
                { id: "1", nav: "Disclosure Document/s" },
                { id: "2", nav: "Data Protection - GDPR" },
                { id: "3", nav: "Anti-Money Laundering" },
                { id: "4", nav: "Mandatory Documentation" },
                { id: "5", nav: "Fact Find" },
                { id: "6", nav: "Budget Planner" },
                { id: "7", nav: "EOR & KFI" },
                { id: "8", nav: "Application" },
                { id: "9", nav: "Suitability" },
              ].map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={`${basicTab === item.id ? "active" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setBasicTab(item.id)}
                  >
                    {item.nav}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <ComplianceTabContents tabId={basicTab} setTabId={setBasicTab} />
            <div className="d-flex justify-content-end mb-3 gap-2 px-2">
              <Button
                color="primary"
                onClick={handleUpdateAll}
                disabled={isUpdating || session?.user?.user_type === "CLIENT"}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                color="secondary"
                onClick={async () => {
                  if (session?.user?.user_type === "CLIENT") {
                    handleNextTab();
                  } else {
                    await handleUpdateAll();
                    handleNextTab();
                  }
                }}
              >
                {session?.user?.user_type === "CLIENT"
                  ? "Go To Next"
                  : "Save & Next"}
              </Button>
            </div>
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};

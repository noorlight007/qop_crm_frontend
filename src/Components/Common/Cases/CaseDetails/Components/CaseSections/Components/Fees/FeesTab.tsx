import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useDownloadFeesSummaryMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { TbDownload } from "react-icons/tb";
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
  Spinner,
} from "reactstrap";
import { FeesTabContent } from "./FeesTabContent";

const FeesTab: FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const [basicTab, setBasicTab] = useState("1");

  const [downloadFeesSummary, { isLoading: isFeesSummaryDownloading }] =
    useDownloadFeesSummaryMutation();

  const handleDownloadFeesSummary = async () => {
    try {
      const blob = await downloadFeesSummary({
        case_alias: casealias,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fees-summary(${caseData?.name}).pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download report. Please try again.");
    }
  };

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
    <Col xxl="12">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-warning" pills>
              {[
                { id: "1", nav: "Fees In" },
                { id: "2", nav: "Fees Out" },
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
            <div className="position-absolute top-0 end-0 me-2">
              <Button color="info" disabled={isFeesSummaryDownloading}>
                {isFeesSummaryDownloading ? (
                  <>
                    <Spinner size="sm" color="dark" className="me-2" />
                    Downloading...
                  </>
                ) : (
                  <div onClick={handleDownloadFeesSummary}>
                    <TbDownload size={20} className="me-2" />
                    Download Fees Summary
                  </div>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="pxd-0 pbd-0">
            <FeesTabContent tabId={basicTab} setTabId={setBasicTab} />
            <div className="d-flex justify-content-end px-4">
              <Button
                color="secondary"
                className="mt-3"
                onClick={handleNextTab}
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

export default FeesTab;

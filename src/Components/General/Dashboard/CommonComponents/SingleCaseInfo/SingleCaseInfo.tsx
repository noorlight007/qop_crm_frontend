import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetJointUserInfoQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointUser/JointUserDetailsApi";
import { CaseInfoPrpos } from "@/Types/CommonComponents/Cases/CaseTypes";
import LoadingSpinner from "@/app/loading";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row } from "reactstrap";
import CalenderContainer from "./Components/Calender/CalenderContainer";
import CaseDetails from "./Components/CaseDetails/CaseDetails";
import CaseInfo from "./Components/CaseInfo/CaseInfo";
import JointUsers from "./Components/JointUsers/JointUsers";
import MeetingHistory from "./Components/MeetingHistory/MeetingHistory";

const SingleCaseInfo: React.FC = () => {
  const [caseInfo, setCaseInfo] = useState<CaseInfoPrpos>();
  const params = useParams();
  const { casealias } = params;
  const router = useRouter();
  const { data: session } = useSession();

  // Function to generate role-based URL for case details
  const getDashboardUrl = () => {
    const userType = session?.user?.user_type;
    switch (userType) {
      case "ADMIN":
        return `/dashboard/admin`;
      case "NETWORK_ADMIN":
        return `/dashboard/network/cases`;
      case "NETWORK_ADVISER":
        return `/dashboard/netadviser/cases`;
      case "ORGANIZATION_ADMIN":
        return `/dashboard/organisation/cases`;
      case "ORGANIZATION_ADVISER":
        return `/dashboard/orgadviser/cases`;
      case "ORGANIZATION_SUPPORT":
        return `/dashboard/orgstaff/caseupdates`;
      case "CLIENT":
        return `/dashboard/client/cases`;
      default:
        return `url not found`;
    }
  };

  // rtk hooks
  const { data: jointUserInfo, isLoading: isJointUserFetcing } =
    useGetJointUserInfoQuery({ case_alias: casealias }, { skip: !casealias });

  const {
    data: caseData,
    isLoading,
    isError,
  } = useGetSingleCaseQuery({ case_alias: casealias }, { skip: !casealias });

  useEffect(() => {
    if (!isLoading) {
      if (isError || !caseData) {
        router.push(getDashboardUrl());
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (caseData.alias !== casealias) {
        router.push(getDashboardUrl());
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      setCaseInfo(caseData);
    }
  }, [caseData, casealias, router, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !caseInfo) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Container fluid>
        <Row>
          <CaseInfo caseInfo={caseInfo} isLoading={isLoading} />
        </Row>
        <Row>
          <CaseDetails
            caseCategory={caseInfo?.case_category || ""}
            caseStage={caseInfo?.case_stage || ""}
          />
        </Row>
        <Row>
          <JointUsers
            jointUserInfo={jointUserInfo}
            isLoading={isJointUserFetcing}
          />
        </Row>
        <Row>
          <MeetingHistory />
        </Row>
        <Row>
          <CalenderContainer />
        </Row>
      </Container>
    </>
  );
};

export default SingleCaseInfo;

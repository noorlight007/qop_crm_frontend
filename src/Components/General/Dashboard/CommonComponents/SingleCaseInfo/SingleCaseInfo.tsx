import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetJointApplicantInfoQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantApi";
import { CaseInfoPrpos } from "@/Types/CommonComponents/Cases/CaseTypes";
import LoadingSpinner from "@/app/loading";
import { getAllCasesUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row } from "reactstrap";
import CaseDetails from "./Components/CaseDetails/CaseDetails";
import CaseInfo from "./Components/CaseInfo/CaseInfo";

const SingleCaseInfo: React.FC = () => {
  const { data: session } = useSession();
  const [caseInfo, setCaseInfo] = useState<CaseInfoPrpos>();
  const params = useParams();
  const { casealias } = params;
  const router = useRouter();

  // rtk hooks
  const { data: jointApplicantInfo, isLoading: isJointApplicantLoading } =
    useGetJointApplicantInfoQuery(
      { case_alias: casealias },
      { skip: !casealias }
    );

  const {
    data: caseData,
    isLoading,
    isError,
  } = useGetSingleCaseQuery({ case_alias: casealias }, { skip: !casealias });

  useEffect(() => {
    if (!isLoading) {
      if (isError || !caseData) {
        router.push(getAllCasesUrl(session));
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (caseData.alias !== casealias) {
        router.push(getAllCasesUrl(session));
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
    return null;
  }

  return (
    <>
      <Container fluid>
        <Row>
          <CaseInfo
            caseInfo={caseInfo}
            isLoading={isLoading}
            jointApplicantInfo={jointApplicantInfo}
            isJointApplicantLoading={isJointApplicantLoading}
          />
        </Row>
        <Row>
          <CaseDetails
            caseCategory={caseInfo?.case_category || ""}
            caseStage={caseInfo?.case_stage || ""}
          />
        </Row>
        <Row>{/* <CalenderContainer /> */}</Row>
      </Container>
    </>
  );
};

export default SingleCaseInfo;

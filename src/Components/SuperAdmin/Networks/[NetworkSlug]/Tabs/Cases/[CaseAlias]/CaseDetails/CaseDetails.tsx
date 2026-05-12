import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import CaseSections from "@/Components/Common/Cases/CaseDetails/Components/CaseSections/CaseSections";
import { useGetJointApplicantInfoQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/JointApplicant/JointApplicantApi";
import { useGetNetworkCaseDetailsQuery } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { CaseInfoPrpos } from "@/Types/Common/Cases/CaseTypes";
import { getNetworkCaseUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row } from "reactstrap";
import CaseInfo from "./CaseInfo/CaseInfo";

const CaseDetails: React.FC = () => {
  const { data: session } = useSession();
    const { networkslug, casealias } = useParams();
    const router = useRouter();
    const [caseInfo, setCaseInfo] = useState<CaseInfoPrpos>();

  const { data: caseDetails, isLoading, isError } = useGetNetworkCaseDetailsQuery(
    {
      network_slug: networkslug as string,
    case_alias: casealias as string, 
    },
    { skip: !casealias || !networkslug },
  );
const { data: jointApplicantInfo, isLoading: isJointApplicantLoading } =
    useGetJointApplicantInfoQuery(
      { case_alias: casealias },
      { skip: !casealias },
    );

    useEffect(() => {
        if (!isLoading) {
          if (isError || !caseDetails) {
            router.push(getNetworkCaseUrl(
              networkslug as string,
              casealias as string,
              session?.user?.role as string
            ));
            toast.error("Find Wrong URL! Redirecting...");
            return;
          }
    
          if (caseDetails.alias !== casealias) {
            router.push(getNetworkCaseUrl(
              networkslug as string,
              casealias as string,
              session?.user?.role as string
            ));
            toast.error("Find Wrong URL! Redirecting...");
            return;
          }
    
          setCaseInfo(caseDetails);
        }
      }, [caseDetails, casealias, router, isLoading, isError]);
    
      if (isLoading) {
        return (
          <div className="p-4">
            <LoadingGrow />
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
            networkSlug={networkslug as string}
            isLoading={isLoading}
            jointApplicantInfo={jointApplicantInfo}
            isJointApplicantLoading={isJointApplicantLoading}
          />
        </Row>
        <Row>
          <CaseSections
            caseCategory={caseInfo?.case_category || ""}
            caseStage={caseInfo?.case_stage || ""}
          />
        </Row>
        <Row>{/* <CalenderContainer /> */}</Row>
      </Container>
    </>
  );
};

export default CaseDetails;
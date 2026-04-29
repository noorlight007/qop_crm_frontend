import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import CaseSections from "@/Components/Common/Cases/CaseDetails/Components/CaseSections/CaseSections";
import { useGetJointApplicantInfoQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/JointApplicant/JointApplicantApi";
import { useGetOrgCaseDetailsQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgCasesApi";
import { CaseInfoPrpos } from "@/Types/Common/Cases/CaseTypes";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import CaseInfo from "./CaseInfo/CaseInfo";

const CaseDetails: React.FC = () => {
  const { data: session } = useSession();
  const [caseInfo, setCaseInfo] = useState<CaseInfoPrpos>();
  const params = useParams();
  const { casealias } = params;
  const { organisationslug } = params;
  const router = useRouter();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : casealias;
  const organisationSlug = Array.isArray(organisationslug)
    ? organisationslug[0]
    : organisationslug;

  // rtk hooks
  const { data: jointApplicantInfo, isLoading: isJointApplicantLoading } =
    useGetJointApplicantInfoQuery(
      { case_alias: caseAlias },
      { skip: !caseAlias },
    );

  const {
    data: caseData,
    isLoading,
    isError,
  } = useGetOrgCaseDetailsQuery(
    { organisationslug: organisationSlug, case_alias: caseAlias },
    { skip: !caseAlias },
  );

  useEffect(() => {
    if (!isLoading) {
      setCaseInfo(caseData);
    }
  }, [
    caseData,
    caseAlias,
    organisationSlug,
    router,
    isLoading,
    isError,
    session,
  ]);

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
      </Container>
    </>
  );
};

export default CaseDetails;

import LoadingSpinner, { LoadingSpinner2 } from "@/app/loading";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseSections from "@/Components/Common/Cases/CaseDetails/Components/CaseSections/CaseSections";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Container } from "reactstrap";

const ApplicantCaseDetailsContainer: React.FC = () => {
  const router = useRouter();
  const { casealias } = useParams();
  const {
    data: caseData,
    isLoading,
    isError,
  } = useGetSingleCaseQuery({ case_alias: casealias }, { skip: !casealias });

  useEffect(() => {
    if (!isLoading) {
      if (isError || !caseData) {
        router.push("/applicant/dashboard");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (caseData.alias !== casealias) {
        router.push("/applicant/dashboard");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }
    }
  }, [caseData, casealias, router, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner2 />
      </div>
    );
  }

  if (isError || !caseData) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Breadcrumbs
        title="Applicant Case Details"
        subTitle="Welcome back! Let’s start from where you left."
        items={[
          { label: "Applicant" },
          { label: "Case Details", active: true },
        ]}
      />
      <Container fluid>
        <CaseSections
          caseCategory={caseData?.case_category || ""}
          caseStage={caseData?.case_stage || ""}
        />
      </Container>
    </>
  );
};

export default ApplicantCaseDetailsContainer;

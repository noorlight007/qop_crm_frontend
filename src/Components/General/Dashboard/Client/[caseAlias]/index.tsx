import LoadingSpinner from "@/app/loading";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Container } from "reactstrap";
import CaseDetails from "../../CommonComponents/SingleCaseInfo/Components/CaseDetails/CaseDetails";
import ClientBreadcrumbs from "../Breadcrumbs/Breadcrumbs";

const ClientSingleCaseContainer: React.FC = () => {
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
        router.push("/dashboard/client");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (caseData.alias !== casealias) {
        router.push("/dashboard/client");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }
    }
  }, [caseData, casealias, router, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !caseData) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <ClientBreadcrumbs
        mainTitle="Client Dashboard"
        title="Welcome back! Let’s start from where you left."
        parent="Dashboard"
        activePage="Client"
      />
      <Container fluid>
        <CaseDetails
          caseCategory={caseData?.case_category || ""}
          caseStage={caseData?.case_stage || ""}
        />
      </Container>
    </>
  );
};

export default ClientSingleCaseContainer;

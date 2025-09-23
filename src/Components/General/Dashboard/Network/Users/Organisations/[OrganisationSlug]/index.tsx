import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import { useGetSingleOrganisationQuery } from "@/Redux/Reducers/Network/Organisations/SingleOrganisation/SingleOrganisationApi";
import { SingleOrganisationsProps } from "@/Types/Network/OrganisationsTypes";
import LoadingSpinner from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import OrgAdvisers from "./Advisers/OrgAdvisers";
import OrgCases from "./Cases/OrgCases";
import OrgLendersChart from "./Charts/LendersChart/LendersChart";
import OrgMortgagesChart from "./Charts/MortgagesChart/MortgagesChart";
import OrgClients from "./Clients/OrgClients";
import DangerZone from "./DangerZone/DangerZone";
import OrgLeads from "./Leads/OrgLeads";
import OrganisationProfile from "./OrganisationProfile/OrganisationProfile";
import Overview from "./Overview/Overview";

const SingleOrganisationContainer: React.FC = () => {
  const [singleOrgInfo, setSingleOrgInfo] =
    useState<SingleOrganisationsProps>();
  const { organisationslug } = useParams();
  const router = useRouter();

  // rtk hooks
  const {
    data: singleOrgData,
    isLoading,
    isError,
  } = useGetSingleOrganisationQuery(
    { organisationslug },
    {
      skip: !organisationslug,
    }
  );

  useEffect(() => {
    if (!isLoading) {
      if (isError || !singleOrgData) {
        router.push("/dashboard/network");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (singleOrgData?.organization.slug !== organisationslug) {
        router.push("/dashboard/network");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      setSingleOrgInfo(singleOrgData);
    }
  }, [singleOrgData, organisationslug, router, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !singleOrgInfo) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome! Continue your journey."
        parent="Users"
        child="Organisation"
      />
      <Container fluid>
        <Row>
          <Col md="4">
            <OrganisationProfile
              singleOrgInfo={singleOrgInfo}
              isLoading={isLoading}
            />
          </Col>
          <Col md="4">
            <OrgMortgagesChart
              singleOrgInfo={singleOrgInfo}
              isLoading={isLoading}
            />
          </Col>
          <Col md="4">
            <OrgLendersChart
              singleOrgInfo={singleOrgInfo}
              isLoading={isLoading}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Overview singleOrgInfo={singleOrgInfo} isLoading={isLoading} />
            <OrgLeads />
            <OrgCases />
            <OrgClients />
            <OrgAdvisers />
            <DangerZone singleOrgInfo={singleOrgInfo} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SingleOrganisationContainer;

import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import {
  useGetSingleOrganisationDashboardDataQuery,
  useGetSingleOrganisationQuery,
} from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { SingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import LoadingSpinner from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import OrgAdmins from "./Admins/OrgAdmins";
import OrgAdvisers from "./Advisers/OrgAdvisers";
import OrgCases from "./Cases/OrgCases";
import OrgLendersChart from "./Charts/LendersChart/LendersChart";
import OrgMortgagesChart from "./Charts/MortgagesChart/MortgagesChart";
import OrgClients from "./Clients/OrgClients";
import DangerZone from "./DangerZone/DangerZone";
import OrgIntroducers from "./Introducers/OrgIntroducers";
import OrgLeads from "./Leads/OrgLeads";
import OrganisationProfile from "./OrganisationProfile/OrganisationProfile";
import Overview from "./Overview/Overview";

const NetworkDirectorSingleOrganisationContainer: React.FC = () => {
  const [singleOrgInfo, setSingleOrgInfo] = useState<SingleOrganisationProps>();
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
    },
  );

  const { data: singleOrgDashboardData, isLoading: isDashboardLoading } =
    useGetSingleOrganisationDashboardDataQuery(
      { organisationslug },
      {
        skip: !organisationslug,
      },
    );

  useEffect(() => {
    if (!isLoading) {
      if (isError || !singleOrgData) {
        router.push("/dashboard/network");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (singleOrgData?.slug !== organisationslug) {
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
              singleOrgDashboardData={singleOrgDashboardData}
              isLoading={isLoading}
              isDashboardLoading={isDashboardLoading}
            />
          </Col>
          <Col md="4">
            <OrgMortgagesChart
              singleOrgInfo={singleOrgInfo}
              singleOrgDashboardData={singleOrgDashboardData}
              isLoading={isLoading}
              isDashboardLoading={isDashboardLoading}
            />
          </Col>
          <Col md="4">
            <OrgLendersChart
              singleOrgInfo={singleOrgInfo}
              singleOrgDashboardData={singleOrgDashboardData}
              isLoading={isLoading}
              isDashboardLoading={isDashboardLoading}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Overview
              singleOrgInfo={singleOrgInfo}
              singleOrgDashboardData={singleOrgDashboardData}
              isLoading={isLoading}
              isDashboardLoading={isDashboardLoading}
            />
            <OrgLeads />
            <OrgCases />
            <OrgClients />
            <OrgAdvisers />
            <OrgAdmins />
            <OrgIntroducers />
            <DangerZone singleOrgInfo={singleOrgInfo} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NetworkDirectorSingleOrganisationContainer;

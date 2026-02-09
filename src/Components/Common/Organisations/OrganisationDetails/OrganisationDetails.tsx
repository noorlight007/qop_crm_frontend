import {
  useGetSingleOrganisationDashboardDataQuery,
  useGetSingleOrganisationQuery,
} from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { SingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
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
import OrganisationDirectorInfo from "./OrganisationDirectorInfo/OrganisationDirectorInfo";
import OrganisationProfile from "./OrganisationProfile/OrganisationProfile";
import Overview from "./Overview/Overview";

const OrganisationDetails: React.FC = () => {
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
        router.push("/network/director/organisations");
        toast.error("Find Wrong URL! Redirecting...");
        return;
      }

      if (singleOrgData?.organization?.slug !== organisationslug) {
        router.push("/network/director/organisations");
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
      <Container fluid>
        <Row>
          <Col lg="6" md="12">
            <OrganisationProfile
              singleOrgInfo={singleOrgInfo}
              singleOrgDashboardData={singleOrgDashboardData}
              isLoading={isLoading}
              isDashboardLoading={isDashboardLoading}
            />
          </Col>
          <Col lg="6" md="12">
            <OrganisationDirectorInfo
              singleOrgInfo={singleOrgInfo}
              isLoading={isLoading}
            />
          </Col>
        </Row>
        <Row>
          <Col lg="6" md="12">
            <OrgMortgagesChart
              singleOrgInfo={singleOrgInfo}
              singleOrgDashboardData={singleOrgDashboardData}
              isLoading={isLoading}
              isDashboardLoading={isDashboardLoading}
            />
          </Col>
          <Col lg="6" md="12">
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

export default OrganisationDetails;

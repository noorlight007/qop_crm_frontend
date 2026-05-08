
import {
  useGetSingleOrganisationDashboardDataQuery,
  useGetSingleOrganisationQuery,
} from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { useParams } from "next/navigation";
import { Col, Row } from "reactstrap";
import OrgLendersChart from "./Charts/LendersChart/LendersChart";
import OrgMortgagesChart from "./Charts/MortgagesChart/MortgagesChart";
import DangerZone from "./DangerZone/DangerZone";
import OrganisationDirectorInfo from "./OrganisationDirectorInfo/OrganisationDirectorInfo";
import OrganisationProfile from "./OrganisationProfile/OrganisationProfile";
import Overview from "./Overview/Overview";
import Address from "./Address/Address";

const DashboardTab: React.FC = () => {
  const { organisationslug } = useParams();
  const orgSlug = Array.isArray(organisationslug)
    ? organisationslug[0]
    : organisationslug;

  const { data: singleOrgDashboardData, isLoading: isDashboardLoading } =
    useGetSingleOrganisationDashboardDataQuery(
      { organisationslug },
      {
        skip: !organisationslug,
      },
    );
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

  return (
    <>
      <Row>
        <Col lg="6" md="12">
          <OrganisationProfile
            singleOrgInfo={singleOrgData}
            singleOrgDashboardData={singleOrgDashboardData}
            isLoading={isLoading}
            isDashboardLoading={isDashboardLoading}
          />
        </Col>
        <Col lg="6" md="12">
          <OrganisationDirectorInfo
            singleOrgInfo={singleOrgData}
            isLoading={isLoading}
          />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Address singleOrgInfo={singleOrgData} isLoading={isLoading} />
        </Col>
      </Row>
      <Row>
        <Col lg="6" md="12">
          <OrgMortgagesChart
            singleOrgInfo={singleOrgData}
            singleOrgDashboardData={singleOrgDashboardData}
            isLoading={isLoading}
            isDashboardLoading={isDashboardLoading}
          />
        </Col>
        <Col lg="6" md="12">
          <OrgLendersChart
            singleOrgInfo={singleOrgData}
            singleOrgDashboardData={singleOrgDashboardData}
            isLoading={isLoading}
            isDashboardLoading={isDashboardLoading}
          />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Overview
            singleOrgInfo={singleOrgData}
            singleOrgDashboardData={singleOrgDashboardData}
            isLoading={isLoading}
            isDashboardLoading={isDashboardLoading}
          />
        </Col>
        <Col md="12">
          <DangerZone singleOrgInfo={singleOrgData} />
        </Col>
      </Row>
    </>
  );
};

export default DashboardTab;

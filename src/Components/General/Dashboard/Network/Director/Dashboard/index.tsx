import { useGetCommonDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDashboard/CommonDashboardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import MyTask from "../../../CommonComponents/MyTask/MyTask";
import OrganisationList from "../Users/Organisations/OrganisationList/OrganisationList";
import AdviserStatus from "./AdviserStatus/AdviserStatus";
import Charts from "./Charts/Charts";
import PerformanceOverview from "./PerformanceOverview/PerformanceOverview";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";

const ContainerNetworkDirector = () => {
  //RTK hooks
  const { data: commonDashboardData, isLoading } =
    useGetCommonDashboardQuery(undefined);

  // Get network name from meta data, fallback to "Not Assigned"
  const networkName = commonDashboardData?.meta?.name || "Not Assigned";

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to the Network Dashboard"
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        <PerformanceOverview
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        <Charts
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        <OrganisationList maxItems={8} />
        <AdviserStatus
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        <Row>
          <Col>
            <MyTask />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContainerNetworkDirector;

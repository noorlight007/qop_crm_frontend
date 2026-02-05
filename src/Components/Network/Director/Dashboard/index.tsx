import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LoginHistory from "@/Components/Common/LoginHistory/LoginHistory";
import MyTask from "@/Components/Common/MyTask/MyTask";
import OrganisationList from "@/Components/Common/Organisations/OrganisationList/OrganisationList";
import { useGetNetworkDirectorDashboardQuery } from "@/Redux/Reducers/Organisation/Director/Dashboard/DashdoardApi";
import { Col, Container, Row } from "reactstrap";
import AdviserStatus from "./AdviserStatus/AdviserStatus";
import Charts from "./Charts/Charts";
import PerformanceOverview from "./PerformanceOverview/PerformanceOverview";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";

const ContainerNetworkDirector = () => {
  //RTK hooks
  const { data: networkDirectorDashboardData, isLoading } =
    useGetNetworkDirectorDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to the Network Dashboard"
        parent="Dashboard"
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <PerformanceOverview
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <Charts
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <OrganisationList maxItems={8} />
        <AdviserStatus
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <Row>
          <Col>
            <MyTask />
          </Col>
        </Row>
        <Row>
          <Col>
            <LoginHistory />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContainerNetworkDirector;

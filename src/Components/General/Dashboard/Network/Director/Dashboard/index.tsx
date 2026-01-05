import { useGetNetworkDirectorDashboardQuery } from "@/Redux/Reducers/Organisation/Director/Dashboard/DashdoardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import LoginHistory from "../../../CommonComponents/LoginHistory/LoginHistory";
import MyTask from "../../../CommonComponents/MyTask/MyTask";
import ThemeColorSwitcher from "../../../CommonComponents/ThemeColorSwitcher";
import OrganisationList from "../Users/Organisations/OrganisationList/OrganisationList";
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
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          networkDirectorDashboardData={networkDirectorDashboardData}
        />
        <Row className="mb-3">
          <Col lg={6} md={12}>
            <ThemeColorSwitcher />
          </Col>
        </Row>
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

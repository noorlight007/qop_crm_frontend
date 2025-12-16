import { useGetNetworkDashboardQuery } from "@/Redux/Reducers/Organisation/Director/Dashboard/DashdoardApi";
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
  const { data: networkDashboardData, isLoading } =
    useGetNetworkDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to the Network Dashboard"
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          networkDashboardData={networkDashboardData}
        />
        <PerformanceOverview
          isLoading={isLoading}
          networkDashboardData={networkDashboardData}
        />
        <Charts
          isLoading={isLoading}
          networkDashboardData={networkDashboardData}
        />
        <OrganisationList maxItems={8} />
        <AdviserStatus
          isLoading={isLoading}
          networkDashboardData={networkDashboardData}
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

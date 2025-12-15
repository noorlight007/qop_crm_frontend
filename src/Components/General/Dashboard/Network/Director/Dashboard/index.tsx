import { useGetCommonDirectorDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDirectorDashboard/CommonDirectorDashboardApi";
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
  const { data: commonDirectorDashboardData, isLoading } =
    useGetCommonDirectorDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to the Network Dashboard"
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
        />
        <PerformanceOverview
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
        />
        <Charts
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
        />
        <OrganisationList maxItems={8} />
        <AdviserStatus
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
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

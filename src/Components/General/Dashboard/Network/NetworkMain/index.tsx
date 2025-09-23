import { useGetCommonDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDashboard/CommonDashboardApi";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonComponents/Breadcrumbs/Breadcrumbs";
import AdviserStatus from "./AdviserStatus/AdviserStatus";
import Charts from "./Charts/Charts";
import OrganisationCards from "./OrganisationCards/OrganisationCards";
import PerformanceOverview from "./PerformanceOverview/PerformanceOverview";
import RecentActivity from "./RecentActivity/RecentActivity";

const ContainerNetwork = () => {
  //RTK hooks
  const { data: commonDashboardData, isLoading } =
    useGetCommonDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to the Network Dashboard"
      />
      <Container fluid>
        <PerformanceOverview
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        <Charts
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        <OrganisationCards />
        <AdviserStatus />
        <Row>
          <RecentActivity />
        </Row>
      </Container>
    </>
  );
};

export default ContainerNetwork;

import { useGetCommonDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDashboard/CommonDashboardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonComponents/Breadcrumbs/Breadcrumbs";
import MyTask from "../../CommonComponents/MyTask/MyTask";
import AdviserStatus from "./AdviserStatus/AdviserStatus";
import Charts from "./Charts/Charts";
import OrganisationCards from "./OrganisationCards/OrganisationCards";
import PerformanceOverview from "./PerformanceOverview/PerformanceOverview";
import RecentActivity from "./RecentActivity/RecentActivity";

const ContainerNetwork = () => {
  //RTK hooks
  const { data: commonDashboardData, isLoading } =
    useGetCommonDashboardQuery(undefined);

  // Get network name from meta data, fallback to "Not Assigned"
  const networkName = commonDashboardData?.meta?.name || "Not Assigned";

  return (
    <>
      <Breadcrumbs
        title={
          isLoading ? (
            <div
              className="skeleton-loading"
              style={{
                width: "200px",
                height: "24px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
              }}
            />
          ) : (
            `${networkName} - Dashboard`
          )
        }
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
          <Col>
            <MyTask />
          </Col>
        </Row>
        <Row>
          <RecentActivity />
        </Row>
      </Container>
    </>
  );
};

export default ContainerNetwork;

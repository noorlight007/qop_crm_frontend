import { useGetCommonDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDashboard/CommonDashboardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonComponents/Breadcrumbs/Breadcrumbs";
import CaseCompletionOverTime from "./CaseCompletionOverTime/CaseCompletionOverTime";
import ClientGrowth from "./ClientGrowth/ClientGrowth";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MonthlyRevenueTrend from "./MonthlyRevenueTrend/MonthlyRevenueTrend";
import RecentAuditLogs from "./RecentAuditLogs/RecentAuditLogs";
import TopPerformingAdvisers from "./TopPerformingAdvisers/TopPerformingAdvisers";

const OrganisationContainer = () => {
  //RTK hooks
  const { data: commonDashboardData, isLoading } =
    useGetCommonDashboardQuery(undefined);

  // Get organisation name from meta data, fallback to "Not Assigned"
  const organisationName = commonDashboardData?.meta?.name || "Not Assigned";
  const networkName = commonDashboardData?.meta?.network || "Not Assigned";
  const isNetworkNotAssigned = networkName === "Not Assigned";

  return (
    <>
      <Breadcrumbs
        title={
          <>
            {organisationName} Dashboard
            <small
              className={`ms-2 ${
                isNetworkNotAssigned ? "text-muted" : "text-secondary"
              }`}
            >
              (Network: {networkName})
            </small>
          </>
        }
        subTitle="Hello there! Welcome back"
      />
      <Container fluid>
        {/* 1st row  */}
        <DashboardOverview
          isLoading={isLoading}
          commonDashboardData={commonDashboardData}
        />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MonthlyRevenueTrend />
          </Col>
          <Col md={6} sm={12}>
            <CaseCompletionOverTime />
          </Col>
        </Row>
        {/* 3rd row  */}
        <Row>
          <Col md={6} sm={12}>
            <ClientGrowth />
          </Col>
          <Col md={6} sm={12}>
            <TopPerformingAdvisers
              isLoading={isLoading}
              commonDashboardData={commonDashboardData}
            />
          </Col>
        </Row>
        {/* 4th row  */}
        <Row>
          <Col md={6} sm={12}>
            <RecentAuditLogs />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationContainer;

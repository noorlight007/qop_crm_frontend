import { useGetCommonDirectorDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDirectorDashboard/CommonDirectorDashboardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import MyTask from "../../../CommonComponents/MyTask/MyTask";
import CaseCompletionOverTime from "./CaseCompletionOverTime/CaseCompletionOverTime";
import ClientGrowth from "./ClientGrowth/ClientGrowth";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MonthlyRevenueTrend from "./MonthlyRevenueTrend/MonthlyRevenueTrend";
import RecentLoginActivity from "./RecentLoginActivity/RecentLoginActivity";
import TopPerformingAdvisers from "./TopPerformingAdvisers/TopPerformingAdvisers";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";

const OrganisationDirectorDashboardContainer = () => {
  //RTK hooks
  const { data: commonDirectorDashboardData, isLoading } =
    useGetCommonDirectorDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs title="Dashboard" subTitle="Hello there! Welcome back" />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
        />
        {/* 1st row  */}
        <DashboardOverview
          isLoading={isLoading}
          commonDirectorDashboardData={commonDirectorDashboardData}
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
              commonDirectorDashboardData={commonDirectorDashboardData}
            />
          </Col>
        </Row>
        {/* 4th row  */}
        <Row>
          <Col>
            <MyTask />
          </Col>
        </Row>
        {/* 5th row */}
        <Row>
          <Col md={6} sm={12}>
            <RecentLoginActivity />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationDirectorDashboardContainer;

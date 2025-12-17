import { useGetOrganisationDirectorDashboardQuery } from "@/Redux/Reducers/Network/Director/Dashboard/DashdoardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import LoginHistory from "../../../CommonComponents/LoginHistory/LoginHistory";
import MyTask from "../../../CommonComponents/MyTask/MyTask";
import CaseCompletionOverTime from "./CaseCompletionOverTime/CaseCompletionOverTime";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MonthlyClients from "./MonthlyClients/MonthlyClients";
import MonthlyRevenueTrend from "./MonthlyRevenueTrend/MonthlyRevenueTrend";
import TopPerformingAdvisers from "./TopPerformingAdvisers/TopPerformingAdvisers";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";

const OrganisationDirectorDashboardContainer = () => {
  //RTK hooks
  const { data: organisationDirectorDashboardData, isLoading } =
    useGetOrganisationDirectorDashboardQuery(undefined);

  return (
    <>
      <Breadcrumbs title="Dashboard" subTitle="Hello there! Welcome back" />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          organisationDirectorDashboardData={organisationDirectorDashboardData}
        />
        {/* 1st row  */}
        <DashboardOverview
          isLoading={isLoading}
          organisationDirectorDashboardData={organisationDirectorDashboardData}
        />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MonthlyRevenueTrend
              isLoading={isLoading}
              organisationDirectorDashboardData={
                organisationDirectorDashboardData
              }
            />
          </Col>
          <Col md={6} sm={12}>
            <CaseCompletionOverTime
              isLoading={isLoading}
              organisationDirectorDashboardData={
                organisationDirectorDashboardData
              }
            />
          </Col>
        </Row>
        {/* 3rd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MonthlyClients
              isLoading={isLoading}
              organisationDirectorDashboardData={
                organisationDirectorDashboardData
              }
            />
          </Col>
          <Col md={6} sm={12}>
            <TopPerformingAdvisers
              isLoading={isLoading}
              organisationDirectorDashboardData={
                organisationDirectorDashboardData
              }
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
          <Col>
            <LoginHistory />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationDirectorDashboardContainer;

import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import MyTask from "@/Components/Common/MyTask/MyTask";
import { useGetAdminDashboardDataQuery } from "@/Redux/Reducers/Organisation/Admin/Dashboard/AdminDashboardApi";
import { Col, Container, Row } from "reactstrap";
import AdviserTaskOverview from "./AdviserTaskOverview/AdviserTaskOverview";
import CaseProgress from "./CaseProgress/CaseProgress";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";

const OrganisationAdminDashboardContainer: React.FC = () => {
  const { data: adminDashboardData, isLoading } =
    useGetAdminDashboardDataQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to your dashboard"
        parent="Dashboard"
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isLoading}
          dashboardData={adminDashboardData}
        />
        {/* 1st row  */}
        <DashboardOverview
          isLoading={isLoading}
          dashboardData={adminDashboardData}
        />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <CaseStatusOverview
              isLoading={isLoading}
              dashboardData={adminDashboardData}
            />
          </Col>
          <Col md={6} sm={12}>
            <CaseProgress
              isLoading={isLoading}
              dashboardData={adminDashboardData}
            />
          </Col>
        </Row>
        {/* 3rd row  */}
        <Row>
          <Col>
            <MyTask />
          </Col>
        </Row>
        {/* 4th row  */}
        <Row>
          <Col>
            <AdviserTaskOverview
              isLoading={isLoading}
              dashboardData={adminDashboardData}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationAdminDashboardContainer;

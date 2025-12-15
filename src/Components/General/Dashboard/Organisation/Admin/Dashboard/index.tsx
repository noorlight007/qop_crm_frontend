import { Col, Container, Row } from "reactstrap";

import { useGetAdminDashboardDataQuery } from "@/Redux/Reducers/Organisation/Admin/Dashboard/AdminDashboardApi";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import MyTask from "../../../CommonComponents/MyTask/MyTask";
import AdviserTaskOverview from "./AdviserTaskOverview/AdviserTaskOverview";
import CaseProgress from "./CaseProgress/CaseProgress";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";

const OrganisationAdminDashboardContainer: React.FC = () => {
  const { data: adminDashboardData, isLoading } =
    useGetAdminDashboardDataQuery(undefined);

  return (
    <>
      <Breadcrumbs title="Dashboard" subTitle="Welcome to your dashboard" />
      <Container fluid>
        {/* 1st row  */}
        <DashboardOverview
          isLoading={isLoading}
          dashboardData={adminDashboardData}
        />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <CaseStatusOverview />
          </Col>
          <Col md={6} sm={12}>
            <CaseProgress />
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
            <AdviserTaskOverview />{" "}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationAdminDashboardContainer;

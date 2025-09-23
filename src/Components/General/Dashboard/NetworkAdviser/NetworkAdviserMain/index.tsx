import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonComponents/Breadcrumbs/Breadcrumbs";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import DocumentStatus from "./DocumentStatus/DocumentStatus";
import MonthlyPerformance from "./MonthlyPerformance/MonthlyPerformance";
import MyClients from "./MyClients/MyClients";
import UpcomingTasks from "./UpcommingTasks/UpCommingTasks";
import OrganisationCards from "./OrganisationCards/OrganisationCards";

const NetworkAdviserContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs title="Dashboard" subTitle="Welcome to your dashboard" />
      <Container fluid>
        {/* 1st row  */}
        <DashboardOverview />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MonthlyPerformance />
          </Col>
          <Col md={6} sm={12}>
            <CaseStatusOverview />
          </Col>
        </Row>
        {/* 3rd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MyClients />
          </Col>
          <Col md={6} sm={12}>
            <UpcomingTasks />
          </Col>
        </Row>
        {/* 4th row  */}
        <Row>
          <Col md={6} sm={12}>
            <DocumentStatus />
          </Col>
          <Col md={6} sm={12}>
            <OrganisationCards />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NetworkAdviserContainer;

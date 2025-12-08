import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonComponents/Breadcrumbs/Breadcrumbs";
import MyTask from "../../CommonComponents/MyTask/MyTask";
import AdviserTaskOverview from "./AdviserTaskOverview/AdviserTaskOverview";
import CaseProgress from "./CaseProgress/CaseProgress";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";

const OrganisationStaffContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs title="Dashboard" subTitle="Welcome to your dashboard" />
      <Container fluid>
        {/* 1st row  */}
        <DashboardOverview />
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

export default OrganisationStaffContainer;

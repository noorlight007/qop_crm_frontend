import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationList from "@/Components/Common/Organisations/OrganisationList/OrganisationList";
import WelcomeBanner from "@/Components/Common/WelcomeBanner/WelcomeBanner";
import { useGetAdviserDashboardSummaryDataQuery } from "@/Redux/Reducers/Common/CommonAdviserDashboard/CommonAdviserDashboardApi";
import { Col, Container, Row } from "reactstrap";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MonthlyPerformance from "./MonthlyPerformance/MonthlyPerformance";

const NetworkAdviserContainer: React.FC = () => {
  const { data: adviserSummary, isLoading: isSummaryLoading } =
    useGetAdviserDashboardSummaryDataQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to your dashboard"
        parent="Dashboard"
      />
      <Container fluid>
        <WelcomeBanner />
        {/* 1st row  */}
        <DashboardOverview
          isLoading={isSummaryLoading}
          adviserSummaryData={adviserSummary}
        />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MonthlyPerformance
              isLoading={isSummaryLoading}
              adviserSummaryData={adviserSummary}
            />
          </Col>
          <Col md={6} sm={12}>
            <CaseStatusOverview
              isLoading={isSummaryLoading}
              adviserSummaryData={adviserSummary}
            />
          </Col>
        </Row>
        {/* 3rd row  */}
        <Row>
          <Col>
            <OrganisationList maxItems={8} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NetworkAdviserContainer;

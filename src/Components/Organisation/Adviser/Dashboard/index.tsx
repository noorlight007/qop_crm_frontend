import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import WelcomeBanner from "@/Components/Common/WelcomeBanner/WelcomeBanner";
import { useGetAdviserDashboardSummaryDataQuery } from "@/Redux/Reducers/Common/CommonAdviserDashboard/CommonAdviserDashboardApi";
import { Col, Container, Row } from "reactstrap";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MonthlyPerformance from "./MonthlyPerformance/MonthlyPerformance";

const OrganisationAdviserContainer: React.FC = () => {
  const { data: adviserSummary, isLoading: isSummaryLoading } =
    useGetAdviserDashboardSummaryDataQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to your dashboard"
        items={[{ label: "Dashboard", active: true }]}
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
      </Container>
    </>
  );
};

export default OrganisationAdviserContainer;

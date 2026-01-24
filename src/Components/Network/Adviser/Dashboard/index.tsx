import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import MyTask from "@/Components/Common/MyTask/MyTask";
import {
  useGetAdviserDashboardClientDataQuery,
  useGetAdviserDashboardDocumentDataQuery,
  useGetAdviserDashboardSummaryDataQuery,
} from "@/Redux/Reducers/Common/CommonAdviserDashboard/CommonAdviserDashboardApi";
import { Col, Container, Row } from "reactstrap";
import OrganisationList from "../../Director/Users/Organisations/OrganisationList/OrganisationList";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import DocumentStatus from "./DocumentStatus/DocumentStatus";
import MonthlyPerformance from "./MonthlyPerformance/MonthlyPerformance";
import MyClients from "./MyClients/MyClients";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";

const NetworkAdviserContainer: React.FC = () => {
  const { data: adviserSummary, isLoading: isSummaryLoading } =
    useGetAdviserDashboardSummaryDataQuery(undefined);
  const { data: adviserClients, isLoading: isClientsLoading } =
    useGetAdviserDashboardClientDataQuery(undefined);
  const { data: adviserDocuments, isLoading: isDocumentsLoading } =
    useGetAdviserDashboardDocumentDataQuery(undefined);

  return (
    <>
      <Breadcrumbs
        title="Dashboard"
        subTitle="Welcome to your dashboard"
        parent="Dashboard"
      />
      <Container fluid>
        <WelcomeBanner
          isLoading={isSummaryLoading}
          adviserSummaryData={adviserSummary}
        />
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
            <MyTask />
          </Col>
        </Row>
        {/* 4th row  */}
        <Row>
          <Col>
            <OrganisationList maxItems={8} />
          </Col>
        </Row>
        {/* 5th row  */}
        <Row>
          <Col md={6} sm={12}>
            <DocumentStatus
              isLoading={isDocumentsLoading}
              adviserDocumentData={adviserDocuments}
            />
          </Col>
          <Col md={6} sm={12}>
            <MyClients
              isLoading={isClientsLoading}
              adviserClientData={adviserClients}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NetworkAdviserContainer;

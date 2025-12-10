import {
  useGetNetworkAdviserDashboardClientDataQuery,
  useGetNetworkAdviserDashboardDocumentDataQuery,
  useGetNetworkAdviserDashboardSummaryDataQuery,
} from "@/Redux/Reducers/Network/Adviser/Dashboard/DashboardApi";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import MyTask from "../../../CommonComponents/MyTask/MyTask";
import CaseStatusOverview from "./CaseStatusOverview/CaseStatusOverview";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import DocumentStatus from "./DocumentStatus/DocumentStatus";
import MonthlyPerformance from "./MonthlyPerformance/MonthlyPerformance";
import MyClients from "./MyClients/MyClients";

const OrganisationAdviserContainer: React.FC = () => {
  const { data: netAdviserSummary, isLoading: isSummaryLoading } =
    useGetNetworkAdviserDashboardSummaryDataQuery(undefined);
  const { data: netAdviserClients, isLoading: isClientsLoading } =
    useGetNetworkAdviserDashboardClientDataQuery(undefined);
  const { data: netAdviserDocuments, isLoading: isDocumentsLoading } =
    useGetNetworkAdviserDashboardDocumentDataQuery(undefined);

  return (
    <>
      <Breadcrumbs title="Dashboard" subTitle="Welcome to your dashboard" />
      <Container fluid>
        {/* 1st row  */}
        <DashboardOverview />
        {/* 2nd row  */}
        <Row>
          <Col md={6} sm={12}>
            <MonthlyPerformance
              isLoading={isSummaryLoading}
              netAdviserSummaryData={netAdviserSummary}
            />
          </Col>
          <Col md={6} sm={12}>
            <CaseStatusOverview
              isLoading={isSummaryLoading}
              netAdviserSummaryData={netAdviserSummary}
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
          <Col md={6} sm={12}>
            <DocumentStatus
              isLoading={isDocumentsLoading}
              netAdviserDocumentData={netAdviserDocuments}
            />
          </Col>
          <Col md={6} sm={12}>
            <MyClients
              isLoading={isClientsLoading}
              netAdviserClientData={netAdviserClients}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrganisationAdviserContainer;

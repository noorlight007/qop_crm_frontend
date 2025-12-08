import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import CaseAdviserActivityTrends from "./CaseAdviserActivityTrends/CaseAdviserActivityTrends";
import ComplianceStatusDistribution from "./ComplianceStatusDistribution/ComplianceStatusDistribution";
import KeyPerformanceMetrics from "./KeyPerformanceMetrics/KeyPerformanceMetrics";
import SystemReportsAnalytics from "./SystemReportsAnalytics/SystemReportsAnalytics";

const NetworkDirectorSystemReportsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="System Reports"
        subTitle="Welcome to the System Reports List"
        parent="Reports & Tasks"
        child="System Reports"
      />
      <Container fluid>
        <SystemReportsAnalytics />
        <Row>
          <CaseAdviserActivityTrends />
          <ComplianceStatusDistribution />
        </Row>
        <KeyPerformanceMetrics />
      </Container>
    </>
  );
};

export default NetworkDirectorSystemReportsContainer;

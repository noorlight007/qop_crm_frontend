import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import CaseAdviserActivityTrends from "./CaseAdviserActivityTrends/CaseAdviserActivityTrends";
import ComplianceStatusDistribution from "./ComplianceStatusDistribution/ComplianceStatusDistribution";
import KeyPerformanceMetrics from "./KeyPerformanceMetrics/KeyPerformanceMetrics";
import SystemReportsAnalytics from "./SystemReportsAnalytics/SystemReportsAnalytics";

const SystemReportsContainer: React.FC = () => {
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

export default SystemReportsContainer;

import { Col, Row } from "reactstrap";
import QuickActions from "./QuickActions/QuickActions";
import RecentActivity from "./RecentActivity/RecentActivity";

const OverviewTab: React.FC = () => {
  return (
    <Row>
      <Col md={6}>
        <RecentActivity />
      </Col>
      <Col md={6}>
        <QuickActions />
      </Col>
    </Row>
  );
};

export default OverviewTab;

import { TbChecks } from "react-icons/tb";
import { Button, Card, CardBody, Col, Row } from "reactstrap";

const QuickActions: React.FC = () => {
  return (
    <Card className="mb-4">
      <CardBody>
        <div className="d-flex align-items-center gap-2 mb-4">
          <TbChecks className="text-success fs-5" />
          <h3 className="mb-0">Quick Actions</h3>
        </div>
        <Row>
          <Col
            md={12}
            className="d-flex justify-content-center align-items-center gap-5"
          >
            <Button outline color="primary" className="px-5 py-2">
              Add New User
            </Button>
            <Button outline color="secondary" className="px-5 py-2">
              Generate Report
            </Button>
            <Button outline color="success" className="px-5 py-2">
              View Audit Logs
            </Button>
            <Button outline color="info" className="px-5 py-2">
              System Settings
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default QuickActions;

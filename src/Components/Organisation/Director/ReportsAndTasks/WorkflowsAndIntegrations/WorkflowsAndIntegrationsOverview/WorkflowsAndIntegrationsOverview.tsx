import {
  TbBoltFilled,
  TbCircleCheckFilled,
  TbGitCompare,
  TbPlayerPlayFilled,
} from "react-icons/tb";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";

const WorkflowsAndIntegrationsOverview: React.FC = () => {
  return (
    <Row>
      {/* Principal */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-primary">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Active Workflows</CardTitle>
              <CardText tag="h2" className="text-start">
                12
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-primary rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbPlayerPlayFilled className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Integrations */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-secondary">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Integrations</CardTitle>
              <CardText tag="h2" className="text-start">
                8
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-secondary rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbBoltFilled className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Automated Task */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-success">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Automated Task</CardTitle>
              <CardText tag="h2" className="text-start">
                345
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-success rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbGitCompare className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Success Rate */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-warning">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Success Rate</CardTitle>
              <CardText tag="h2" className="text-start">
                92%
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-warning rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbCircleCheckFilled className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default WorkflowsAndIntegrationsOverview;

import { FaSync, FaTwitter } from "react-icons/fa";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Row,
} from "reactstrap";

const TwitterCard: React.FC = () => {
  return (
    <Card className="shadow">
      {/* Header Section */}
      <CardBody>
        <Row className="align-items-center">
          <Col xs="8">
            <div className="d-flex align-items-center">
              <span
                className="me-2 bg-light-dark rounded-2 d-flex align-items-center justify-content-center"
                style={{ height: "40px", width: "40px" }}
              >
                <FaTwitter />
              </span>
              <div className="d-flex flex-column">
                <h5>Twitter</h5>
                <small className="text-muted">Last sync: Just now</small>
              </div>
            </div>
          </Col>
          <Col xs="4" className="text-end">
            <Badge color="dark">Disconnected</Badge>
          </Col>
        </Row>
      </CardBody>
      {/* Main Content Section */}
      <CardBody>
        <Row>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <p className="mb-1">
                <strong>Enable Platform</strong>
              </p>
            </div>
            <div>
              <FormGroup switch>
                <Input
                  type="switch"
                  role="switch"
                  className="p-2"
                  style={{ cursor: "pointer" }}
                />
              </FormGroup>
            </div>
          </div>
        </Row>
        <Row>
          <Col xs="6">
            <p className="mb-1">
              <strong>Token Expiry:</strong>
            </p>
          </Col>
          <Col xs="6" className="text-end">
            <p className="mb-1">60 days</p>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <p className="mb-1">
              <strong>Permissions:</strong>
            </p>
          </Col>
          <Col xs="6" className="text-end">
            <a href="#" className="text-primary">
              View Details
            </a>
          </Col>
        </Row>
      </CardBody>

      {/* Action Buttons */}
      <CardBody className="p-3">
        <Row>
          <Col xs="6">
            <Button color="secondary" block>
              <FaSync className="me-1" />
              Refresh Token
            </Button>
          </Col>
          <Col xs="6">
            <Button color="danger" block>
              Disconnect
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default TwitterCard;

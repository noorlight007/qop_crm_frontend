import {
  TbCrown,
  TbSettingsQuestion,
  TbShieldHalfFilled,
  TbUsers,
} from "react-icons/tb";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";

const UsersAndRolesOverview: React.FC = () => {
  return (
    <Row>
      {/* Principal */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-primary">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Principal</CardTitle>
              <CardText tag="h2" className="text-start">
                2
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-primary rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbCrown className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Adviser */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-secondary">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Adviser</CardTitle>
              <CardText tag="h2" className="text-start">
                8
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-secondary rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbUsers className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Admin */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-success">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Admin</CardTitle>
              <CardText tag="h2" className="text-start">
                3
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-success rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbShieldHalfFilled className="fs6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Support */}
      <Col md="3" sm="6">
        <Card className="text-center  shadow-sm bg-light-warning">
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h6">Support</CardTitle>
              <CardText tag="h2" className="text-start">
                2
              </CardText>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center bg-warning rounded-3"
                style={{ width: "30px", height: "30px" }}
              >
                <TbSettingsQuestion className="fs-6" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default UsersAndRolesOverview;

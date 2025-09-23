import { FaRegChartBar } from "react-icons/fa";
import { TbCalendar, TbMessage2Filled, TbUsers } from "react-icons/tb";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const MarketingHubOverview: React.FC = () => {
  return (
    <Row>
      <Col>
        <Card>
          <CardHeader className="text-end">
            <Button color="primary">
              New Campaign <i className="fa-solid fa-circle-plus ms-1"></i>
            </Button>
          </CardHeader>
          <CardBody className="pb-0">
            <Row className="g-3">
              <Col md={3}>
                <Card className="border-0 shadow">
                  <CardBody className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted">Active Campaigns</h6>
                      <h3>8</h3>
                      <span className="text-success bg-light-primary rounded-4 px-2 mt-1">
                        +12%
                      </span>
                    </div>
                    <div>
                      <span
                        className="d-flex align-items-center justify-content-center bg-primary rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <FaRegChartBar className="fs-6" />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow">
                  <CardBody className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted">WhatsApp Messages</h6>
                      <h3>247</h3>
                      <span className="text-secondary bg-light-secondary rounded-4 px-2 mt-1">
                        +28%
                      </span>
                    </div>
                    <div>
                      <span
                        className="d-flex align-items-center justify-content-center bg-secondary rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbMessage2Filled className="fs-6" />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow">
                  <CardBody className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted">Scheduled Posts</h6>
                      <h3>15</h3>
                      <span className="text-success bg-light-success rounded-4 px-2 mt-1">
                        +5%
                      </span>
                    </div>
                    <div>
                      <span
                        className="d-flex align-items-center justify-content-center bg-success rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbCalendar className="fs-6" />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow">
                  <CardBody className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted">New Leads</h6>
                      <h3>32</h3>
                      <span className="text-warning bg-light-warning rounded-4 px-2 mt-1">
                        +45%
                      </span>
                    </div>
                    <div>
                      <span
                        className="d-flex align-items-center justify-content-center bg-warning rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbUsers className="fs-6" />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default MarketingHubOverview;

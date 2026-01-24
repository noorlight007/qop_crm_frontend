import { Badge, Button, Card, CardBody, Col, Progress, Row } from "reactstrap";

const ActiveCampaigns: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>Active Campaigns</h3>
          <small>
            Monitor and manage your running lead generation campaigns
          </small>
        </div>
        <div>
          {/* 1st card  */}
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex gap-2">
                  <h5 className="m-0 fw-semibold">First Time Buyer Campaign</h5>
                  <div>
                    <Badge color="success" pill>
                      Active
                    </Badge>
                    <Badge color="dark" pill>
                      Facebook
                    </Badge>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <Button color="secondary" size="sm">
                    Edit
                  </Button>
                  <Button color="danger" size="sm">
                    Pause
                  </Button>
                </div>
              </div>
              <div>
                <Row>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Budget</span>
                      <br />
                      <strong>£500</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Spent</span>
                      <br />
                      <strong>£245</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Impressions</span>
                      <br />
                      <strong>15,420</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Clicks</span>
                      <br />
                      <strong>234</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Leads</span>
                      <br />
                      <strong className="text-success">18</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Cost/Lead</span>
                      <br />
                      <strong>£13.61</strong>
                    </p>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-1 mb-1">
                  <div>
                    <small>Running: 2024-01-15 to 2024-01-29</small>
                  </div>
                  <div className="d-flex gap-3">
                    <small>
                      <i className="fas fa-eye"></i> CTR: 1.52%
                    </small>
                    <small>
                      <i className="fas fa-chart-line"></i> Conv: 7.7%
                    </small>
                  </div>
                </div>
                <div>
                  <Progress
                    animated
                    striped
                    color="success"
                    value={70}
                    style={{ height: "10px" }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          {/* 2nd card  */}
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex gap-2">
                  <h5 className="m-0 fw-semibold">Remortgage Specialists</h5>
                  <div>
                    <Badge color="success" pill>
                      Active
                    </Badge>
                    <Badge color="dark" pill>
                      LinkedIn
                    </Badge>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <Button color="secondary" size="sm">
                    Edit
                  </Button>
                  <Button color="danger" size="sm">
                    Pause
                  </Button>
                </div>
              </div>
              <div>
                <Row>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Budget</span>
                      <br />
                      <strong>£800</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Spent</span>
                      <br />
                      <strong>£245</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Impressions</span>
                      <br />
                      <strong>8,930</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Clicks</span>
                      <br />
                      <strong>156</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Leads</span>
                      <br />
                      <strong className="text-success">12</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Cost/Lead</span>
                      <br />
                      <strong>£47.25</strong>
                    </p>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-1 mb-1">
                  <div>
                    <small>Running: 2024-01-10 to 2024-01-31</small>
                  </div>
                  <div className="d-flex gap-3">
                    <small>
                      <i className="fas fa-eye"></i> CTR: 1.72%
                    </small>
                    <small>
                      <i className="fas fa-chart-line"></i> Conv: 7.8%
                    </small>
                  </div>
                </div>
                <div>
                  <Progress
                    animated
                    striped
                    color="success"
                    value={80}
                    style={{ height: "10px" }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          {/* 3rd card  */}
          <Card className="shadow mb-2">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex gap-2">
                  <h5 className="m-0 fw-semibold">First Time Buyer Campaign</h5>
                  <div>
                    <Badge color="success" pill>
                      Active
                    </Badge>
                    <Badge color="dark" pill>
                      Facebook
                    </Badge>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <Button color="secondary" size="sm">
                    Edit
                  </Button>
                  <Button color="danger" size="sm">
                    Pause
                  </Button>
                </div>
              </div>
              <div>
                <Row>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Budget</span>
                      <br />
                      <strong>£500</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Spent</span>
                      <br />
                      <strong>£245</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Impressions</span>
                      <br />
                      <strong>15,420</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Clicks</span>
                      <br />
                      <strong>234</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Leads</span>
                      <br />
                      <strong className="text-success">18</strong>
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p className="mb-1">
                      <span className="text-muted">Cost/Lead</span>
                      <br />
                      <strong>£13.61</strong>
                    </p>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-1 mb-1">
                  <div>
                    <small>Running: 2024-01-15 to 2024-01-29</small>
                  </div>
                  <div className="d-flex gap-3">
                    <small>
                      <i className="fas fa-eye"></i> CTR: 1.22%
                    </small>
                    <small>
                      <i className="fas fa-chart-line"></i> Conv: 5.4%
                    </small>
                  </div>
                </div>
                <div>
                  <Progress
                    animated
                    striped
                    color="success"
                    value={50}
                    style={{ height: "10px" }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default ActiveCampaigns;

import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const KeyPerformanceMetrics: React.FC = () => {
  return (
    <Row>
      <Col>
        <Card className="shadow-sm mb-4">
          <CardBody className="px-4 py-4">
            <div className="d-flex align-items-center mb-4">
              <i className="fas fa-chart-line me-2 text-primary"></i>
              <h3 className="mb-0">Key Performance Metrics</h3>
            </div>
            <Row>
              <div className="d-flex align-items-center justify-content-center gap-5">
                <Card className="px-5 mb-4 mb-md-0">
                  <div className="d-flex flex-column">
                    <h2 className="fs-1 text-info">1,847</h2>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-success">
                        <i className="fas fa-arrow-up me-1"></i>
                        +12% vs last month
                      </span>
                    </div>
                    <span className="opacity-75 small">
                      Total Cases This Month
                    </span>
                  </div>
                </Card>

                <Card className="px-5 mb-4 mb-md-0">
                  <div className="d-flex flex-column">
                    <h2 className="fs-1 text-success">98.7%</h2>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-success">
                        <i className="fas fa-arrow-up me-1"></i>
                        +0.3% vs last month
                      </span>
                    </div>
                    <span className="opacity-75 small">System Uptime</span>
                  </div>
                </Card>

                <Card className="px-5 mb-4 mb-md-0">
                  <div className="d-flex flex-column">
                    <h2 className="fs-1 text-secondary">156</h2>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-success">All operational</span>
                    </div>
                    <span className="opacity-75 small">
                      API Integrations Active
                    </span>
                  </div>
                </Card>

                <Card className="px-5 mb-4 mb-md-0">
                  <div className="d-flex flex-column">
                    <h2 className="fs-1 text-primary">4.2s</h2>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-success">
                        <i className="fas fa-arrow-down me-1"></i>
                        -0.8s vs last month
                      </span>
                    </div>
                    <span className="opacity-75 small">Avg Response Time</span>
                  </div>
                </Card>
              </div>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default KeyPerformanceMetrics;

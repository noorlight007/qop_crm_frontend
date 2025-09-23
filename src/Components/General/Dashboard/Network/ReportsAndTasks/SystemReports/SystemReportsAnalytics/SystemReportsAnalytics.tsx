import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import "./SystemReportsAnalytics.css";

const SystemReportsAnalytics: React.FC = () => {
  const [reportType, setReportType] = useState("Select report type");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-white border-bottom">
        <h3 className="mb-0 d-flex align-items-center">
          <i className="fas fa-chart-line me-2"></i>
          System Reports & Analytics
        </h3>
      </CardHeader>
      <CardBody>
        <Row className="mb-4 g-3">
          <Col md={2}>
            <select
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">Select report type...</option>
              <option value="Activity Report">Activity Report</option>
              <option value="Volume Analysis">Volume Analysis</option>
              <option value="Compliance Report">Compliance Report</option>
            </select>
          </Col>

          <Col md={3}>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="form-control p-2 small"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <div className="date-label">From date</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="form-control p-2 small"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <div className="date-label">To date</div>
            </div>
          </Col>

          <Col md={2}>
            <select className="form-select">
              <option value="">All AR Firms</option>
              <option value="firm-a">Firm A</option>
              <option value="firm-b">Firm B</option>
            </select>
          </Col>

          <Col md={2}>
            <Button color="primary" className="w-100">
              <FaFilter className="me-2" />
              Generate
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <CardBody>
                <h5 className="mb-3">Adviser Activity Report</h5>
                <p className="text-muted mb-4">
                  Detailed activity metrics for all advisers
                </p>
                <Button color="primary" outline className="w-100">
                  <i className="fas fa-download me-2"></i>
                  Generate Report
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <CardBody>
                <h5 className="mb-3">Case Volume Analysis</h5>
                <p className="text-muted mb-4">
                  Case processing volumes and trends
                </p>
                <Button color="primary" outline className="w-100">
                  <i className="fas fa-download me-2"></i>
                  Generate Report
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <CardBody>
                <h5 className="mb-3">Compliance Summary</h5>
                <p className="text-muted mb-4">
                  Compliance status across all AR firms
                </p>
                <Button color="primary" outline className="w-100">
                  <i className="fas fa-download me-2"></i>
                  Generate Report
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <CardBody>
                <h5 className="mb-3">System Usage Metrics</h5>
                <p className="text-muted mb-4">
                  Platform usage statistics and performance
                </p>
                <Button color="primary" outline className="w-100">
                  <i className="fas fa-download me-2"></i>
                  Generate Report
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <CardBody>
                <h5 className="mb-3">Integration Performance</h5>
                <p className="text-muted mb-4">
                  Third-party integration status and logs
                </p>
                <Button color="primary" outline className="w-100">
                  <i className="fas fa-download me-2"></i>
                  Generate Report
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SystemReportsAnalytics;

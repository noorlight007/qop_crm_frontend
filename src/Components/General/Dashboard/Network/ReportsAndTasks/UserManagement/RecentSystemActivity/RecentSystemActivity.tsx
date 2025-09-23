import React from "react";
import { FaClock } from "react-icons/fa"; // For the clock icon
import { Card, CardBody, Col, Row } from "reactstrap";

const RecentSystemActivity: React.FC = () => {
  return (
    <Card className="recent-activity-card shadow-sm">
      <CardBody>
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <span className="me-1 fs-5 text-primary">
            <FaClock />
          </span>
          <h3 className="mb-0">Recent System Activity</h3>
        </div>

        {/* Content */}
        <Row>
          {/* Column 1: Cases processed today */}
          <Col md="4" className="text-center">
            <div className="activity-item">
              <p className="fs-4 fw-bold text-primary">847</p>
              <small className="text-muted">Cases processed today</small>
            </div>
          </Col>

          {/* Column 2: New user registrations */}
          <Col md="4" className="text-center">
            <div className="activity-item">
              <p className="fs-4 fw-bold text-success">23</p>
              <small className="text-muted">New user registrations</small>
            </div>
          </Col>

          {/* Column 3: Integration API calls */}
          <Col md="4" className="text-center">
            <div className="activity-item">
              <p className="fs-4 fw-bold text-secondary">156</p>
              <small className="text-muted">Integration API calls</small>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default RecentSystemActivity;

import React from "react";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";

const AlertsNotifications: React.FC = () => {
  return (
    <div>
      <h5 className="mb-4">Security Alerts & Notifications</h5>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <CardBody>
              <h6>Failed Login Attempts</h6>
              <FormGroup className="mt-3">
                <div className="form-check form-switch">
                  <Input type="switch" id="failedLogin" />
                  <Label check for="failedLogin">
                    Alert on multiple failed attempts
                  </Label>
                </div>
              </FormGroup>
              <small className="text-muted d-block mt-2">
                Threshold: 5 attempts in 15 minutes
              </small>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardBody>
              <h6>Data Export Activities</h6>
              <FormGroup className="mt-3">
                <div className="form-check form-switch">
                  <Input type="switch" id="dataExport" />
                  <Label check for="dataExport">
                    Alert on bulk data exports
                  </Label>
                </div>
              </FormGroup>
              <small className="text-muted d-block mt-2">
                Notify executives on large exports
              </small>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <CardBody>
              <h6>Unusual Access Patterns</h6>
              <FormGroup className="mt-3">
                <div className="form-check form-switch">
                  <Input type="switch" id="unusualAccess" />
                  <Label check for="unusualAccess">
                    Alert on suspicious activity
                  </Label>
                </div>
              </FormGroup>
              <small className="text-muted d-block mt-2">
                Monitor for unusual login locations
              </small>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardBody>
              <h6>System Changes</h6>
              <FormGroup className="mt-3">
                <div className="form-check form-switch">
                  <Input type="switch" id="systemChanges" />
                  <Label check for="systemChanges">
                    Alert on configuration changes
                  </Label>
                </div>
              </FormGroup>
              <small className="text-muted d-block mt-2">
                Immediate notification to admins
              </small>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AlertsNotifications;

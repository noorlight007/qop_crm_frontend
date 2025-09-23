import React from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

const SystemSettings: React.FC = () => {
  return (
    <div>
      <h5 className="mb-4">Password Requirements</h5>
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Minimum Password Length</Label>
              <Input
                type="range"
                min="8"
                max="24"
                value="12"
                className="w-100"
              />
              <small className="text-muted">12 characters</small>
            </FormGroup>
            <FormGroup className="mt-3">
              <div className="form-check form-switch">
                <Input type="switch" id="uppercase" />
                <Label check for="uppercase">
                  Require uppercase letters
                </Label>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="form-check form-switch">
                <Input type="switch" id="numbers" />
                <Label check for="numbers">
                  Require numbers
                </Label>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <div className="form-check form-switch">
                <Input type="switch" id="lowercase" />
                <Label check for="lowercase">
                  Require lowercase letters
                </Label>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="form-check form-switch">
                <Input type="switch" id="special" />
                <Label check for="special">
                  Require special characters
                </Label>
              </div>
            </FormGroup>
          </Col>
        </Row>

        <h5 className="mt-4 mb-4">Authentication Settings</h5>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Session Timeout</Label>
              <Input
                type="range"
                min="5"
                max="60"
                value="30"
                className="w-100"
              />
              <small className="text-muted">30 minutes</small>
            </FormGroup>
            <FormGroup className="mt-3">
              <div className="form-check form-switch">
                <Input type="switch" id="twoFactor" />
                <Label check for="twoFactor">
                  Enable Two-Factor Authentication
                </Label>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <div className="form-check form-switch">
                <Input type="switch" id="ipWhitelist" />
                <Label check for="ipWhitelist">
                  Enable IP Whitelisting
                </Label>
              </div>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SystemSettings;

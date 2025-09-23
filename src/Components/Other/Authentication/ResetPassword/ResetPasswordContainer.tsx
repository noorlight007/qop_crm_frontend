"use client";
import { Col, Container, Row } from "reactstrap";
import { CommonLogo } from "../Common/CommonLogo";
import { ResetPasswordForm } from "./ResetPasswordForm";

const ResetPasswordContainer = () => {
  return (
    <div className="page-wrapper">
      <Container fluid className="p-0">
        <Row>
          <Col xs="12">
            <div className="login-card login-dark">
              <div>
                <div>
                  <CommonLogo />
                </div>
                <div className="login-main">
                  <ResetPasswordForm />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default ResetPasswordContainer;

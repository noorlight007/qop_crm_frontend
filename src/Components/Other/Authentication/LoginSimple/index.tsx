"use client";
import { Col, Container, Row } from "reactstrap";
import { LoginForm } from "../Common/LoginForm";

const LoginSimpleContainer = () => {
  return (
    <Container className="p-0" fluid>
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <div className="login-card login-dark">
            <LoginForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default LoginSimpleContainer;

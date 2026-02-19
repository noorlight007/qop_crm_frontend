"use client";

import React from "react";
import { Col, Container, Row } from "reactstrap";
import Info from "./Components/Info";
import SurveyForm from "./Components/SurveyForm";

const ClientSurveyContainer: React.FC = () => {
  return (
    <Container fluid className="min-vh-100 py-4 px-5">
      <Row className="g-4 align-items-start">
        <Col xs={12}>
          <Info />
        </Col>

        <Col xs={12} style={{ marginTop: "clamp(0px, 3vw, 10px)" }}>
          <SurveyForm />
        </Col>
      </Row>
    </Container>
  );
};

export default ClientSurveyContainer;

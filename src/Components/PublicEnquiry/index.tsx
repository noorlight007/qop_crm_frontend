import { Col, Container, Row } from "reactstrap";
import AboutOrg from "./Components/AboutOrg";
import InitialEnquiryForm from "./Components/EnquiryForm";

const EnquiryContainer: React.FC = () => {
  return (
    <Container fluid className="min-vh-100">
      <Row className="py-4">
        <Col
          xs={12}
          lg={4}
          className="mb-4 mb-lg-0"
          style={{ marginTop: "clamp(0px, 10vw, 30px)" }}
        >
          <AboutOrg />
        </Col>
        <Col xs={12} lg={8} style={{ marginTop: "clamp(0px, 10vw, 30px)" }}>
          <InitialEnquiryForm />
        </Col>
      </Row>
    </Container>
  );
};

export default EnquiryContainer;

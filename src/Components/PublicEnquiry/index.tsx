import { Col, Container, Row } from "reactstrap";
import AboutOrg from "./Components/AboutOrg";
import InitialEnquiryForm from "./Components/EnquiryForm";

const EnquiryContainer: React.FC = () => {
  return (
    <Container fluid className="min-vh-100">
      <Row className="py-4">
        <Col xs={12}  md={4} className="mb-4 mb-md-0">
          <AboutOrg />
        </Col>
        <Col xs={12}  md={8} style={{ marginTop: 'clamp(0px, 10vw, 100px)' }}>
          <InitialEnquiryForm />
        </Col>
      </Row>
    </Container>
  );
};

export default EnquiryContainer;

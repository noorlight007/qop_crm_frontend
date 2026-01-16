import { Col, Container, Row } from "reactstrap";
import AboutOrg from "./Components/AboutOrg";
import InitialEnquiryForm from "./Components/InitialEnquiryForm";

const EnquiryContainer: React.FC = () => {
  return (
    <Container fluid className="min-vh-100">
      <Row className="py-4 w-100d">
        <Col xs={12} sm={12} md={3} className="mb-4 mb-md-0">
          <AboutOrg />
        </Col>
        <Col xs={12} sm={12} md={9} style={{ marginTop: 'clamp(0px, 10vw, 100px)' }}>
          <InitialEnquiryForm />
        </Col>
      </Row>
    </Container>
  );
};

export default EnquiryContainer;

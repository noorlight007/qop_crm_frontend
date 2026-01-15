import { Col, Container, Row } from "reactstrap";
import AboutOrg from "./Components/AboutOrg";
import InitialEnquiryForm from "./Components/InitialEnquiryForm";

const EnquiryContainer: React.FC = () => {
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-content-center"
    >
      <Row className="py-4">
        <Col md={3}>
          <AboutOrg />
        </Col>
        <Col md={9}>
          <InitialEnquiryForm />
        </Col>
      </Row>
    </Container>
  );
};

export default EnquiryContainer;

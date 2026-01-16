import { Col, Container, Row } from "reactstrap";
import AboutOrg from "./Components/AboutOrg";
import InitialEnquiryForm from "./Components/InitialEnquiryForm";

const EnquiryContainer: React.FC = () => {
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center"
    >
      <Row className="py-4 w-100">
        <Col xs={12} sm={12} md={3} className="mb-4 mb-md-0">
          <AboutOrg />
        </Col>
        <Col xs={12} sm={12} md={9}>
          <InitialEnquiryForm />
        </Col>
      </Row>
    </Container>
  );
};

export default EnquiryContainer;

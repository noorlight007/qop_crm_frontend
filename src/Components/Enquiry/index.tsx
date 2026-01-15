import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";
import InitialEnquiryForm from "./Components/InitialEnquiryForm";
import AboutOrg from "./Components/AboutOrg";

const EnquiryContainer: React.FC = () => {
  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-content-center">
      <Row className="mx-xxl-4 py-4 justify-content-center">
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

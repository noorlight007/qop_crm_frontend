import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";
import Test from "./Components/Test";

const EnquiryContainer: React.FC = () => {
  return (
    <Container fluid>
      <Row className="page-title">
        <Col sm="6">
          <h2>Enquiry</h2>
          <p className="mb-0 text-title-gray">
            Please fill out the form below to submit your enquiry.
          </p>
        </Col>
        <Col sm="6">
          <Breadcrumb className="justify-content-sm-end align-items-center">
            <BreadcrumbItem>
              <i className="iconly-Home icli svg-color" />
            </BreadcrumbItem>
            <BreadcrumbItem>Enquiry</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <Test />
        </Col>
      </Row>
    </Container>
  );
};

export default EnquiryContainer;

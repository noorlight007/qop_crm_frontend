import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Common/Breadcrumbs/Breadcrumbs";
import About from "./About/About";
import Address from "./Address/Address";
import ContactInfo from "./ContactInfo/ContactInfo";

const CompanyInfoContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Company Info"
        subTitle="Manage your company information"
        items={[{ label: "Company Info", active: true }]}
      />
      <Row>
        <Col md="12">
          <About />
        </Col>
        <Col md="12">
          <ContactInfo />
        </Col>
        <Col md="12">
          <Address />
        </Col>
      </Row>
    </>
  );
};

export default CompanyInfoContainer;

import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import ComplianceList from "./ComplianceList/ComplianceList";

const ComplianceContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliances Overview"
        subTitle="Welcome back! Check all the Compliances"
        items={[{ label: "Users" }, { label: "Compliances", active: true }]}
      />
      <Container fluid>
        <Row>
          <ComplianceList />
        </Row>
      </Container>
    </>
  );
};

export default ComplianceContainer;

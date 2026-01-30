import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import ComplianceAssistantList from "./ComplianceAssistantList/ComplianceAssistantList";

const ComplianceAssistantContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliance Assistants Overview"
        subTitle="Welcome back! Check all the Compliance Assistants"
        parent="Compliance Assistants"
      />
      <Container fluid>
        <Row>
          <ComplianceAssistantList />
        </Row>
      </Container>
    </>
  );
};

export default ComplianceAssistantContainer;

import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkComplianceAssistantContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliance Assistant Overview"
        subTitle="Welcome to the Compliance Assistant Status"
        parent="Users"
        child="Compliance Assistants"
      />
      <Container fluid>
        <AuthUsers
          userRole="NETWORK_COMPLIANCE_ASSISTANT"
          title="Compliance Assistants"
        />
      </Container>
    </>
  );
};

export default NetworkComplianceAssistantContainer;

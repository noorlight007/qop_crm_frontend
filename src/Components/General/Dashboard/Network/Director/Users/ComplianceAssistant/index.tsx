import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/General/Dashboard/CommonComponents/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkComplianceAssistantContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliance Assistant Overview"
        subTitle="Welcome to the Compliance Assistant Overview"
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

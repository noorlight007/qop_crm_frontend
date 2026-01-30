import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const ComplianceAssistantList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Compliance Assistant" roles="NETWORK_COMPLIANCE_ASSISTANT"/>
      </Container>
    </>
    </div>
  );
};

export default ComplianceAssistantList;
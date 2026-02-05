import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const ComplianceList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers title="Compliance" roles="NETWORK_COMPLIANCE_ASSISTANT" />
        </Container>
      </>
    </div>
  );
};

export default ComplianceList;

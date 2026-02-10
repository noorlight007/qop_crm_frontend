import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const ComplianceList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers title="Compliance" roles="COMPLIANCE" />
        </Container>
      </>
    </div>
  );
};

export default ComplianceList;

import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const LeadList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers title="Lead" roles="LEAD" />
        </Container>
      </>
    </div>
  );
};

export default LeadList;

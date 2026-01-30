import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const LeadList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Lead" roles="LEAD"/>
      </Container>
    </>
    </div>
  );
};

export default LeadList;
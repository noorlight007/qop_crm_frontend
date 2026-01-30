import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const ClientList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Client" roles="CLIENT"/>
      </Container>
    </>
    </div>
  );
};

export default ClientList;
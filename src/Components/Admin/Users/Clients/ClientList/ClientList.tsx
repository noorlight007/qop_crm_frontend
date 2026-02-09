import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const ClientList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers title="Client" roles="CLIENT" />
        </Container>
      </>
    </div>
  );
};

export default ClientList;

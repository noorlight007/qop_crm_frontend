import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const AdminList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Admins" roles="ORGANISATION_ADMIN"/>
      </Container>
    </>
    </div>
  );
};

export default AdminList;
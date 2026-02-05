import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const AdminList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers title="Admin" roles="ORGANISATION_ADMIN" />
        </Container>
      </>
    </div>
  );
};

export default AdminList;

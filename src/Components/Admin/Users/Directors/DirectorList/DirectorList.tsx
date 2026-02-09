import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const DirectorList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers
            title="Director"
            roles={"DIRECTOR"}
          />
        </Container>
      </>
    </div>
  );
};

export default DirectorList;

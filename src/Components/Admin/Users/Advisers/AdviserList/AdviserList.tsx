import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const AdviserList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers
            title="Adviser"
            roles={"ADVISER"}
          />
        </Container>
      </>
    </div>
  );
};

export default AdviserList;

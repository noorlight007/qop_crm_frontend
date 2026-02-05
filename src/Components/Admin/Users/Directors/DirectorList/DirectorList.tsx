import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const DirectorList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers
            title="Director"
            roles={["NETWORK_DIRECTOR", "ORGANISATION_DIRECTOR"]}
          />
        </Container>
      </>
    </div>
  );
};

export default DirectorList;

import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const DirectorList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Director" roles={["NETWORK_DIRECTOR", "ORGANISATION_DIRECTOR"]}/>
      </Container>
    </>
    </div>
  );
};

export default DirectorList;